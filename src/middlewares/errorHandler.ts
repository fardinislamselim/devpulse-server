import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError } from "../utils/sendResponse";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(`[Error] ${err.message}`, err.stack);

  sendError(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    "An unexpected error occurred.",
    err.message,
  );
}

export function notFound(req: Request, res: Response): void {
  sendError(
    res,
    StatusCodes.NOT_FOUND,
    `Route ${req.method} ${req.originalUrl} not found.`,
  );
}
