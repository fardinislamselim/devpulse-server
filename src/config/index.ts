import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
  quiet: true,
});

export const config = {
  port: process.env.PORT,
  connection_string: process.env.DB_CONNECTION as string,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
  node_env: process.env.NODE_ENV,
};