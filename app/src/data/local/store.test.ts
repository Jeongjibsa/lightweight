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

describe("운동 중 종목 순서와 보존", () => {
  async function orderedSession() {
    const routine = await store.saveRoutine(owner, {
      name: "가짜 순서 검사",
      exercises: [
        { exercise: catalog[0]!, sets: 2 },
        { exercise: catalog[8]!, sets: 1 },
        { exercise: catalog[5]!, sets: 1 },
      ],
    });
    let session = await store.startSession(owner, routine.id);
    session = await store.updateSet(
      owner,
      session.id,
      session.sets[0]!.id,
      { load: 0, reps: 10, rir: 0 },
      true,
    );
    session = await store.updateSet(owner, session.id, session.sets[1]!.id, {
      load: 20,
      reps: 8,
      kind: "warmup",
    });
    return { routine, session };
  }
  it("종목 전체 순서를 저장해도 세트/완료/루틴·시각을 보존하고 백업에서 복원한다", async () => {
    const { routine, session } = await orderedSession();
    const ids = [catalog[8]!.id, catalog[5]!.id, catalog[0]!.id];
    const beforeCount = await database.outbox.count();
    const next = await store.reorderExercises(
      owner,
      session.id,
      ids,
      session.revision,
    );
    expect([...new Set(next.sets.map((s) => s.exercise.id))]).toEqual(ids);
    expect(next.sets).toEqual(
      ids.flatMap((id) => session.sets.filter((s) => s.exercise.id === id)),
    );
    expect({
      ...next,
      sets: session.sets,
      revision: session.revision,
      updatedAt: session.updatedAt,
    }).toEqual(session);
    expect(summarize([next])).toEqual(summarize([session]));
    expect(await database.routines.get(routine.id)).toEqual(routine);
    expect(await database.outbox.count()).toBe(beforeCount + 1);
    expect(
      (
        await database.outbox.where("entityId").equals(session.id).toArray()
      ).find((item) => item.revision === next.revision)?.payload,
    ).toEqual(next);
    const backup = await store.backup(owner);
    const fresh = new TrainingDatabase(`order-restore-${crypto.randomUUID()}`);
    try {
      const restored = new TrainingStore(fresh);
      await restored.ensureProfile(other);
      await restored.restore(other, backup);
      expect((await restored.workspace(other)).sessions[0]!.sets).toEqual(
        next.sets,
      );
    } finally {
      await fresh.delete();
    }
  });
  it("누락/중복/추가 ID·다른 소유자·변경된 revision·종료/삭제 기록을 거부한다", async () => {
    const { session } = await orderedSession();
    const ids = [...new Set(session.sets.map((s) => s.exercise.id))];
    const outbox = await database.outbox.toArray();
    for (const invalid of [
      ids.slice(1),
      [ids[0]!, ids[0]!, ids[2]!],
      [...ids, "unknown"],
      ["unknown", ...ids.slice(1)],
    ]) {
      await expect(
        store.reorderExercises(owner, session.id, invalid, session.revision),
      ).rejects.toThrow("운동 목록");
    }
    await expect(
      store.reorderExercises(other, session.id, ids, session.revision),
    ).rejects.toThrow("현재 프로필");
    await expect(
      store.reorderExercises(owner, session.id, ids, session.revision - 1),
    ).rejects.toThrow("기록이 바뀌었습니다");
    expect(await database.sessions.get(session.id)).toEqual(session);
    expect(await database.outbox.toArray()).toEqual(outbox);
    const ended = await store.endSession(owner, session.id);
    await expect(
      store.reorderExercises(owner, ended.id, ids, ended.revision),
    ).rejects.toThrow("진행 중");
    await store.tombstone(owner, "session", ended.id);
    const deleted = (await database.sessions.get(ended.id))!;
    await expect(
      store.reorderExercises(owner, deleted.id, ids, deleted.revision),
    ).rejects.toThrow("삭제한");
  });
  it("outbox 실패 시 순서도 rollback하고 같은 revision의 동시 변경 중 하나만 저장한다", async () => {
    const { session } = await orderedSession();
    const ids = [...new Set(session.sets.map((s) => s.exercise.id))].reverse();
    const before = await database.outbox.toArray();
    vi.spyOn(database.outbox, "add").mockRejectedValueOnce(
      new Error("synthetic ordering failure"),
    );
    await expect(
      store.reorderExercises(owner, session.id, ids, session.revision),
    ).rejects.toThrow("synthetic ordering failure");
    expect(await database.sessions.get(session.id)).toEqual(session);
    expect(await database.outbox.toArray()).toEqual(before);
    const changes = await Promise.allSettled([
      store.reorderExercises(owner, session.id, ids, session.revision),
      store.reorderExercises(
        owner,
        session.id,
        ids.slice().reverse(),
        session.revision,
      ),
    ]);
    expect(changes.filter((c) => c.status === "fulfilled")).toHaveLength(1);
    expect(changes.filter((c) => c.status === "rejected")).toHaveLength(1);
    expect((await database.sessions.get(session.id))!.revision).toBe(
      session.revision + 1,
    );
    expect(await database.outbox.count()).toBe(before.length + 1);
  });
});
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

it("백업 입력의 정확한 10MiB UTF-8 경계를 지키며 거부해도 원본 DB는 유지된다", async () => {
  const before = await store.backup(owner);
  const text = JSON.stringify(before);
  const bytes = new TextEncoder().encode(text).byteLength;
  expect(store.parseBackup(text + " ".repeat(10485760 - bytes))).toEqual(
    before,
  );
  expect(() => store.parseBackup(text + " ".repeat(10485761 - bytes))).toThrow(
    "10MiB",
  );
  const multibyte = text + "\u3000".repeat(Math.ceil((10485761 - bytes) / 3));
  expect(multibyte.length).toBeLessThan(10485760);
  expect(() => store.parseBackup(multibyte)).toThrow("10MiB");
  expect(await store.backup(owner)).toEqual(before);
});

describe("이전 기록 재사용·대체·종료 수정", () => {
  async function history() {
    const s = await plannedSession();
    for (const [index, set] of s.sets.entries())
      await store.updateSet(
        owner,
        s.id,
        set.id,
        { load: 20 + index * 5, reps: 10 - index, rir: 2 },
        true,
      );
    return store.endSession(owner, s.id);
  }
  it("완료된 과거를 새 ID/현재 설정의 계획으로 복사하고 동시 재시작은 하나만 만든다", async () => {
    const prior = await history();
    const before = await database.sessions.get(prior.id);
    const profile = (await database.profiles.get(owner))!;
    await store.saveProfile(owner, {
      ...profile,
      unit: "lb",
      timeZone: "America/Los_Angeles",
    });
    const count = await database.outbox.count();
    const [a, b] = await Promise.all([
      store.repeatSession(owner, prior.id),
      store.repeatSession(owner, prior.id),
    ]);
    expect(a.id).toBe(b.id);
    expect(a.id).not.toBe(prior.id);
    expect(a).toMatchObject({
      status: "active",
      endedAt: null,
      timeZone: "America/Los_Angeles",
      localDate: "2026-10-03",
    });
    expect(
      a.sets.every(
        (s) => s.completedAt === null && s.rir === null && s.unit === "lb",
      ),
    ).toBe(true);
    expect(a.sets[0]!.load).toBeCloseTo(44.092452, 5);
    expect(a.sets.map((s) => s.id)).not.toEqual(prior.sets.map((s) => s.id));
    expect(await database.sessions.get(prior.id)).toEqual(before);
    expect(await database.outbox.count()).toBe(count + 1);
    await expect(store.repeatSession(other, prior.id)).rejects.toThrow(
      "현재 프로필",
    );
  });
  it("같은 조건의 이전 값을 빈 입력에만 채우고 완료·RIR·현재 입력과 세트 순서를 보존한다", async () => {
    const prior = await history();
    const active = await plannedSession();
    await store.updateSet(
      owner,
      active.id,
      active.sets[0]!.id,
      { load: 0, reps: 5 },
      true,
    );
    await store.updateSet(owner, active.id, active.sets[1]!.id, {
      load: 30,
      rir: 1,
    });
    const first = (await database.sessions.get(active.id))!.sets[0];
    const next = await store.reusePreviousValues(
      owner,
      active.id,
      active.sets[0]!.exercise.id,
    );
    expect(next.sets[0]).toEqual(first);
    expect(next.sets[1]).toMatchObject({
      load: 30,
      reps: 9,
      rir: 1,
      completedAt: null,
    });
    expect(next.sets[2]).toMatchObject({
      load: 30,
      reps: 8,
      rir: null,
      completedAt: null,
    });
    expect(await database.sessions.get(prior.id)).toEqual(prior);
    await expect(
      store.reusePreviousValues(other, active.id, active.sets[0]!.exercise.id),
    ).rejects.toThrow();
    await store.tombstone(owner, "session", prior.id);
    const before = await database.sessions.get(active.id);
    const count = await database.outbox.count();
    await expect(
      store.reusePreviousValues(owner, active.id, active.sets[0]!.exercise.id),
    ).rejects.toThrow("이전 수행 기록");
    expect(await database.sessions.get(active.id)).toEqual(before);
    expect(await database.outbox.count()).toBe(count);
  });
  it("종목 교체는 미완료 입력만 비우고 완료한 기존 운동·ID·당시 루틴을 보존한다", async () => {
    const active = await plannedSession();
    const marked = await store.updateSet(
      owner,
      active.id,
      active.sets[0]!.id,
      { load: 20, reps: 10 },
      true,
    );
    const next = await store.replaceExercise(
      owner,
      active.id,
      active.sets[0]!.exercise.id,
      catalog[8]!,
    );
    expect(next.sets[0]).toEqual(marked.sets[0]);
    expect(next.routineSnapshot).toEqual(active.routineSnapshot);
    expect(
      next.sets
        .slice(1)
        .every(
          (s) =>
            s.exercise.id === catalog[8]!.id &&
            s.load === null &&
            s.reps === null &&
            s.completedAt === null,
        ),
    ).toBe(true);
    expect(next.sets.map((s) => s.id)).toEqual(active.sets.map((s) => s.id));
    await expect(
      store.replaceExercise(other, active.id, catalog[8]!.id, catalog[0]!),
    ).rejects.toThrow();
  });
  it("종료 수정은 시각·완료·원본 snapshot을 보존하고 오래된 수정/유효하지 않은 입력을 rollback한다", async () => {
    const prior = await history();
    const set = prior.sets[0]!;
    const patch = {
      load: 40,
      reps: 6,
      seconds: null,
      rir: 1,
      kind: set.kind,
      side: set.side,
    };
    const corrected = await store.correctSet(
      owner,
      prior.id,
      set.id,
      prior.revision,
      patch,
    );
    expect(corrected.sets[0]).toMatchObject({
      ...patch,
      completedAt: set.completedAt,
      id: set.id,
    });
    expect(corrected.endedAt).toBe(prior.endedAt);
    expect(corrected.startedAt).toBe(prior.startedAt);
    expect(corrected.routineSnapshot).toEqual(prior.routineSnapshot);
    const count = await database.outbox.count();
    await expect(
      store.correctSet(owner, prior.id, set.id, prior.revision, patch),
    ).rejects.toThrow("다른 곳");
    await expect(
      store.correctSet(owner, prior.id, set.id, corrected.revision, {
        ...patch,
        reps: null,
      }),
    ).rejects.toThrow();
    await expect(
      store.correctSet(other, prior.id, set.id, corrected.revision, patch),
    ).rejects.toThrow();
    expect(await database.sessions.get(prior.id)).toEqual(corrected);
    expect(await database.outbox.count()).toBe(count);
  });
});
