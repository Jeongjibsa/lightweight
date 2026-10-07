import { useState } from "react";
import { MantineProvider } from "@mantine/core";
import { render, screen, waitFor, within } from "@testing-library/react";
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

it("종료 기록의 명시 수정은 완료/시각을 유지하며 실제 입력과 DB를 갱신한다", async () => {
  await store.updateSet(
    owner,
    session.id,
    session.sets[0]!.id,
    { load: 20, reps: 10 },
    true,
  );
  const ended = await store.endSession(owner, session.id);
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(
    await screen.findByRole("button", {
      name: "바벨 스쿼트 1세트 기록 수정",
      exact: true,
    }),
  );
  const load = screen.getByLabelText("수정할 중량 · kg");
  await user.clear(load);
  await user.type(load, "40");
  const reps = screen.getByLabelText("수정할 횟수");
  await user.clear(reps);
  await user.type(reps, "6");
  await user.click(screen.getByRole("combobox", { name: "수정할 세트 종류" }));
  await user.click(screen.getByRole("option", { name: "준비 세트" }));
  await user.type(screen.getByLabelText("수정할 RIR · 선택"), "2");
  await user.click(
    screen.getByRole("button", { name: "수정 기록 저장", exact: true }),
  );
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect((await db.sessions.get(session.id))!.sets[0]).toMatchObject({
    load: 40,
    reps: 6,
    kind: "warmup",
    rir: 2,
    completedAt: ended.sets[0]!.completedAt,
  });
  expect((await db.sessions.get(session.id))!.endedAt).toBe(ended.endedAt);
  expect((screen.getByLabelText(loadLabel) as HTMLInputElement).value).toBe(
    "40",
  );
  expect((screen.getByLabelText(repsLabel) as HTMLInputElement).value).toBe(
    "6",
  );
  await user.click(screen.getByRole("button", { name: "준비 세트 · 상세" }));
  expect(
    (screen.getByLabelText("바벨 스쿼트 1세트 RIR") as HTMLInputElement).value,
  ).toBe("2");
});
it("이전 값 불러오기는 화면과 기기 입력을 채우고 오늘 완료로 집계하지 않는다", async () => {
  await store.updateSet(
    owner,
    session.id,
    session.sets[0]!.id,
    { load: 25, reps: 8 },
    true,
  );
  const source = await store.endSession(owner, session.id);
  session = await store.startSession(owner, source.routineSnapshot!.id);
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(
    await screen.findByRole("button", {
      name: "이전 값 불러오기",
      exact: true,
    }),
  );
  await waitFor(() =>
    expect((screen.getByLabelText(loadLabel) as HTMLInputElement).value).toBe(
      "25",
    ),
  );
  expect((screen.getByLabelText(repsLabel) as HTMLInputElement).value).toBe(
    "8",
  );
  expect((await db.sessions.get(session.id))!.sets[0]!.completedAt).toBeNull();
  expect(await db.sessions.get(source.id)).toEqual(source);
});

it("운동 순서의 취소/저장/재진입은 완료 세트와 입력값을 보존한다", async () => {
  session = await store.addExercise(owner, session.id, catalog[5]!);
  session = await store.updateSet(
    owner,
    session.id,
    session.sets[0]!.id,
    { load: 40, reps: 6 },
    true,
  );
  const user = userEvent.setup();
  const view = render(<Harness />);
  await user.click(
    await screen.findByRole("button", { name: "운동 순서 변경", exact: true }),
  );
  let dialog = screen.getByRole("dialog", {
    name: "운동 순서 변경",
    exact: true,
  });
  await user.click(
    within(dialog).getByRole("button", {
      name: `${catalog[5]!.name} 위로`,
      exact: true,
    }),
  );
  await user.click(
    within(dialog).getByRole("button", { name: "취소", exact: true }),
  );
  expect(await db.sessions.get(session.id)).toEqual(session);
  await user.click(
    screen.getByRole("button", { name: "운동 순서 변경", exact: true }),
  );
  dialog = screen.getByRole("dialog", { name: "운동 순서 변경", exact: true });
  await user.click(
    within(dialog).getByRole("button", {
      name: `${catalog[5]!.name} 위로`,
      exact: true,
    }),
  );
  await user.click(
    within(dialog).getByRole("button", { name: "순서 저장", exact: true }),
  );
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  const saved = (await db.sessions.get(session.id))!;
  expect(saved.sets.at(-1)).toEqual(session.sets[0]);
  expect(
    screen.getAllByRole("heading", { level: 3 }).map((el) => el.textContent),
  ).toEqual([catalog[5]!.name, "바벨 스쿼트"]);
  view.unmount();
  render(<Harness />);
  expect(
    ((await screen.findByLabelText(loadLabel)) as HTMLInputElement).value,
  ).toBe("40");
  expect(
    screen
      .getByRole("button", { name: "바벨 스쿼트 1세트 완료 취소" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
});

it("순서 변경 중 다른 입력이 저장되면 초안을 덮어쓰지 않고 새 입력/순서를 보존한다", async () => {
  session = await store.addExercise(owner, session.id, catalog[5]!);
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(
    await screen.findByRole("button", { name: "운동 순서 변경", exact: true }),
  );
  const dialog = screen.getByRole("dialog", {
    name: "운동 순서 변경",
    exact: true,
  });
  await user.click(
    within(dialog).getByRole("button", {
      name: `${catalog[5]!.name} 위로`,
      exact: true,
    }),
  );
  const changed = await store.updateSet(
    owner,
    session.id,
    session.sets[0]!.id,
    { load: 30, reps: 8 },
  );
  const before = await db.outbox.toArray();
  await user.click(
    within(dialog).getByRole("button", { name: "순서 저장", exact: true }),
  );
  await screen.findByRole("alert");
  expect(screen.queryByRole("dialog")).not.toBeNull();
  expect(await db.sessions.get(session.id)).toEqual(changed);
  expect(await db.outbox.toArray()).toEqual(before);
});

it("메모 편집의 취소/오류/재시도는 초안을 유지하고 완료 시각을 보존한다", async () => {
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(
    await screen.findByRole("button", { name: "운동 메모 추가", exact: true }),
  );
  await user.type(screen.getByLabelText("오늘 운동 메모"), "가짜 컨디션 메모");
  const before = await db.sessions.get(session.id);
  vi.spyOn(db.outbox, "add").mockRejectedValueOnce(
    new Error("synthetic storage failure"),
  );
  await user.click(
    screen.getByRole("button", { name: "메모 저장", exact: true }),
  );
  await screen.findByRole("alert");
  expect(await db.sessions.get(session.id)).toEqual(before);
  expect(
    (screen.getByLabelText("오늘 운동 메모") as HTMLTextAreaElement).value,
  ).toBe("가짜 컨디션 메모");
  await user.click(
    screen.getByRole("button", { name: "메모 저장", exact: true }),
  );
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect((await db.sessions.get(session.id))!.note).toBe("가짜 컨디션 메모");
  await user.click(
    screen.getByRole("button", { name: "운동 메모 수정", exact: true }),
  );
  await user.clear(screen.getByLabelText("오늘 운동 메모"));
  await user.click(
    within(screen.getByRole("dialog")).getByRole("button", {
      name: "취소",
      exact: true,
    }),
  );
  expect((await db.sessions.get(session.id))!.note).toBe("가짜 컨디션 메모");
});
it("비교 조건 전체/개별 적용·CAS 충돌에서 완료/입력 보존과 대상 선택을 검증한다", async () => {
  session = await store.addSet(owner, session.id, session.sets[0]!.exercise);
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(
    await screen.findByRole("button", {
      name: "바벨 스쿼트 비교 조건",
      exact: true,
    }),
  );
  await user.type(screen.getByLabelText("장비 이름 · 선택"), "머신 A");
  await user.type(screen.getByLabelText("가동범위 · 선택"), "전체");
  await user.click(
    screen.getByRole("button", { name: "조건 저장", exact: true }),
  );
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(
    (await db.sessions.get(session.id))!.sets.every(
      (s) => s.comparison?.equipmentLabel === "머신 A",
    ),
  ).toBe(true);
  await user.click(
    screen.getByRole("button", { name: "바벨 스쿼트 비교 조건", exact: true }),
  );
  await user.click(
    screen.getByRole("combobox", { name: "적용할 세트", exact: true }),
  );
  await user.click(screen.getByRole("option", { name: "2세트", exact: true }));
  await user.clear(screen.getByLabelText("장비 이름 · 선택"));
  await user.type(screen.getByLabelText("장비 이름 · 선택"), "머신 B");
  const current = (await db.sessions.get(session.id))!;
  await store.saveSessionNote(owner, current.id, current.revision, "다른 편집");
  await user.click(
    screen.getByRole("button", { name: "조건 저장", exact: true }),
  );
  await screen.findByRole("alert");
  expect(
    (await db.sessions.get(session.id))!.sets.every(
      (s) => s.comparison?.equipmentLabel === "머신 A",
    ),
  ).toBe(true);
  expect(
    (screen.getByLabelText("장비 이름 · 선택") as HTMLInputElement).value,
  ).toBe("머신 B");
});

it("운동을 접어도 저장 실패한 입력 초안을 보존하며 접기 자체는 기록/outbox를 바꾸지 않는다", async () => {
  await store.updateSet(owner, session.id, session.sets[0]!.id, {
    load: 20,
    reps: 8,
  });
  const before = await db.sessions.get(session.id);
  const outbox = await db.outbox.toArray();
  render(<Harness />);
  const user = userEvent.setup();
  const input = await screen.findByLabelText(loadLabel);
  await user.clear(input);
  await user.type(input, "42");
  const failure = vi
    .spyOn(db.outbox, "add")
    .mockRejectedValue(new Error("synthetic collapse save failure"));
  const control = screen.getByRole("button", {
    name: "바벨 스쿼트 세트 접기/펼치기",
    exact: true,
  });
  await user.click(control);
  await screen.findByRole("alert");
  await waitFor(() =>
    expect(
      screen.queryByRole("button", {
        name: "바벨 스쿼트 1세트 완료",
        exact: true,
      }),
    ).toBeNull(),
  );
  expect(control.getAttribute("aria-expanded")).toBe("false");
  expect(await db.sessions.get(session.id)).toEqual(before);
  expect(await db.outbox.toArray()).toEqual(outbox);
  await user.click(control);
  expect(screen.getByLabelText(loadLabel)).toBe(input);
  expect((input as HTMLInputElement).value).toBe("42");
  failure.mockRestore();
  await user.click(input);
  await user.click(
    screen.getByRole("button", { name: "모두 접기", exact: true }),
  );
  await waitFor(async () =>
    expect((await db.sessions.get(session.id))!.sets[0]!.load).toBe(42),
  );
  const saved = await db.sessions.get(session.id);
  const savedOutbox = await db.outbox.toArray();
  await user.click(
    screen.getByRole("button", { name: "모두 펼치기", exact: true }),
  );
  expect(await db.sessions.get(session.id)).toEqual(saved);
  expect(await db.outbox.toArray()).toEqual(savedOutbox);
});
