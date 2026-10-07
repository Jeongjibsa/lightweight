import { MantineProvider } from "@mantine/core";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { UpdateNotice } from "../../src/components/update-notice";

const sw = vi.hoisted(() => ({ apply: vi.fn(), dismiss: vi.fn() }));
vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: () => ({
    needRefresh: [true, sw.dismiss],
    updateServiceWorker: sw.apply,
  }),
}));

it("진행 중 운동을 열고 종료 뒤 적용한다. 저장 중에는 적용하지 않는다", async () => {
  const resume = vi.fn();
  const component = (active: boolean, busy = false) => (
    <MantineProvider env="test">
      <UpdateNotice active={active} busy={busy} resume={resume} />
    </MantineProvider>
  );
  const view = render(component(true));
  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", { name: "운동 마치고 업데이트" }),
  );
  expect(resume).toHaveBeenCalledOnce();
  expect(sw.apply).not.toHaveBeenCalled();
  view.rerender(component(false, true));
  expect(
    screen
      .getByRole("button", { name: "업데이트", exact: true })
      .hasAttribute("disabled"),
  ).toBe(true);
  view.rerender(component(false));
  await user.click(
    screen.getByRole("button", { name: "업데이트", exact: true }),
  );
  expect(sw.apply).toHaveBeenCalledWith(true);
});

it("적용 실패를 알리고 재시도 버튼을 복구한다", async () => {
  sw.apply.mockRejectedValueOnce(new Error("synthetic worker failure"));
  render(
    <MantineProvider env="test">
      <UpdateNotice active={false} busy={false} resume={vi.fn()} />
    </MantineProvider>,
  );
  await userEvent
    .setup()
    .click(screen.getByRole("button", { name: "업데이트", exact: true }));
  await waitFor(() =>
    expect(screen.getByText(/업데이트를 적용하지 못했어요/)).toBeTruthy(),
  );
  expect(
    screen
      .getByRole("button", { name: "업데이트", exact: true })
      .hasAttribute("disabled"),
  ).toBe(false);
});
