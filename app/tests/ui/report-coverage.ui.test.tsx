import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { RecordCoverage } from "../../src/components/report-coverage";
import {
  now,
  profileFixture,
  sessionFixture,
  setFixture,
} from "../fixtures/training";

it("빈 기록/미설정에서 설정과 오늘 화면으로 직접 이동한다", async () => {
  const settings = vi.fn(),
    today = vi.fn();
  render(
    <MantineProvider env="test">
      <RecordCoverage
        profile={profileFixture({ preferences: null })}
        sessions={[]}
        now={now}
        inspect={vi.fn()}
        settings={settings}
        today={today}
      />
    </MantineProvider>,
  );
  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", { name: "훈련 설정 입력", exact: true }),
  );
  await user.click(
    screen.getByRole("button", { name: "운동 기록하기", exact: true }),
  );
  expect(settings).toHaveBeenCalledTimes(1);
  expect(today).toHaveBeenCalledTimes(1);
  expect(screen.getByText("미설정")).toBeTruthy();
});
it("실제 입력 점검/직접 재개와 props 수정 재계산을 연결한다", async () => {
  const active = sessionFixture({ status: "active", endedAt: null });
  const partial = sessionFixture({
    status: "partial",
    sets: [
      setFixture(),
      setFixture({ completedAt: null, load: null, reps: null }),
    ],
  });
  const inspect = vi.fn();
  const component = (sessions: (typeof active)[]) => (
    <MantineProvider env="test">
      <RecordCoverage
        profile={profileFixture()}
        sessions={sessions}
        now={now}
        inspect={inspect}
        settings={vi.fn()}
        today={vi.fn()}
      />
    </MantineProvider>
  );
  const view = render(component([active, partial]));
  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", { name: "진행 중 기록 확인", exact: true }),
  );
  await user.click(
    screen.getByRole("button", { name: "미완료 기록 확인", exact: true }),
  );
  expect(inspect.mock.calls).toEqual([[active], [partial]]);
  expect(screen.getByText(/완료 본세트 1행 중 RIR 미입력 1행/)).toBeTruthy();
  view.rerender(
    component([
      {
        ...partial,
        sets: partial.sets.map((set) => ({
          ...set,
          completedAt: now.toISOString(),
          load: 0,
          reps: 8,
          rir: 0,
        })),
        status: "complete",
        revision: 2,
      },
    ]),
  );
  expect(screen.queryByRole("button", { name: "미완료 기록 확인" })).toBeNull();
  expect(
    screen.queryByRole("button", { name: "진행 중 기록 확인" }),
  ).toBeNull();
  expect(screen.getByText(/완료 본세트 2행 중 RIR 미입력 0행/)).toBeTruthy();
});
