import { test as base, expect, type Page } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { platform, arch } from "node:os";
import { origin, fixedTime } from "./environment";

export const test = base.extend<{ diagnostics: (page: Page) => void }>({
  diagnostics: [
    async ({ page, browser }, use, info) => {
      const messages: { kind: string; text: string }[] = [];
      const pageErrors: string[] = [];
      const external: string[] = [];
      const observe = (target: Page) => {
        target.on("console", (message) =>
          messages.push({ kind: message.type(), text: message.text() }),
        );
        target.on("pageerror", (error) => {
          pageErrors.push(error.message);
          messages.push({ kind: "pageerror", text: error.message });
        });
        target.on("requestfailed", (request) =>
          messages.push({
            kind: "requestfailed",
            text: `${request.method()} ${request.url()} ${request.failure()?.errorText}`,
          }),
        );
        target.context().on("request", (request) => {
          if (
            /^https?:/.test(request.url()) &&
            new URL(request.url()).origin !== origin
          )
            external.push(request.url());
        });
      };
      observe(page);
      await page.clock.setFixedTime(new Date(fixedTime));
      await use(observe);
      const environment = JSON.parse(
        await readFile(
          fileURLToPath(
            new URL(
              `../../../output/playwright/e2e/${process.env.LIGHTWEIGHT_E2E_RUN_ID}/environment.json`,
              import.meta.url,
            ),
          ),
          "utf8",
        ),
      );
      const metadata = {
        runId: process.env.LIGHTWEIGHT_E2E_RUN_ID,
        gitRevision: environment.gitRevision,
        workingTreeDirty: environment.workingTreeDirty,
        codeFingerprint: environment.codeFingerprint,
        node: process.version,
        platform: platform(),
        arch: arch(),
        browser: browser.version(),
        project: info.project.name,
        test: info.title,
        retry: info.retry,
        repeatEachIndex: info.repeatEachIndex,
        status: info.status,
        expectedStatus: info.expectedStatus,
        fixedTime,
        origin,
        data: "synthetic only; empty independent browser context; no Auth/Supabase",
        externalRequests: external,
      };
      for (const [name, contents] of [
        ["execution.json", metadata],
        ["console.json", messages],
      ] as const) {
        const path = info.outputPath(name);
        await writeFile(path, JSON.stringify(contents, null, 2));
        await info.attach(name, { path, contentType: "application/json" });
      }
      expect(pageErrors, "Unexpected unhandled browser exceptions").toEqual([]);
      expect(external, "Local E2E must not contact external services").toEqual(
        [],
      );
    },
    { auto: true },
  ],
});
export { expect };
