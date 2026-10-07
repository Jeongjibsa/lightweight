import { MantineProvider } from "@mantine/core";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { WeeklyRecordReport } from "../../src/components/weekly-report";
import {
  profileFixture,
  sessionFixture,
  setFixture,
  now,
} from "../fixtures/training";
it("현재 입력이 바뀌면 비교 수치가 갱신되고 계산 기준을 펼쳐 읽는다", async () => {
  const session = sessionFixture();
  const component = () => (
    <MantineProvider env="test">
      <WeeklyRecordReport
        profile={profileFixture()}
        sessions={[session]}
        now={now}
      />
    </MantineProvider>
  );
  const view = render(component());
  const row = () => screen.getByRole("row", { name: /볼륨 부분합/ });
  expect(within(row()).getByText("200 kg·회")).toBeTruthy();
  session.sets = [setFixture({ load: 30 })];
  session.revision++;
  view.rerender(component());
  expect(within(row()).getByText("300 kg·회")).toBeTruthy();
  await userEvent
    .setup()
    .click(
      screen.getByRole("button", { name: "이 리포트는 어떻게 계산하나요?" }),
    );
  expect(
    screen.getByText(/저장한 파일은 브라우저에서 읽을 수 있고/),
  ).toBeTruthy();
});
