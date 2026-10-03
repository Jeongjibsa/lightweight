import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TrainingDatabase, TrainingStore } from "./store";
import { catalog } from "../../content/catalog";
import { backupSchema, summarize, type Preferences } from "../../domain/models";

const owner = "00000000-0000-4000-8000-000000000001";
const other = "00000000-0000-4000-8000-000000000002";
const preferences: Preferences = {
  goal: "hypertrophy",
  customGoal: "",
  weeklyMin: 3,
  weeklyMax: 4,
  split: "full_body",
  customSplit: "",
  minutes: null,
  equipment: ["덤벨"],
};
let database: TrainingDatabase;
let store: TrainingStore;
beforeEach(async () => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-03T16:00:00Z"));
  database = new TrainingDatabase(`test-${crypto.randomUUID()}`);
  store = new TrainingStore(database);
  await store.ensureProfile(owner);
  await store.ensureProfile(other);
});
afterEach(async () => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  await database.delete();
});
async function plannedSession() {
  const routine = await store.saveRoutine(owner, {
    name: "가짜 전신 A",
    exercises: [{ exercise: catalog[0]!, sets: 3 }],
  });
  return store.startSession(owner, routine.id);
}

describe("사용자 설정과 소유 경계", () => {
  it("새 사용자에게 개인 목표를 강제하지 않고 프로필을 중복 생성하지 않는다", async () => {
    expect((await store.ensureProfile(owner)).preferences).toBeNull();
    await Promise.all([store.ensureProfile(owner), store.ensureProfile(owner)]);
    expect(await database.profiles.count()).toBe(2);
  });
  it("설정을 사용자별로 저장하고 분할과 운동 횟수는 독립적으로 허용한다", async () => {
    const profile = (await store.workspace(owner)).profile!;
    await store.saveProfile(owner, {
      ...profile,
      preferences: {
        ...preferences,
        split: "five_way",
        weeklyMin: 2,
        weeklyMax: 2,
      },
    });
    expect((await store.workspace(owner)).profile?.preferences?.split).toBe(
      "five_way",
    );
    expect((await store.workspace(other)).profile?.preferences).toBeNull();
  });
  it("다른 소유자의 기록 조회와 수정 경계를 지킨다", async () => {
    const session = await plannedSession();
    expect((await store.workspace(other)).sessions).toHaveLength(0);
    await expect(
      store.updateSet(other, session.id, session.sets[0]!.id, { load: 10 }),
    ).rejects.toThrow("현재 프로필");
    await expect(
      store.tombstone(other, "session", session.id),
    ).rejects.toThrow();
    await expect(
      store.startSession(other, session.routineSnapshot!.id),
    ).rejects.toThrow();
    expect((await database.sessions.get(session.id))?.revision).toBe(1);
  });
});
describe("기록 보존과 트랜잭션", () => {
  it("중복 시작과 완료 탭은 기록과 세트를 복제하지 않는다", async () => {
    const [a, b] = await Promise.all([
      store.startSession(owner),
      store.startSession(owner),
    ]);
    expect(a.id).toBe(b.id);
    const session = await store.addExercise(owner, a.id, catalog[0]!);
    await store.updateSet(
      owner,
      session.id,
      session.sets[0]!.id,
      { load: 0, reps: 10 },
      true,
    );
    await store.updateSet(
      owner,
      session.id,
      session.sets[0]!.id,
      { load: 0, reps: 10 },
      true,
    );
    const stored = (await database.sessions.get(session.id))!;
    expect(stored.sets).toHaveLength(3);
    expect(stored.sets.filter((set) => set.completedAt)).toHaveLength(1);
    expect(stored.sets[0]!.rir).toBeNull();
  });
  it("빈 중량과 0을 구분하고 잘못된 완료는 기록/outbox 모두 보존한다", async () => {
    const session = await plannedSession();
    const count = await database.outbox.count();
    await expect(
      store.updateSet(
        owner,
        session.id,
        session.sets[0]!.id,
        { reps: 10 },
        true,
      ),
    ).rejects.toThrow();
    expect(await database.outbox.count()).toBe(count);
    expect((await database.sessions.get(session.id))?.revision).toBe(1);
    const changed = await store.updateSet(
      owner,
      session.id,
      session.sets[0]!.id,
      { load: 0, reps: 10 },
      true,
    );
    expect(changed.sets[0]!.completedAt).not.toBeNull();
  });
  it("outbox 저장 실패 시 세트 변경도 롤백한다", async () => {
    const session = await plannedSession();
    vi.spyOn(database.outbox, "add").mockRejectedValueOnce(
      new Error("가짜 저장 실패"),
    );
    await expect(
      store.updateSet(
        owner,
        session.id,
        session.sets[0]!.id,
        { load: 20, reps: 8 },
        true,
      ),
    ).rejects.toThrow("가짜");
    expect((await database.sessions.get(session.id))?.sets[0]?.load).toBeNull();
  });
  it("루틴과 프로필 변경이 과거 세션 스냅샷을 바꾸지 않는다", async () => {
    const profile = (await store.workspace(owner)).profile!;
    await store.saveProfile(owner, { ...profile, preferences });
    const session = await plannedSession();
    const routine = session.routineSnapshot!;
    await store.saveRoutine(owner, {
      id: routine.id,
      name: "변경 B",
      exercises: [{ exercise: catalog[1]!, sets: 2 }],
    });
    await store.saveProfile(owner, {
      ...profile,
      preferences: { ...preferences, goal: "strength" },
    });
    const stored = (await database.sessions.get(session.id))!;
    expect(stored.routineSnapshot?.name).toBe("가짜 전신 A");
    expect(stored.routineSnapshot?.revision).toBe(1);
    expect(stored.preferencesSnapshot?.goal).toBe("hypertrophy");
  });
  it("저장소 재연결 후 미완료/완료와 시간 단위 기록을 복구한다", async () => {
    const session = await store.startSession(owner);
    const changed = await store.addExercise(
      owner,
      session.id,
      catalog.find((exercise) => exercise.loadMode === "timed")!,
    );
    await expect(
      store.updateSet(owner, session.id, changed.sets[0]!.id, {}, true),
    ).rejects.toThrow();
    await store.updateSet(
      owner,
      session.id,
      changed.sets[0]!.id,
      { seconds: 30 },
      true,
    );
    database.close();
    await database.open();
    const restored = (await store.workspace(owner)).sessions[0]!;
    expect(restored.sets[0]!.seconds).toBe(30);
    expect(restored.sets[1]!.completedAt).toBeNull();
    expect((await store.endSession(owner, session.id)).status).toBe("partial");
  });
});
describe("백업과 집계", () => {
  it("계획 본세트8/완료6/준비2 표본의 집계를 구분한다", async () => {
    const routine = await store.saveRoutine(owner, {
      name: "집계 표본",
      exercises: [{ exercise: catalog[0]!, sets: 10 }],
    });
    const session = await store.startSession(owner, routine.id);
    for (let i = 0; i < 8; i++)
      await store.updateSet(
        owner,
        session.id,
        session.sets[i]!.id,
        {
          load: 10,
          reps: 8,
          kind: i < 2 ? "warmup" : "working",
          side: i === 2 ? "left" : i === 3 ? "right" : "both",
        },
        true,
      );
    const stats = summarize([await store.endSession(owner, session.id)]);
    expect(stats).toMatchObject({
      plannedRows: 8,
      workingRows: 6,
      sessionCount: 1,
      days: 1,
    });
    expect(stats.byGroup["가슴"]).toBe(6);
  });
  it("복원의 진행 중 운동 중복과 종료 시각 결측을 거부한다", async () => {
    const session = await plannedSession();
    const backup = await store.backup(owner);
    expect(
      backupSchema.safeParse({
        ...backup,
        sessions: [session, { ...session, id: crypto.randomUUID() }],
      }).success,
    ).toBe(false);
    expect(
      backupSchema.safeParse({
        ...backup,
        sessions: [{ ...session, status: "partial" }],
      }).success,
    ).toBe(false);
  });
  it("새 저장소에 전체 프로필/루틴/기록을 복원하고 과거 ID를 유지한다", async () => {
    const session = await plannedSession();
    await store.updateSet(
      owner,
      session.id,
      session.sets[0]!.id,
      { load: 15, reps: 8 },
      true,
    );
    const backup = store.parseBackup(JSON.stringify(await store.backup(owner)));
    const target = new TrainingDatabase(`restore-${crypto.randomUUID()}`);
    const targetStore = new TrainingStore(target);
    try {
      await targetStore.ensureProfile(other);
      await targetStore.restore(other, backup);
      const restored = await targetStore.backup(other);
      expect(restored.sessions[0]!.id).toBe(session.id);
      expect(restored.sessions[0]!.ownerId).toBe(other);
      expect(restored.sessions[0]!.routineSnapshot?.ownerId).toBe(other);
      expect(restored.sessions[0]!.sets).toEqual(backup.sessions[0]!.sets);
      expect(restored.routines[0]!.id).toBe(backup.routines[0]!.id);
      expect(await target.outbox.count()).toBe(3);
    } finally {
      await target.delete();
    }
  });
  it("잘못된 형식, 혼합 소유자, 중복 ID 백업은 거부하고 기록을 바꾸지 않는다", async () => {
    await plannedSession();
    const backup = await store.backup(owner);
    expect(() => store.parseBackup("{")).toThrow();
    expect(backupSchema.safeParse({ ...backup, version: 2 }).success).toBe(
      false,
    );
    expect(
      backupSchema.safeParse({
        ...backup,
        sessions: [...backup.sessions, ...backup.sessions],
      }).success,
    ).toBe(false);
    await expect(
      store.restore(owner, {
        ...backup,
        sessions: [{ ...backup.sessions[0]!, ownerId: other }],
      }),
    ).rejects.toThrow();
    expect((await store.backup(owner)).sessions).toEqual(backup.sessions);
  });
  it("다른 프로필과 ID가 충돌하면 전체 복원을 롤백한다", async () => {
    const session = await plannedSession();
    const backup = await store.backup(owner);
    await store.saveRoutine(other, {
      name: "다른 사용자 루틴",
      exercises: [{ exercise: catalog[0]!, sets: 1 }],
    });
    await expect(store.restore(other, backup)).rejects.toThrow("충돌");
    expect((await store.workspace(other)).routines[0]?.name).toBe(
      "다른 사용자 루틴",
    );
    expect((await database.sessions.get(session.id))?.ownerId).toBe(owner);
  });
  it("완료 본세트만 집계하고 준비/취소/삭제/미완료를 제외한다", async () => {
    const session = await plannedSession();
    await store.updateSet(
      owner,
      session.id,
      session.sets[0]!.id,
      { load: 10, reps: 8 },
      true,
    );
    await store.updateSet(
      owner,
      session.id,
      session.sets[1]!.id,
      { load: 5, reps: 12, kind: "warmup" },
      true,
    );
    const ended = await store.endSession(owner, session.id);
    const stats = summarize([ended]);
    expect(stats).toMatchObject({
      sessionCount: 1,
      days: 1,
      workingRows: 1,
      plannedRows: 2,
      byGroup: { 가슴: 1 },
    });
    expect(summarize([{ ...ended, status: "cancelled" }]).workingRows).toBe(0);
    await store.tombstone(owner, "session", session.id);
    expect(
      summarize([(await database.sessions.get(session.id))!]).workingRows,
    ).toBe(0);
    expect((await store.backup(owner)).sessions[0]?.deletedAt).not.toBeNull();
  });
});
