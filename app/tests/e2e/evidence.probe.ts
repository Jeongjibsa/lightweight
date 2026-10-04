import { test, expect } from "./fixture";
// Deliberately fails only in the dedicated harness self-check, never the normal suite.
test("HAR-05 intentional failure artifact probe", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "의도적인 하네스 실패 표본",
      exact: true,
    }),
  ).toBeVisible({ timeout: 200 });
});
