import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { docClient } from "../lib/dynamo";
import { verifyPassword, issueToken } from "../lib/auth";
import { ok, errorResponse } from "../lib/responses";

const USERS_TABLE = process.env.USERS_TABLE ?? "";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!USERS_TABLE) return errorResponse("USERS_TABLE not configured", 500);

    const body = event.body ? JSON.parse(event.body) : {};
    const { email, password } = body as Record<string, string>;

    if (!email || !password) return errorResponse("email and password are required", 400);

    const normalizedEmail = email.toLowerCase();

    const result = await docClient.send(
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

    const user = result.Items?.[0];
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return errorResponse("Invalid credentials", 401);
    }

    const token = issueToken({ sub: user.userId, email: user.email, role: user.role });

    return ok({
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
    return errorResponse("Login failed", 500);
  }
};
