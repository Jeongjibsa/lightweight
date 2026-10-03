import { useState } from "react";
import { MantineProvider } from "@mantine/core";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLiveQuery } from "dexie-react-hooks";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TrainingDatabase, TrainingStore } from "../../src/data/local/store";
import { TrainingContext } from "../../src/context/training";
import { WorkoutView } from "../../src/components/workout";
import { catalog } from "../../src/content/catalog";
import type { Session } from "../../src/domain/models";
import type { Run } from "../../src/components/shared";

const owner = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
let db: TrainingDatabase;
let store: TrainingStore;
let session: Session;
beforeEach(async () => {
  db = new TrainingDatabase(`ui-${crypto.randomUUID()}`);
  store = new TrainingStore(db);
  await store.ensureProfile(owner);
  const routine = await store.saveRoutine(owner, {
    name: "가짜 입력 검사",
    exercises: [{ exercise: catalog[8]!, sets: 1 }],
  });
  session = await store.startSession(owner, routine.id);
});
afterEach(async () => {
  vi.restoreAllMocks();
  await db.delete();
});
function Harness() {
  const current = useLiveQuery(() => db.sessions.get(session.id), []);
  const [error, setError] = useState("");
  const run: Run = async (action) => {
    try {
      await action();
      setError("");
      return true;
    } catch {
      setError("저장 오류: 다시 시도해주세요.");
      return false;
    }
  };
  return (
    <MantineProvider env="test">
      <TrainingContext.Provider value={{ db, store, accountId: null }}>
        {error && <p role="alert">{error}</p>}
        {current && (
          <WorkoutView session={current} run={run} onBack={() => {}} />
        )}
      </TrainingContext.Provider>
    </MantineProvider>
  );
}
const loadLabel = "바벨 스쿼트 1세트 중량";
const repsLabel = "바벨 스쿼트 1세트 횟수";
const complete = () =>
  screen.getByRole("button", { name: "바벨 스쿼트 1세트 완료", exact: true });

it("입력 직후 완료/blur가 겹쳐도 0kg·반복수와 단일 완료를 보존하고 재진입한다", async () => {
  const user = userEvent.setup();
  const view = render(<Harness />);
  await user.type(await screen.findByLabelText(loadLabel), "0");
  await user.type(screen.getByLabelText(repsLabel), "10");
  await user.click(complete());
  await waitFor(async () =>
    expect(
      (await db.sessions.get(session.id))!.sets[0]!.completedAt,
    ).not.toBeNull(),
  );
  const saved = (await db.sessions.get(session.id))!;
  expect(saved.sets).toHaveLength(1);
  expect(saved.sets[0]).toMatchObject({ load: 0, reps: 10 });
  view.unmount();
  render(<Harness />);
  expect(
    ((await screen.findByLabelText(loadLabel)) as HTMLInputElement).value,
  ).toBe("0");
  expect((screen.getByLabelText(repsLabel) as HTMLInputElement).value).toBe(
    "10",
  );
  expect(
    screen
      .getByRole("button", { name: "바벨 스쿼트 1세트 완료 취소" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
});

it("transaction 오류 때 완료 성공을 표시하지 않고 기존 payload/outbox를 보존한 뒤 재시도한다", async () => {
  await store.updateSet(owner, session.id, session.sets[0]!.id, {
    load: 20,
    reps: 8,
  });
  const before = await db.sessions.get(session.id);
  const outboxBefore = await db.outbox.toArray();
  render(<Harness />);
  await screen.findByLabelText(loadLabel);
  vi.spyOn(db.outbox, "add").mockRejectedValueOnce(
    new Error("synthetic storage failure"),
  );
  const user = userEvent.setup();
  await user.click(complete());
  await screen.findByRole("alert");
  expect(await db.sessions.get(session.id)).toEqual(before);
  expect(await db.outbox.toArray()).toEqual(outboxBefore);
  expect(complete().getAttribute("aria-pressed")).toBe("false");
  await user.click(complete());
  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  expect(
    (await db.sessions.get(session.id))!.sets[0]!.completedAt,
  ).not.toBeNull();
  expect(await db.outbox.count()).toBe(outboxBefore.length + 1);
});

it("중량 결측은 완료하지 않으며 오류를 0kg로 수정한 뒤 단일 세트를 완료한다", async () => {
  await store.updateSet(owner, session.id, session.sets[0]!.id, { reps: 10 });
  const before = await db.sessions.get(session.id);
  render(<Harness />);
  await screen.findByLabelText(loadLabel);
  const user = userEvent.setup();
  await user.click(complete());
  await screen.findByRole("alert");
  expect(await db.sessions.get(session.id)).toEqual(before);
  await user.type(screen.getByLabelText(loadLabel), "0");
  await user.click(complete());
  await waitFor(async () =>
    expect(
      (await db.sessions.get(session.id))!.sets[0]!.completedAt,
    ).not.toBeNull(),
  );
  expect((await db.sessions.get(session.id))!.sets).toHaveLength(1);
});
