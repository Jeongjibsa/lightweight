import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkPagesArtifact } from "./check-pages-artifact.mjs";

const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

// Read-only checks of the exact uploaded files; no account or workout data.
export async function verifyPagesDeployment(
  directory,
  origin,
  request = fetch,
) {
  const url = new URL(origin);
  assert(
    url.protocol === "https:" &&
      url.pathname === "/" &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash,
    "Provide a bare HTTPS origin without credentials",
  );
  const artifact = await checkPagesArtifact(directory);
  const rootResponse = await request(url, {
    redirect: "error",
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(rootResponse.status, 200, "HTTPS app is unavailable");
  const headers = {};
  for (const name of [
    "content-security-policy",
    "x-content-type-options",
    "x-frame-options",
    "referrer-policy",
    "permissions-policy",
  ]) {
    headers[name] = rootResponse.headers.get(name);
    assert(headers[name], `Missing response header: ${name}`);
  }
  assert.equal(headers["x-content-type-options"], "nosniff");
  assert.equal(headers["x-frame-options"], "DENY");
  const policies = await readFile(resolve(directory, "_headers"), "utf8");
  for (const line of policies.split("\n")) {
    const match = line.match(/^\s+([^:]+):\s*(.+)$/);
    if (match) {
      assert.equal(
        rootResponse.headers.get(match[1]),
        match[2].trim(),
        `Response policy differs: ${match[1]}`,
      );
    }
  }
  const rootBytes = Buffer.from(await rootResponse.arrayBuffer());
  assert.equal(
    digest(rootBytes),
    digest(await readFile(resolve(directory, "index.html"))),
    "Deployed app does not match the checked build",
  );
  const assets = [];
  for (const path of artifact.paths.filter(
    (path) => !["_headers", "index.html"].includes(path),
  )) {
    const response = await request(new URL(path, url), {
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    assert.equal(response.status, 200, `Missing deployed asset: ${path}`);
    const hash = digest(Buffer.from(await response.arrayBuffer()));
    assert.equal(
      hash,
      digest(await readFile(resolve(directory, path))),
      `Deployed asset differs: ${path}`,
    );
    assets.push({ path, sha256: hash });
  }
  return {
    checkedAt: new Date().toISOString(),
    origin: url.origin,
    files: assets.length + 1,
    indexSha256: digest(rootBytes),
    headers,
    assets,
    limits: "Read-only file/header verification; no real Auth or device test",
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const result = await verifyPagesDeployment(
    process.argv[3] ?? "dist",
    process.argv[2],
  );
  console.log(JSON.stringify(result, null, 2));
}
