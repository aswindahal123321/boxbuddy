import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { docClient } from "../lib/dynamo";
import { getAuthContext } from "../lib/auth";
import { ok, errorResponse } from "../lib/responses";

const USERS_TABLE = process.env.USERS_TABLE ?? "";
const ORDERS_TABLE = process.env.ORDERS_TABLE ?? "";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const auth = getAuthContext(event);
    if (!auth?.sub || typeof auth.sub !== "string") {
      return errorResponse("Unauthorized", 401);
    }
    if (!USERS_TABLE) return errorResponse("USERS_TABLE not configured", 500);

    const userRes = await docClient.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { pk: `USER#${auth.sub}`, sk: "PROFILE" },
      })
    );

    if (!userRes.Item) return errorResponse("User not found", 404);

    let orders = [];
    if (ORDERS_TABLE) {
      const orderRes = await docClient.send(
        new QueryCommand({
          TableName: ORDERS_TABLE,
          KeyConditionExpression: "pk = :pk",
          ExpressionAttributeValues: {
            ":pk": `USER#${auth.sub}`,
          },
        })
      );
      orders = orderRes.Items ?? [];
    }

    return ok({
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
    console.error("me error", err);
    return errorResponse("Failed to fetch profile", 500);
  }
};
