import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { PutCommand, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "node:crypto";
import { docClient } from "./lib/dynamo";
import { decodeAuthHeader, hashPassword, issueToken, verifyPassword } from "./lib/auth";

const USERS_TABLE = process.env.USERS_TABLE ?? "";
const ORDERS_TABLE = process.env.ORDERS_TABLE ?? "";

if (!USERS_TABLE) {
  console.warn("USERS_TABLE env var is not set. Express API will fail.");
}
if (!ORDERS_TABLE) {
  console.warn("ORDERS_TABLE env var is not set. Order routes will fail.");
}

const app = express();
app.use(cors());
app.use(express.json());

interface AuthedRequest extends Request {
  auth?: { sub: string; email?: string; role?: string };
}

const requireAuth = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const payload = decodeAuthHeader(req.headers.authorization as string | undefined);
  if (!payload || typeof payload.sub !== "string") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.auth = {
    sub: payload.sub as string,
    email: (payload.email as string) ?? undefined,
    role: (payload.role as string) ?? undefined,
  };
  next();
};

app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }
    const normalizedEmail = (email as string).toLowerCase();

    const existing = await docClient.send(
      new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: "gsi1",
        KeyConditionExpression: "gsi1pk = :email",
        ExpressionAttributeValues: { ":email": `EMAIL#${normalizedEmail}` },
        Limit: 1,
      })
    );

    if (existing.Count && existing.Items && existing.Items.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();

    await docClient.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: {
          pk: `USER#${userId}`,
          sk: "PROFILE",
          userId,
          name,
          email: normalizedEmail,
          passwordHash,
          role: "user",
          createdAt: now,
          gsi1pk: `EMAIL#${normalizedEmail}`,
        },
        ConditionExpression: "attribute_not_exists(pk)",
      })
    );

    const token = issueToken({ sub: userId, email: normalizedEmail, role: "user" });
    return res.status(201).json({ token, user: { userId, name, email: normalizedEmail, role: "user", createdAt: now } });
  } catch (err) {
    console.error("signup error", err);
    return res.status(500).json({ message: "Signup failed" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    const normalizedEmail = (email as string).toLowerCase();

    const result = await docClient.send(
      new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: "gsi1",
        KeyConditionExpression: "gsi1pk = :email",
        ExpressionAttributeValues: { ":email": `EMAIL#${normalizedEmail}` },
        Limit: 1,
      })
    );

    const user = result.Items?.[0];
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = issueToken({ sub: user.userId, email: user.email, role: user.role });
    return res.json({
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("login error", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

app.get("/users/me", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.auth?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRes = await docClient.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { pk: `USER#${req.auth.sub}`, sk: "PROFILE" },
      })
    );

    if (!userRes.Item) {
      return res.status(404).json({ message: "User not found" });
    }

    let orders: unknown[] = [];
    if (ORDERS_TABLE) {
      const orderRes = await docClient.send(
        new QueryCommand({
          TableName: ORDERS_TABLE,
          KeyConditionExpression: "pk = :pk",
          ExpressionAttributeValues: { ":pk": `USER#${req.auth.sub}` },
        })
      );
      orders = orderRes.Items ?? [];
    }

    return res.json({
      user: {
        userId: userRes.Item.userId,
        name: userRes.Item.name,
        email: userRes.Item.email,
        role: userRes.Item.role,
        createdAt: userRes.Item.createdAt,
      },
      orders,
    });
  } catch (err) {
    console.error("me endpoint error", err);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
});

app.post("/orders", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.auth?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!ORDERS_TABLE) {
      return res.status(500).json({ message: "ORDERS_TABLE not configured" });
    }
    const { items, total, status = "pending", subscription } = req.body ?? {};
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "items must be an array" });
    }

    const orderId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await docClient.send(
      new PutCommand({
        TableName: ORDERS_TABLE,
        Item: {
          pk: `USER#${req.auth.sub}`,
          sk: `ORDER#${orderId}`,
          orderId,
          items,
          total,
          status,
          createdAt,
          gsi1pk: `ORDER#${orderId}`,
        },
      })
    );

    let subscriptionRecord = null;
    if (subscription && typeof subscription === "object") {
      const subscriptionId = crypto.randomUUID();
      subscriptionRecord = {
        pk: `USER#${req.auth.sub}`,
        sk: `SUBSCRIPTION#${subscriptionId}`,
        subscriptionId,
        orderId,
        ...subscription,
      };
      await docClient.send(
        new PutCommand({
          TableName: ORDERS_TABLE,
          Item: subscriptionRecord,
        })
      );
    }

    return res.status(201).json({
      order: { orderId, items, total, status, createdAt },
      subscription: subscriptionRecord,
    });
  } catch (err) {
    console.error("create order error", err);
    return res.status(500).json({ message: "Failed to create order" });
  }
});

app.get("/orders", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.auth?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!ORDERS_TABLE) {
      return res.status(500).json({ message: "ORDERS_TABLE not configured" });
    }

    const result = await docClient.send(
      new QueryCommand({
        TableName: ORDERS_TABLE,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": `USER#${req.auth.sub}` },
      })
    );

    const orders = (result.Items ?? []).filter((item) => item.sk?.startsWith("ORDER#"));
    const subscriptions = (result.Items ?? []).filter((item) => item.sk?.startsWith("SUBSCRIPTION#"));

    return res.json({ orders, subscriptions });
  } catch (err) {
    console.error("list orders error", err);
    return res.status(500).json({ message: "Failed to list orders" });
  }
});

const PORT = process.env.PORT ?? "8080";

app.get("/healthz", (_req, res) => res.json({ status: "ok" }));

app.listen(Number(PORT), () => {
  console.log(`API server listening on port ${PORT}`);
});
