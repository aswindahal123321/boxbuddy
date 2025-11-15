import type { ApiResponse } from "../types";

const baseHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

export const ok = (body: unknown, statusCode = 200): ApiResponse => ({
  statusCode,
  headers: baseHeaders,
  body: JSON.stringify(body),
});

export const errorResponse = (message: string, statusCode = 400): ApiResponse => ({
  statusCode,
  headers: baseHeaders,
  body: JSON.stringify({ message }),
});
