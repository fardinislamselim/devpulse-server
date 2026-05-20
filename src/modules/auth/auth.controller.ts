import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { sendError, sendSuccess } from "../../utils/sendResponse";
import { validateSignup } from "../../utils/validation";

import type { ISignupBody } from "../../utils/type";

import { createUser } from "./auth.service";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body as Partial<ISignupBody>;

    // Validation
    const { valid, errors } = validateSignup(body);

    if (!valid) {
      sendError(res, StatusCodes.BAD_REQUEST, "Validation failed", errors);
      return;
    }

    // Service call
    const user = await createUser(body as ISignupBody);

    // Success response
    sendSuccess(res, StatusCodes.CREATED, "User registered successfully", user);
  } catch (err) {
    next(err);
  }
};
