import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { config } from "../../config";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import type { ILoginBody, ISignupBody } from "../../utils/type";
import { validateLogin, validateSignup } from "../../utils/validation";
import { createUser, loginUser } from "./auth.service";

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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body as Partial<ILoginBody>;

    // Validation
    const { valid, errors } = validateLogin(body);

    if (!valid) {
      sendError(res, StatusCodes.BAD_REQUEST, "Validation failed", errors);
      return;
    }

    // Service call
    const result = await loginUser(body as ILoginBody);

    // Save token in cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Success response
    sendSuccess(res, StatusCodes.OK, "Login successful", {
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
};
