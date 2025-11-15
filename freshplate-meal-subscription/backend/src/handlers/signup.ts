import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import crypto from "node:crypto";
import { docClient } from "../lib/dynamo";
import { hashPassword, issueToken } from "../lib/auth";
import { ok, errorResponse } from "../lib/responses";

const USERS_TABLE = process.env.USERS_TABLE ?? "";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!USERS_TABLE) {
      return errorResponse("USERS_TABLE not configured", 500);
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const { name, email, password } = body as Record<string, string>;

    if (!name || !email || !password) {
      return errorResponse("name, email and password are required", 400);
    }

    const normalizedEmail = email.toLowerCase();

    const existing = await docClient.send(
      new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: "gsi1",
        KeyConditionExpression: "gsi1pk = :email",
        ExpressionAttributeValues: {
          ":email": `EMAIL#${normalizedEmail}`,
        },
        Limit: 1,
      })
    );

    if (existing.Count && existing.Items && existing.Items.length > 0) {
      return errorResponse("Email already registered", 409);
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

    return ok({
      token,
      user: { userId, name, email: normalizedEmail, role: "user", createdAt: now },
    }, 201);
  } catch (err) {
    console.error("signup error", err);
    return errorResponse("Signup failed", 500);
  }
};
