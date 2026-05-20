import type { ILoginBody, ISignupBody } from "./type";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateSignup=(body: Partial<ISignupBody>): ValidationResult =>{
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
}

export const validateLogin=(body: Partial<ILoginBody>): ValidationResult =>{
  const errors: string[] = [];
  if (!body.email?.trim()) errors.push("email is required");
  if (!body.password?.trim()) errors.push("password is required");
  return { valid: errors.length === 0, errors };
}