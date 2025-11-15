import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

const JWT_SECRET = process.env.JWT_SECRET ?? "";
if (!JWT_SECRET) {
  console.warn("JWT_SECRET is not set. Tokens will fail.");
}

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const issueToken = (payload: Record<string, unknown>, expiresIn = "7d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const getAuthContext = (event: APIGatewayProxyEventV2) => {
  const header = event.headers?.authorization || event.headers?.Authorization;
  if (!header) return null;
  const [, token] = header.split(" ");
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
    return decoded;
  } catch {
    return null;
  }
};
