import jwt from "jsonwebtoken";
import { config } from "../config";
import type { IJwtPayload } from "./type";

const jwt_secret = config.jwt_secret;
const jwt_expires_in = config.jwt_expires_in;

export function signToken(payload: Omit<IJwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, jwt_secret as string, {
    expiresIn: jwt_expires_in,
  } as jwt.SignOptions);
}