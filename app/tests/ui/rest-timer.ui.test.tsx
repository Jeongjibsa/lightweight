import { MantineProvider } from "@mantine/core";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { RestTimer } from "../../src/components/rest-timer";
import { TrainingContext } from "../../src/context/training";
import { TrainingDatabase, TrainingStore } from "../../src/data/local/store";
import { owner, sessionFixture, setFixture } from "../fixtures/training";
import type { Session } from "../../src/domain/models";
let db: TrainingDatabase;
let store: TrainingStore;
beforeEach(async () => {
  db = new TrainingDatabase(`rest-ui-${crypto.randomUUID()}`);
  store = new TrainingStore(db);
  await store.ensureProfile(owner);
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-04T03:00:00Z"));
});
afterEach(async () => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  await db.delete();
});
function Harness({ session }: { session: Session }) {
  const run = async (action: () => Promise<unknown>) => {
    try {
      await action();
      return true;
    } catch {
      return false;
    }
  };
  return (
    <MantineProvider env="test">
      <TrainingContext.Provider value={{ db, store, accountId: null }}>
        <RestTimer session={session} run={run} />
      </TrainingContext.Provider>
    </MantineProvider>
  );
}
it("saved completion starts one minute; pause survives elapsed time and remount without changing a set", async () => {
  const set = setFixture({ completedAt: null });
  const session = sessionFixture({
    status: "active",
    endedAt: null,
    sets: [set],
  });
  const view = render(<Harness session={session} />);
  expect(screen.getByText("세트를 완료하면 시작")).toBeDefined();
  const completed = {
    ...session,
    sets: [{ ...set, completedAt: new Date().toISOString() }],
  };
  view.rerender(<Harness session={completed} />);
  expect(screen.getByLabelText("남은 휴식 시간").textContent).toBe("1:00");
  act(() => {
    vi.setSystemTime(new Date("2026-10-04T03:00:30Z"));
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(screen.getByLabelText("남은 휴식 시간").textContent).toBe("0:30");
  await userEvent
    .setup()
    .click(screen.getByRole("button", { name: "휴식 일시정지" }));
  act(() => {
    vi.setSystemTime(new Date("2026-10-04T03:10:00Z"));
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(screen.getByLabelText("남은 휴식 시간").textContent).toBe("0:30");
  view.unmount();
  render(<Harness session={completed} />);
  expect(screen.getByText("일시정지")).toBeDefined();
  expect(screen.getByLabelText("남은 휴식 시간").textContent).toBe("0:30");
  expect(completed.sets[0]).toEqual({
    ...set,
    completedAt: "2026-10-04T03:00:00.000Z",
  });
});
it("favorite editor rejects duplicates, keeps modal on transaction failure and retries with three favorites", async () => {
  render(
    <Harness
      session={sessionFixture({ status: "active", endedAt: null, sets: [] })}
    />,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "즐겨찾기 편집" }));
  const first = screen.getByRole("textbox", { name: "즐겨찾기 1 · 초" });
  await user.clear(first);
  await user.type(first, "90");
  await user.click(screen.getByRole("button", { name: "즐겨찾기 저장" }));
  await screen.findByRole("alert");
  expect((await db.profiles.get(owner))!.restTimer).toBeUndefined();
  await user.clear(first);
  await user.type(first, "45");
  await user.click(
    screen.getByRole("button", { name: "즐겨찾기 3개로 줄이기" }),
  );
  vi.spyOn(db.outbox, "add").mockRejectedValueOnce(
    new Error("synthetic timer preference failure"),
  );
  await user.click(screen.getByRole("button", { name: "즐겨찾기 저장" }));
  await waitFor(() =>
    expect(
      screen
        .getByRole("button", { name: "즐겨찾기 저장" })
        .hasAttribute("disabled"),
    ).toBe(false),
  );
  expect((await db.profiles.get(owner))!.restTimer).toBeUndefined();
  await user.click(screen.getByRole("button", { name: "즐겨찾기 저장" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect((await db.profiles.get(owner))!.restTimer).toEqual({
    seconds: 60,
    favorites: [45, 90, 120],
  });
});
