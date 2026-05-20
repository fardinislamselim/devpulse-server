import bcrypt from "bcrypt";
import { queryOne } from "../../db";
import type { ISignupBody, IUser, IPublicUser } from "../../utils/type";

const SALT_ROUNDS = 10;

export const createUser = async (
  payload: ISignupBody,
): Promise<IPublicUser> => {
  const { name, email, password, role = "contributor" } = payload;

  // Duplicate email check
  const existing = await queryOne<IUser>(
    "SELECT id FROM users WHERE email = $1",
    [email.toLowerCase()],
  );

  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const newUser = await queryOne<IPublicUser>(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name.trim(), email.toLowerCase().trim(), hashedPassword, role],
  );

  if (!newUser) {
    throw new Error("Failed to create user.");
  }

  return newUser;
};
