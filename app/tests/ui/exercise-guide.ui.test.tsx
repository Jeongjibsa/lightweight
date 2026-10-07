import { MantineProvider } from "@mantine/core";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi, afterEach } from "vitest";
import { ExerciseGuide } from "../../src/components/exercise-guide";
import { guideFixture } from "../fixtures/guides";
afterEach(() => vi.unstubAllGlobals());
it("종목이 바뀌면 이전 종목 설명을 노출하지 않는다", async () => {
  let resolveNext!: (response: Response) => void;
  const next = new Promise<Response>((resolve) => {
    resolveNext = resolve;
  });
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            schemaVersion: 1,
            registryVersion: "test",
            exercises: [guideFixture()],
          }),
        ),
      )
      .mockReturnValueOnce(next),
  );
  const component = (id: string) => (
    <MantineProvider env="test">
      <ExerciseGuide exerciseId={id} />
    </MantineProvider>
  );
  const view = render(component("squat"));
  await screen.findByText("합성 테스트 설명");
  view.rerender(component("dumbbell-bench"));
  expect(screen.queryByText("합성 테스트 설명")).toBeNull();
  resolveNext(
    new Response(
      JSON.stringify({
        schemaVersion: 1,
        registryVersion: "test",
        exercises: [],
      }),
    ),
  );
  await screen.findByText(/아직 검토가 완료된 설명이 없어요/);
});
it("검토 설명·한계·해석 구분·원문 링크를 함께 읽는다", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          schemaVersion: 1,
          registryVersion: "test",
          exercises: [guideFixture()],
        }),
      ),
    ),
  );
  render(
    <MantineProvider env="test">
      <ExerciseGuide exerciseId="squat" />
    </MantineProvider>,
  );
  await screen.findByText("합성 테스트 설명");
  expect(screen.getByText(/적용 한계: 실제 운동 안내가 아닙니다/)).toBeTruthy();
  expect(
    screen.getByRole("link", { name: "SRC-test 원문" }).getAttribute("href"),
  ).toBe("https://example.invalid/source");
});
it("미검토/잘못된 묶음은 설명을 제공하지 않고 실패 후 다시 읽는다", async () => {
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(
      new Response(
        JSON.stringify({ schemaVersion: 9, exercises: [guideFixture()] }),
      ),
    )
    .mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          schemaVersion: 1,
          registryVersion: "test",
          exercises: [],
        }),
      ),
    );
  vi.stubGlobal("fetch", fetch);
  render(
    <MantineProvider env="test">
      <ExerciseGuide exerciseId="squat" />
    </MantineProvider>,
  );
  await screen.findByText("운동 설명을 불러오지 못했어요");
  expect(screen.queryByText("합성 테스트 설명")).toBeNull();
  await userEvent
    .setup()
    .click(screen.getByRole("button", { name: "설명 다시 불러오기" }));
  await waitFor(() =>
    expect(screen.getByText(/아직 검토가 완료된 설명이 없어요/)).toBeTruthy(),
  );
});
