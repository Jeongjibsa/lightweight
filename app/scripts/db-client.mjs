import pg from "pg";
import { readFileSync } from "node:fs";
export function databaseClient() {
  if (!process.env.SUPABASE_DB_URL)
    throw new Error("Server-only SUPABASE_DB_URL is required");
  const url = new URL(process.env.SUPABASE_DB_URL);
  if (url.search || url.hash)
    throw new Error("Use a DB URI without SSL query overrides");
  return new pg.Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: {
      rejectUnauthorized: true,
      ca: readFileSync(
        new URL("../../supabase/certs/prod-ca-2021.crt", import.meta.url),
        "utf8",
      ),
    },
    connectionTimeoutMillis: 12000,
    statement_timeout: 15000,
  });
}
