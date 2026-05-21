import type { ICreateIssueBody, ILoginBody, ISignupBody, IUpdateIssueBody } from "./type";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateSignup = (
  body: Partial<ISignupBody>,
): ValidationResult => {
  const errors: string[] = [];
  if (!body.name?.trim()) errors.push("name is required");
  if (!body.email?.trim()) errors.push("email is required");
  if (!body.password?.trim()) errors.push("password is required");
  if (body.role && !["contributor", "maintainer"].includes(body.role)) {
    errors.push("role must be contributor or maintainer");
  }
  // Basic email format check
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push("email format is invalid");
  }
  return { valid: errors.length === 0, errors };
};

export const validateLogin = (body: Partial<ILoginBody>): ValidationResult => {
  const errors: string[] = [];
  if (!body.email?.trim()) errors.push("email is required");
  if (!body.password?.trim()) errors.push("password is required");
  return { valid: errors.length === 0, errors };
};

export const validateCreateIssue = (
  body: Partial<ICreateIssueBody>,
): ValidationResult => {
  const errors: string[] = [];
  if (!body.title?.trim()) errors.push("title is required");
  if (body.title && body.title.length > 150)
    errors.push("title must be 150 characters or fewer");
  if (!body.description?.trim()) errors.push("description is required");
  if (body.description && body.description.trim().length < 20) {
    errors.push("description must be at least 20 characters");
  }
  if (!body.type) errors.push("type is required");
  if (body.type && !["bug", "feature_request"].includes(body.type)) {
    errors.push("type must be bug or feature_request");
  }
  return { valid: errors.length === 0, errors };
};

export function validateUpdateIssue(
  body: Partial<IUpdateIssueBody>,
): ValidationResult {
  const errors: string[] = [];
  if (body.title !== undefined) {
    if (!body.title.trim()) errors.push("title cannot be empty");
    if (body.title.length > 150)
      errors.push("title must be 150 characters or fewer");
  }
  if (body.description !== undefined) {
    if (body.description.trim().length < 20) {
      errors.push("description must be at least 20 characters");
    }
  }
  if (
    body.type !== undefined &&
    !["bug", "feature_request"].includes(body.type)
  ) {
    errors.push("type must be bug or feature_request");
  }
  if (
    body.status !== undefined &&
    !["open", "in_progress", "resolved"].includes(body.status)
  ) {
    errors.push("status must be open, in_progress, or resolved");
  }
  return { valid: errors.length === 0, errors };
}