import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
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

    const result = await docClient.send(
      new QueryCommand({
        TableName: ORDERS_TABLE,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: {
          ":pk": `USER#${auth.sub}`,
        },
      })
    );

    const orders = (result.Items ?? []).filter((item) => item.sk?.startsWith("ORDER#"));
    const subscriptions = (result.Items ?? []).filter((item) => item.sk?.startsWith("SUBSCRIPTION#"));

    return ok({ orders, subscriptions });
  } catch (err) {
    console.error("listOrders error", err);
    return errorResponse("Failed to list orders", 500);
  }
};
