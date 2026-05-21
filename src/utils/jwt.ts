import jwt, { type SignOptions } from "jsonwebtoken";
import { config } from "../config";
import type { IJwtPayload } from "./type";

const jwt_secret = config.jwt_secret as string;

const jwt_expires_in = (config.jwt_expires_in ?? "7d") as NonNullable<
  SignOptions["expiresIn"]
>;

export const signToken = (
  payload: Omit<IJwtPayload, "iat" | "exp">,
): string => {
  const options: SignOptions = {
    expiresIn: jwt_expires_in,
  };

  return jwt.sign(payload, jwt_secret, options);
};

export const verifyToken = (token: string): IJwtPayload => {
  return jwt.verify(token, jwt_secret) as IJwtPayload;
};
