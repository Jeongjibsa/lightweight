import pg from "pg";
import dns from "node:dns/promises";
import { readFileSync } from "node:fs";
const ca = readFileSync(
  new URL("../../supabase/certs/prod-ca-2021.crt", import.meta.url),
  "utf8",
);
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("Browser project configuration is missing");
const response = await fetch(`${url}/auth/v1/settings`, {
  headers: { apikey: key },
  signal: AbortSignal.timeout(12000),
});
const settings = await response.json();
console.log(
  JSON.stringify(
    {
      authSettingsStatus: response.status,
      emailEnabled: settings.external?.email,
      signupDisabled: settings.disable_signup,
    },
    null,
    2,
  ),
);
for (const rpc of ["training_snapshot_read", "training_snapshot_write"]) {
  const body = rpc.endsWith("write")
    ? {
        p_operation_id: "00000000-0000-4000-8000-000000000001",
        p_expected_revision: 0,
        p_snapshot: {},
      }
    : {};
  const result = await fetch(`${url}/rest/v1/rpc/${rpc}`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12000),
  });
  const data = await result.json();
  console.log(
    JSON.stringify({
      rpc,
      unauthenticatedStatus: result.status,
      errorCode: data.code,
    }),
  );
  if (![401, 403].includes(result.status))
    throw new Error("Anonymous RPC protection check failed");
}
if (process.env.SUPABASE_PASSWORD || process.env.SUPABASE_DB_URL) {
  const config = process.env.SUPABASE_DB_URL
    ? { connectionString: process.env.SUPABASE_DB_URL }
    : {
        host: `db.${new URL(url).hostname.split(".")[0]}.supabase.co`,
        port: 5432,
        database: "postgres",
        user: "postgres",
        password: process.env.SUPABASE_PASSWORD,
      };
  if (!process.env.SUPABASE_DB_URL) {
    const host = config.host;
    config.host = (await dns.resolve6(host))[0];
    config.ssl = { rejectUnauthorized: true, servername: host, ca };
  }
  const client = new pg.Client({
    ...config,
    ssl: config.ssl ?? { rejectUnauthorized: true, ca },
    connectionTimeoutMillis: 12000,
  });
  try {
    await client.connect();
    const result = await client.query(
      "select current_setting('server_version') as version, (select count(*) from information_schema.tables where table_schema='public')::int as public_tables",
    );
    console.log(JSON.stringify({ database: "connected", ...result.rows[0] }));
  } catch (error) {
    console.log(
      JSON.stringify({
        database: "unavailable",
        errorCode: error.code ?? error.name,
      }),
    );
  } finally {
    await client.end();
  }
}
