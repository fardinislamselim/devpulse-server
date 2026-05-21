import type { NextFunction, Request, Response } from "express";
import type { ICreateIssueBody } from "../../utils/type";
import { validateCreateIssue } from "../../utils/validation";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { createIssueService } from "./issues.service";


export const createIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body as Partial<ICreateIssueBody>;

    // Validation
    const { valid, errors } = validateCreateIssue(body);

    if (!valid) {
      sendError(res, StatusCodes.BAD_REQUEST, "Validation failed", errors);

      return;
    }

    // User ID from JWT
    const reporterId = req.user!.id;

    // Service call
    const issue = await createIssueService(
      body as ICreateIssueBody,
      reporterId,
    );

    // Success response
    sendSuccess(res, StatusCodes.CREATED, "Issue created successfully", issue);
  } catch (err) {
    next(err);
  }
};
