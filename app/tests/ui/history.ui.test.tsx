import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { HistorySuggestion } from "../../src/components/history-suggestion";
import {
  now,
  profileFixture,
  routineFixture,
  sessionFixture,
  setFixture,
} from "../fixtures/training";

it("현재 계획/과거 일부 완료를 구별하고 명시적으로 선택할 때만 시작한다", async () => {
  const routine = routineFixture();
  const session = sessionFixture({
    routineSnapshot: routine,
    status: "partial",
    sets: [setFixture({ load: 0 }), setFixture({ completedAt: null })],
  });
  const start = vi.fn(async () => {});
  const user = userEvent.setup();
  const view = render(
    <MantineProvider env="test">
      <HistorySuggestion
        profile={profileFixture()}
        routines={[routine]}
        sessions={[session]}
        now={now}
        start={start}
      />
    </MantineProvider>,
  );
  expect(screen.getByText("3개")).toBeTruthy();
  expect(screen.getByText(/실제 본세트 · 일부 완료/)).toBeTruthy();
  expect(screen.getByText("0 kg·회")).toBeTruthy();
  expect(start).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "이 루틴 선택해 시작" }));
  expect(start).toHaveBeenCalledExactlyOnceWith(routine.id);
  view.rerender(
    <MantineProvider env="test">
      <HistorySuggestion
        profile={profileFixture()}
        routines={[routine]}
        sessions={[
          session,
          sessionFixture({ status: "active", endedAt: null }),
        ]}
        now={now}
        start={start}
      />
    </MantineProvider>,
  );
  expect(
    screen.queryByRole("button", { name: "이 루틴 선택해 시작" }),
  ).toBeNull();
  expect(screen.getByText(/진행 중인 운동이 있어/)).toBeTruthy();
});
