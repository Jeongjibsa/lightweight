import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { verifyPagesDeployment } from "../../scripts/verify-pages-deployment.mjs";

const headers = {
  "Content-Security-Policy": "default-src 'self'; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=()",
};

async function fixture(run) {
  const directory = await mkdtemp(join(tmpdir(), "lightweight-deploy-check-"));
  const files = {
    "index.html": "<html>synthetic app</html>",
    "sw.js": "// synthetic service worker",
    "manifest.webmanifest": JSON.stringify({
      display: "standalone",
      start_url: "/",
    }),
    _headers:
      "/*\n" +
      Object.entries(headers)
        .map(([name, value]) => `  ${name}: ${value}`)
        .join("\n"),
  };
  try {
    await Promise.all(
      Object.entries(files).map(([name, text]) =>
        writeFile(join(directory, name), text),
      ),
    );
    await run(directory, (url) => {
      const name = new URL(url).pathname.slice(1) || "index.html";
      return new Response(files[name], { status: 200, headers });
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("checked release files and all configured headers must match", async () => {
  await fixture(async (directory, request) => {
    const result = await verifyPagesDeployment(
      directory,
      "https://example.invalid",
      request,
    );
    assert.equal(result.files, 3);
    assert.equal(result.origin, "https://example.invalid");
  });
});

test("a missing security header or old service worker fails the release check", async () => {
  await fixture(async (directory, request) => {
    await assert.rejects(
      verifyPagesDeployment(directory, "https://example.invalid", () => {
        const response = request("https://example.invalid");
        response.headers.delete("content-security-policy");
        return response;
      }),
      /Missing response header/,
    );
    await assert.rejects(
      verifyPagesDeployment(directory, "https://example.invalid", (url) =>
        new URL(url).pathname === "/sw.js"
          ? new Response("old service worker", { status: 200 })
          : request(url),
      ),
      /Deployed asset differs: sw.js/,
    );
  });
});

test("non-HTTPS URLs and credential or query URLs cause no requests", async () => {
  for (const origin of [
    "http://example.invalid",
    "https://user:password@example.invalid",
    "https://example.invalid/?token=synthetic",
  ]) {
    await assert.rejects(
      verifyPagesDeployment("not-read", origin, () => {
        assert.fail("Invalid origin must not make a network request");
      }),
      /bare HTTPS origin/,
    );
  }
});
