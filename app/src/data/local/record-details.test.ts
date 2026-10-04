import "fake-indexeddb/auto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TrainingDatabase, TrainingStore } from "./store";
import {
  owner,
  otherOwner,
  profileFixture,
  sessionFixture,
  setFixture,
} from "../../../tests/fixtures/training";
import type { Session } from "../../domain/models";
let db: TrainingDatabase;
let store: TrainingStore;
let source: Session;
beforeEach(async () => {
  db = new TrainingDatabase(`record-details-${crypto.randomUUID()}`);
  store = new TrainingStore(db);
  await db.profiles.add(profileFixture());
  source = sessionFixture({ sets: [setFixture(), setFixture({ order: 1 })] });
  await db.sessions.add(source);
});
afterEach(async () => {
  vi.restoreAllMocks();
  await db.delete();
});
const input = { equipmentLabel: "머신 A", rangeOfMotion: "전체" };
it("종료 note/조건·완료/시각/snapshot을 보존하고 backup/outbox로 왕복한다", async () => {
  let saved = await store.saveSessionNote(
    owner,
    source.id,
    source.revision,
    " 가짜 운동\n메모 ",
  );
  saved = await store.saveSetConditions(
    owner,
    source.id,
    saved.revision,
    [source.sets[1]!.id],
    input,
  );
  expect(saved.note).toBe("가짜 운동\n메모");
  expect(saved.sets[0]).toEqual(source.sets[0]);
  expect(saved.sets[1]).toEqual({ ...source.sets[1], comparison: input });
  expect(saved.endedAt).toBe(source.endedAt);
  expect(saved.routineSnapshot).toEqual(source.routineSnapshot);
  const queued = await db.outbox.toArray();
  expect(queued).toHaveLength(2);
  expect(
    queued.find((item) => item.revision === saved.revision)!.payload,
  ).toEqual(saved);
  const text = await store.backup(owner);
  const next = new TrainingDatabase(`restored-details-${crypto.randomUUID()}`);
  try {
    const target = new TrainingStore(next);
    await target.ensureProfile(owner);
    await target.restore(owner, text);
    expect(await next.sessions.get(source.id)).toEqual(saved);
  } finally {
    await next.delete();
  }
  saved = await store.saveSetConditions(
    owner,
    saved.id,
    saved.revision,
    saved.sets.map((s) => s.id),
    { equipmentLabel: "", rangeOfMotion: " " },
  );
  expect(saved.sets.every((s) => s.comparison === undefined)).toBe(true);
});
it("owner/CAS/삭제·취소/잘못된 대상/긴 입력을 거부하고 transaction 실패는 rollback한다", async () => {
  await expect(
    store.saveSessionNote(otherOwner, source.id, source.revision, "메모"),
  ).rejects.toThrow("프로필");
  await expect(
    store.saveSessionNote(owner, source.id, 99, "메모"),
  ).rejects.toThrow("바뀌었습니다");
  await expect(
    store.saveSessionNote(owner, source.id, source.revision, "x".repeat(1001)),
  ).rejects.toThrow();
  for (const ids of [
    [],
    [crypto.randomUUID()],
    [source.sets[0]!.id, source.sets[0]!.id],
  ])
    await expect(
      store.saveSetConditions(owner, source.id, source.revision, ids, input),
    ).rejects.toThrow("세트");
  expect(await db.sessions.get(source.id)).toEqual(source);
  expect(await db.outbox.count()).toBe(0);
  vi.spyOn(db.outbox, "add").mockRejectedValueOnce(
    new Error("synthetic quota"),
  );
  await expect(
    store.saveSetConditions(
      owner,
      source.id,
      source.revision,
      [source.sets[0]!.id],
      input,
    ),
  ).rejects.toThrow("synthetic quota");
  expect(await db.sessions.get(source.id)).toEqual(source);
  expect(await db.outbox.count()).toBe(0);
  const saved = await store.saveSetConditions(
    owner,
    source.id,
    source.revision,
    [source.sets[0]!.id],
    input,
  );
  expect(saved.revision).toBe(source.revision + 1);
  expect(await db.outbox.count()).toBe(1);
  await expect(
    store.saveSetConditions(
      owner,
      source.id,
      source.revision,
      [source.sets[0]!.id],
      input,
    ),
  ).rejects.toThrow("바뀌었습니다");
  await db.sessions.put({ ...saved, status: "cancelled" });
  await expect(
    store.saveSessionNote(owner, source.id, saved.revision, "메모"),
  ).rejects.toThrow("취소");
  await db.sessions.put({ ...saved, deletedAt: saved.updatedAt });
  await expect(
    store.saveSessionNote(owner, source.id, saved.revision, "메모"),
  ).rejects.toThrow("삭제");
});
it("재시작은 메모를 비우고 조건 계획 보존·추가 복사·교체 초기화·다른 조건 이전값 차단한다", async () => {
  let saved = await store.saveSessionNote(
    owner,
    source.id,
    source.revision,
    "과거의 컨디션",
  );
  saved = await store.saveSetConditions(
    owner,
    source.id,
    saved.revision,
    saved.sets.map((s) => s.id),
    input,
  );
  let active = await store.repeatSession(owner, saved.id);
  expect(active.note).toBeUndefined();
  expect(active.sets[0]!.comparison).toEqual(input);
  expect(active.sets.every((s) => !s.completedAt)).toBe(true);
  active = await store.addSet(owner, active.id, active.sets[0]!.exercise);
  expect(active.sets.at(-1)!.comparison).toEqual(input);
  for (const set of active.sets)
    await store.updateSet(owner, active.id, set.id, { load: null, reps: null });
  active = await store.reusePreviousValues(
    owner,
    active.id,
    active.sets[0]!.exercise.id,
  );
  expect(active.sets[0]!.load).toBe(20);
  active = await store.saveSetConditions(
    owner,
    active.id,
    active.revision,
    active.sets.map((s) => s.id),
    { ...input, equipmentLabel: "머신 B" },
  );
  await expect(
    store.reusePreviousValues(owner, active.id, active.sets[0]!.exercise.id),
  ).rejects.toThrow("이전 수행");
  const replacement = {
    ...active.sets[0]!.exercise,
    id: "other",
    name: "가짜 대체 운동",
  };
  active = await store.replaceExercise(
    owner,
    active.id,
    active.sets[0]!.exercise.id,
    replacement,
  );
  expect(
    active.sets.every((s) => s.comparison === undefined && s.load === null),
  ).toBe(true);
  expect(await db.sessions.get(source.id)).toEqual(saved);
});
