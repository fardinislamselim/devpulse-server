import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
  quiet: true,
});

export const config = {
  port: process.env.PORT,
  connection_string: process.env.DB_CONNECTION as string,
  node_env: process.env.NODE_ENV,
};