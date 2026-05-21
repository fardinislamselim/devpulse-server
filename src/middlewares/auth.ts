import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import type { IJwtPayload } from "../utils/type";

// Extend Express Request with decoded user info
declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers.authorization;

  if (!token) {
    sendError(
      res,
      StatusCodes.UNAUTHORIZED,
      "Access denied. No token provided.",
    );
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    sendError(
      res,
      StatusCodes.UNAUTHORIZED,
      "Access denied. Invalid or expired token.",
    );
  }
};
