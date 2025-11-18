import { PutCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import crypto from "node:crypto";
import { docClient } from "../lib/dynamo";
import { getAuthContext } from "../lib/auth";
import { ok, errorResponse } from "../lib/responses";

const ORDERS_TABLE = process.env.ORDERS_TABLE ?? "";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const auth = getAuthContext(event);
    if (!auth?.sub || typeof auth.sub !== "string") {
      return errorResponse("Unauthorized", 401);
    }
    if (!ORDERS_TABLE) return errorResponse("ORDERS_TABLE not configured", 500);

    const body = event.body ? JSON.parse(event.body) : {};
    const { items, total, status = "pending", subscription } = body as Record<string, unknown>;

    if (!items || !Array.isArray(items)) {
      return errorResponse("items must be an array", 400);
    }

    const orderId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await docClient.send(
      new PutCommand({
        TableName: ORDERS_TABLE,
        Item: {
          pk: `USER#${auth.sub}`,
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
        pk: `USER#${auth.sub}`,
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

    return ok({
      order: {
        orderId,
        items,
        total,
        status,
        createdAt,
      },
      subscription: subscriptionRecord,
    }, 201);
  } catch (err) {
    console.error("createOrder error", err);
    return errorResponse("Failed to create order", 500);
  }
};
