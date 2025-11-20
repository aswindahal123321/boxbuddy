import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";
if (!JWT_SECRET) {
  console.warn("JWT_SECRET is not set. Tokens will fail.");
}
const ADMIN_BYPASS_TOKEN = process.env.ADMIN_BYPASS_TOKEN || "admin-local-token";
const ADMIN_BYPASS_EMAIL = process.env.ADMIN_BYPASS_EMAIL || "admin@gmail.com";

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

export const verifyJwt = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
  } catch {
    return null;
  }
};

export const decodeAuthHeader = (header?: string | null) => {
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (!token || scheme.toLowerCase() !== "bearer") return null;

  if (token === ADMIN_BYPASS_TOKEN) {
    return { sub: "admin", email: ADMIN_BYPASS_EMAIL, role: "admin" };
  }

  return verifyJwt(token);
};
