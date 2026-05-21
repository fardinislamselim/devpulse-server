import type { NextFunction, Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import {
  createIssueService,
  getAllIssuesService,
  getIssueByIdService,
  updateIssueService,
} from "./issues.service";
import type {
  ICreateIssueBody,
  IIssue,
  IIssueQueryParams,
  IUpdateIssueBody,
} from "../../utils/type";
import {
  validateCreateIssue,
  validateUpdateIssue,
} from "../../utils/validation";
import { queryOne } from "../../db";

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

export const getAllIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = req.query as IIssueQueryParams;

    const data = await getAllIssuesService(query);

    sendSuccess(res, StatusCodes.OK, "Issues fetched successfully", data);
  } catch (err) {
    next(err);
  }
};

export const getIssueById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Type guard
    if (!id || Array.isArray(id)) {
      sendError(res, StatusCodes.BAD_REQUEST, "Invalid issue ID");

      return;
    }

    const issue = await getIssueByIdService(id);

    if (!issue) {
      sendError(res, StatusCodes.NOT_FOUND, "Issue not found.");

      return;
    }

    sendSuccess(res, StatusCodes.OK, "Issue fetched successfully", issue);
  } catch (err) {
    next(err);
  }
};

export const updateIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Parse issue ID
    const issueId = Number(req.params.id);

    if (Number.isNaN(issueId)) {
      sendError(res, StatusCodes.BAD_REQUEST, "Invalid issue ID.");

      return;
    }

    // Current logged in user
    const user = req.user!;

    // Request body
    const body = req.body as Partial<IUpdateIssueBody>;

    // Validation
    const { valid, errors } = validateUpdateIssue(body);

    if (!valid) {
      sendError(res, StatusCodes.BAD_REQUEST, "Validation failed", errors);

      return;
    }

    // Service call
    const updated = await updateIssueService(issueId, body, user);

    // Success response
    sendSuccess(res, StatusCodes.OK, "Issue updated successfully", updated);
  } catch (err) {
    next(err);
  }
};