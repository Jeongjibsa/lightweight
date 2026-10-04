const port = Number(process.env.LIGHTWEIGHT_E2E_PORT ?? 4188);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error("Invalid E2E port");
export const origin = `http://127.0.0.1:${port}`;
export const fixedTime = "2026-10-04T03:00:00.000Z";

export const buildHeaders = (build: "v1" | "v2") => ({
  "x-e2e-build": build,
  "x-e2e-run": process.env.LIGHTWEIGHT_E2E_RUN_ID!,
});
