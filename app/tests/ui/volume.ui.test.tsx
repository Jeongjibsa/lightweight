import { MantineProvider } from "@mantine/core";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { VolumeReport } from "../../src/components/volume-report";
import { conditionLabel } from "../../src/components/volume-format";
import {
  now,
  otherOwner,
  profileFixture,
  sessionFixture,
  setFixture,
} from "../fixtures/training";

it("기간·조건·지표를 조작해 수치 표와 그래프의 N/A·0을 확인한다", async () => {
  const user = userEvent.setup();
  const total = setFixture({ load: 0 });
  const timed = setFixture({
    exercise: { ...total.exercise, name: "가짜 플랭크", loadMode: "timed" },
    reps: null,
    seconds: 60,
  });
  const sessions = [
    sessionFixture({
      localDate: "2026-08-01",
      sets: [setFixture({ load: 100 })],
    }),
    sessionFixture({ sets: [total, timed] }),
  ];
  render(
    <MantineProvider env="test">
      <VolumeReport profile={profileFixture()} sessions={sessions} now={now} />
    </MantineProvider>,
  );
  const table = () => screen.getByRole("table");
  expect(within(table()).getByText("0 kg·회")).toBeTruthy();
  expect(within(table()).queryByText("2026-08-01")).toBeNull();
  expect(screen.getByRole("img").querySelectorAll("circle")).toHaveLength(1);
  expect(screen.getByRole("img").querySelector("polyline")).toBeNull();
  await user.click(screen.getByRole("radio", { name: "84일", exact: true }));
  expect(within(table()).getByText("2026-08-01")).toBeTruthy();
  await user.click(screen.getByRole("combobox", { name: "비교할 기록" }));
  await user.click(screen.getByRole("option", { name: /가짜 플랭크/ }));
  expect(within(table()).getAllByText("N/A")).toHaveLength(2);
  expect(screen.queryByRole("img")).toBeNull();
  await user.click(screen.getByRole("radio", { name: "시간", exact: true }));
  expect(screen.getByRole("img").getAttribute("aria-label")).toContain(
    "시간 추이",
  );
  expect(within(table()).getByText("60 초")).toBeTruthy();
});
it("기록 변경/삭제 props를 반영하고 이전 필터가 없어져도 타인 기록을 표시하지 않는다", async () => {
  const p = profileFixture();
  const session = sessionFixture();
  const view = render(
    <MantineProvider env="test">
      <VolumeReport profile={p} sessions={[session]} now={now} />
    </MantineProvider>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("combobox", { name: "비교할 기록" }));
  await user.click(
    screen.getByRole("option", { name: conditionLabel(session.sets[0]!) }),
  );
  view.rerender(
    <MantineProvider env="test">
      <VolumeReport
        profile={p}
        sessions={[{ ...session, sets: [setFixture({ load: 30 })] }]}
        now={now}
      />
    </MantineProvider>,
  );
  expect(within(screen.getByRole("table")).getByText("300 kg·회")).toBeTruthy();
  view.rerender(
    <MantineProvider env="test">
      <VolumeReport
        profile={p}
        sessions={[{ ...session, deletedAt: "2026-10-02T04:00:00Z" }]}
        now={now}
      />
    </MantineProvider>,
  );
  expect(screen.queryByRole("table")).toBeNull();
  expect(screen.getByText("선택한 기간에 완료한 본세트가 없어요")).toBeTruthy();
  view.rerender(
    <MantineProvider env="test">
      <VolumeReport
        profile={{ ...p, ownerId: otherOwner }}
        sessions={[session]}
        now={now}
      />
    </MantineProvider>,
  );
  expect(screen.queryByRole("table")).toBeNull();
});
