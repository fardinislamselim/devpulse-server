import type { Response } from "express";


// Consistent success envelope
export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
): void {
  const body: Record<string, unknown> = { success: true, message };
  if (data !== undefined) body.data = data;
  res.status(statusCode).json(body);
}

// Consistent error envelope
export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown,
): void {
  const body: Record<string, unknown> = { success: false, message };
  if (errors !== undefined) body.errors = errors;
  res.status(statusCode).json(body);
}
