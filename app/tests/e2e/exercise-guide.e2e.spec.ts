import { test, expect } from "./fixture";
import { guideFixture } from "../fixtures/guides";

test.describe("SCI 공개 설명 소비 계약", () => {
  test.use({ serviceWorkers: "block" });
  test("합성 설명의 종류·한계·출처와 응답 오류 후 재시도", async ({
    page,
  }, info) => {
    let requests = 0;
    await page.route("**/content/exercise-guides.json", (route) => {
      requests++;
      return route.fulfill(
        requests === 1
          ? { status: 503, body: "synthetic unavailable" }
          : {
              json: {
                schemaVersion: 1,
                registryVersion: "synthetic",
                exercises: [guideFixture()],
              },
            },
      );
    });
    await page.goto("/#library");
    await page
      .getByRole("button", { name: "바벨 스쿼트 정보", exact: true })
      .click();
    await expect(page.getByText("운동 설명을 불러오지 못했어요")).toBeVisible();
    await page.getByRole("button", { name: "설명 다시 불러오기" }).click();
    await expect(page.getByText("합성 테스트 설명")).toBeVisible();
    await expect(
      page.getByText("적용 한계: 실제 운동 안내가 아닙니다"),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "SRC-test 원문", exact: true }),
    ).toHaveAttribute("href", "https://example.invalid/source");
    await page.screenshot({ path: info.outputPath("synthetic-guide-390.png") });
    expect(requests).toBe(2);
  });
});
