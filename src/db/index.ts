import { Pool } from "pg";
import { config } from "../config";

export const pool = new Pool({
  connectionString: process.env.DB_CONNECTION,
  ssl: config.node_env === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export const initDb = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(255)        NOT NULL,
        email       VARCHAR(255)        NOT NULL UNIQUE,
        password    VARCHAR(255)        NOT NULL,
        role        VARCHAR(20)         NOT NULL DEFAULT 'contributor'
                      CHECK (role IN ('contributor', 'maintainer')),
        created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
      );
    `);

    // Issues table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id           SERIAL PRIMARY KEY,
        title        VARCHAR(150)        NOT NULL,
        description  TEXT                NOT NULL,
        type         VARCHAR(20)         NOT NULL
                       CHECK (type IN ('bug', 'feature_request')),
        status       VARCHAR(20)         NOT NULL DEFAULT 'open'
                       CHECK (status IN ('open', 'in_progress', 'resolved')),
        reporter_id  INTEGER             NOT NULL,
        created_at   TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        updated_at   TIMESTAMPTZ         NOT NULL DEFAULT NOW()
      );
    `);

    console.log(" Database tables initialised successfully");
  } catch (err) {
    console.error("DB init failed:", err);
    process.exit(1);
  }
};
