import { checkBackupFileSize } from "../../domain/backup-file";
import Dexie, { type Table } from "dexie";
import {
  checkRemote,
  checkSnapshot,
  type CloudState,
  type DownloadPreview,
  type RemoteSnapshot,
  type Upload,
} from "../cloud/contracts";
import {
  backupSchema,
  dateInZone,
  preferencesSchema,
  profileSchema,
  routineSchema,
  sessionSchema,
  type Backup,
  type Entity,
  type Exercise,
  type OutboxItem,
  type Preferences,
  type Profile,
  type Routine,
  type Session,
  type TrainingSet,
  toKilograms,
} from "../../domain/models";
import { conditionKey } from "../../domain/volume";

export class TrainingDatabase extends Dexie {
  profiles!: Table<Profile, string>;
  routines!: Table<Routine, string>;
  sessions!: Table<Session, string>;
  outbox!: Table<OutboxItem, string>;
  cloud!: Table<CloudState, string>;
  constructor(name = "lightweight-v1") {
    super(name);
    this.version(1).stores({
      profiles: "ownerId",
      routines: "id, ownerId, updatedAt",
      sessions: "id, ownerId, localDate, updatedAt",
      outbox: "id, ownerId, entityId, createdAt",
    });
    this.version(2).stores({ cloud: "ownerId" });
  }
}
export const db = new TrainingDatabase();
const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();
function convertLoad(load: number, from: Profile["unit"], to: Profile["unit"]) {
  if (from === to) return load;
  return (
    Math.round(
      (toKilograms(load, from) / (to === "kg" ? 1 : 0.45359237)) * 1e6,
    ) / 1e6
  );
}
function requireOwner(value: { ownerId: string } | undefined, ownerId: string) {
  if (!value || value.ownerId !== ownerId)
    throw new Error("현재 프로필의 기록을 찾을 수 없습니다.");
}
export class TrainingStore {
  public database: TrainingDatabase;
  constructor(database: TrainingDatabase) {
    this.database = database;
  }
  private async enqueue(
    ownerId: string,
    entity: Entity,
    entityId: string,
    payload: Profile | Routine | Session,
  ) {
    await this.database.outbox.add({
      id: uuid(),
      ownerId,
      entity,
      entityId,
      revision: payload.revision,
      createdAt: now(),
      payload,
    });
  }
  async ensureProfile(ownerId: string) {
    return this.database.transaction("rw", this.database.profiles, async () => {
      const existing = await this.database.profiles.get(ownerId);
      if (existing) return existing;
      const profile = profileSchema.parse({
        ownerId,
        name: "나의 훈련",
        preferences: null,
        unit: "kg",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        revision: 1,
        updatedAt: now(),
      });
      await this.database.profiles.add(profile);
      return profile;
    });
  }
  async saveProfile(
    ownerId: string,
    input: Pick<Profile, "name" | "preferences" | "unit" | "timeZone">,
  ) {
    return this.database.transaction(
      "rw",
      this.database.profiles,
      this.database.outbox,
      async () => {
        const prior = await this.database.profiles.get(ownerId);
        requireOwner(prior, ownerId);
        const profile = profileSchema.parse({
          ...input,
          ownerId,
          revision: prior!.revision + 1,
          updatedAt: now(),
        });
        await this.database.profiles.put(profile);
        await this.enqueue(ownerId, "profile", ownerId, profile);
        return profile;
      },
    );
  }
  async workspace(ownerId: string) {
    const [profile, routines, sessions] = await Promise.all([
      this.database.profiles.get(ownerId),
      this.database.routines.where("ownerId").equals(ownerId).toArray(),
      this.database.sessions.where("ownerId").equals(ownerId).toArray(),
    ]);
    return {
      profile,
      routines: routines
        .filter((routine) => !routine.deletedAt)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      sessions: sessions
        .filter((session) => !session.deletedAt)
        .sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
    };
  }
  async saveRoutine(
    ownerId: string,
    input: { id?: string; name: string; exercises: Routine["exercises"] },
  ) {
    return this.database.transaction(
      "rw",
      this.database.routines,
      this.database.profiles,
      this.database.outbox,
      async () => {
        const profile = await this.database.profiles.get(ownerId);
        requireOwner(profile, ownerId);
        const existing = input.id
          ? await this.database.routines.get(input.id)
          : undefined;
        if (input.id) requireOwner(existing, ownerId);
        const routine = routineSchema.parse({
          ...input,
          id: input.id ?? uuid(),
          ownerId,
          preferencesSnapshot: profile!.preferences,
          revision: (existing?.revision ?? 0) + 1,
          updatedAt: now(),
          deletedAt: null,
        });
        await this.database.routines.put(routine);
        await this.enqueue(ownerId, "routine", routine.id, routine);
        return routine;
      },
    );
  }
  async startSession(ownerId: string, routineId?: string) {
    return this.database.transaction(
      "rw",
      this.database.sessions,
      this.database.routines,
      this.database.profiles,
      this.database.outbox,
      async () => {
        const profile = await this.database.profiles.get(ownerId);
        requireOwner(profile, ownerId);
        const active = await this.database.sessions
          .where("ownerId")
          .equals(ownerId)
          .filter(
            (session) => session.status === "active" && !session.deletedAt,
          )
          .first();
        if (active) return active;
        const routine = routineId
          ? await this.database.routines.get(routineId)
          : undefined;
        if (routineId) {
          requireOwner(routine, ownerId);
          if (routine!.deletedAt)
            throw new Error("삭제된 루틴으로 시작할 수 없습니다.");
        }
        const at = now();
        const sets = (routine?.exercises ?? []).flatMap(
          ({ exercise, sets: count }) =>
            Array.from({ length: count }, (_, order) =>
              this.newSet(exercise, profile!.unit, order),
            ),
        );
        const session = sessionSchema.parse({
          id: uuid(),
          ownerId,
          revision: 1,
          updatedAt: at,
          deletedAt: null,
          name: routine?.name ?? "자유 운동",
          localDate: dateInZone(new Date(at), profile!.timeZone),
          timeZone: profile!.timeZone,
          startedAt: at,
          endedAt: null,
          status: "active",
          routineSnapshot: routine ?? null,
          preferencesSnapshot: profile!.preferences,
          sets,
        });
        await this.database.sessions.add(session);
        await this.enqueue(ownerId, "session", session.id, session);
        return session;
      },
    );
  }
  newSet(
    exercise: Exercise,
    unit: Profile["unit"],
    order: number,
  ): TrainingSet {
    return {
      id: uuid(),
      exercise,
      order,
      unit,
      load: null,
      reps: null,
      seconds: null,
      kind: "working",
      side: "both",
      rir: null,
      completedAt: null,
    };
  }
  async changeSession(
    ownerId: string,
    sessionId: string,
    change: (session: Session) => Session | Promise<Session>,
  ) {
    return this.database.transaction(
      "rw",
      this.database.sessions,
      this.database.outbox,
      async () => {
        const prior = await this.database.sessions.get(sessionId);
        requireOwner(prior, ownerId);
        if (prior!.deletedAt) throw new Error("삭제한 운동 기록입니다.");
        const changed = await change(structuredClone(prior!));
        const session = sessionSchema.parse({
          ...changed,
          id: prior!.id,
          ownerId,
          revision: prior!.revision + 1,
          updatedAt: now(),
        });
        await this.database.sessions.put(session);
        await this.enqueue(ownerId, "session", session.id, session);
        return session;
      },
    );
  }
  async reusePreviousValues(
    ownerId: string,
    sessionId: string,
    exerciseId: string,
  ) {
    return this.changeSession(ownerId, sessionId, async (session) => {
      if (session.status !== "active")
        throw new Error("진행 중인 운동에서만 이전 값을 불러올 수 있습니다.");
      const targets = session.sets.filter(
        (s) => s.exercise.id === exerciseId && !s.completedAt,
      );
      const past = (
        await this.database.sessions.where("ownerId").equals(ownerId).toArray()
      )
        .filter(
          (s) =>
            s.id !== sessionId &&
            !s.deletedAt &&
            s.endedAt &&
            s.status !== "active",
        )
        .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
      const source = past.find((s) =>
        s.sets.some(
          (p) =>
            p.completedAt &&
            targets.some(
              (t) => t.kind === p.kind && conditionKey(t) === conditionKey(p),
            ),
        ),
      );
      if (!source)
        throw new Error("같은 운동 조건의 이전 수행 기록이 없습니다.");
      const used = new Map<string, number>();
      for (const target of session.sets.filter(
        (s) => s.exercise.id === exerciseId,
      )) {
        const key = `${conditionKey(target)}-${target.kind}`;
        const candidates = source.sets.filter(
          (p) =>
            p.completedAt &&
            p.kind === target.kind &&
            conditionKey(p) === conditionKey(target),
        );
        const index = used.get(key) ?? 0;
        used.set(key, index + 1);
        if (target.completedAt) continue;
        const prior = candidates[index];
        if (!prior) continue;
        // Fill empty values only. Neither old effort nor completion is today's work.
        if (target.load === null && prior.load !== null)
          target.load = convertLoad(prior.load, prior.unit, target.unit);
        target.reps ??= prior.reps;
        target.seconds ??= prior.seconds;
      }
      return session;
    });
  }
  async repeatSession(ownerId: string, sourceId: string) {
    return this.database.transaction(
      "rw",
      this.database.profiles,
      this.database.sessions,
      this.database.outbox,
      async () => {
        const profile = await this.database.profiles.get(ownerId);
        requireOwner(profile, ownerId);
        const source = await this.database.sessions.get(sourceId);
        requireOwner(source, ownerId);
        if (
          source!.deletedAt ||
          !source!.endedAt ||
          source!.status === "active"
        )
          throw new Error("종료한 운동 기록에서만 다시 시작할 수 있습니다.");
        const active = await this.database.sessions
          .where("ownerId")
          .equals(ownerId)
          .filter((s) => !s.deletedAt && s.status === "active")
          .first();
        if (active) return active;
        const performed = source!.sets.filter((s) => s.completedAt);
        if (!performed.length)
          throw new Error("다시 사용할 완료 세트가 없습니다.");
        const at = now();
        const orders = new Map<string, number>();
        const session = sessionSchema.parse({
          ...source!,
          id: uuid(),
          revision: 1,
          updatedAt: at,
          deletedAt: null,
          startedAt: at,
          endedAt: null,
          status: "active",
          localDate: dateInZone(new Date(at), profile!.timeZone),
          timeZone: profile!.timeZone,
          preferencesSnapshot: profile!.preferences,
          sets: performed.map((s) => {
            const order = orders.get(s.exercise.id) ?? 0;
            orders.set(s.exercise.id, order + 1);
            return {
              ...s,
              id: uuid(),
              order,
              unit: profile!.unit,
              load:
                s.load === null
                  ? null
                  : convertLoad(s.load, s.unit, profile!.unit),
              completedAt: null,
              rir: null,
            };
          }),
        });
        await this.database.sessions.add(session);
        await this.enqueue(ownerId, "session", session.id, session);
        return session;
      },
    );
  }
  async replaceExercise(
    ownerId: string,
    sessionId: string,
    exerciseId: string,
    exercise: Exercise,
  ) {
    return this.changeSession(ownerId, sessionId, (session) => {
      if (session.status !== "active")
        throw new Error("진행 중인 운동에서만 종목을 교체할 수 있습니다.");
      if (exerciseId === exercise.id)
        throw new Error("다른 운동을 선택해주세요.");
      const targets = session.sets.filter(
        (s) => s.exercise.id === exerciseId && !s.completedAt,
      );
      if (!targets.length) throw new Error("교체할 미완료 세트가 없습니다.");
      let order =
        Math.max(
          -1,
          ...session.sets
            .filter((s) => s.exercise.id === exercise.id)
            .map((s) => s.order),
        ) + 1;
      for (const set of targets)
        Object.assign(set, {
          exercise,
          order: order++,
          load: null,
          reps: null,
          seconds: null,
          rir: null,
          side: "both",
        });
      return session;
    });
  }
  async correctSet(
    ownerId: string,
    sessionId: string,
    setId: string,
    expectedRevision: number,
    patch: Pick<
      TrainingSet,
      "load" | "reps" | "seconds" | "kind" | "side" | "rir"
    >,
  ) {
    return this.changeSession(ownerId, sessionId, (session) => {
      if (!session.endedAt || session.status === "active")
        throw new Error("종료한 기록의 수정만 지원합니다.");
      if (session.revision !== expectedRevision)
        throw new Error(
          "기록이 다른 곳에서 바뀌었습니다. 다시 열어 수정해주세요.",
        );
      const set = session.sets.find((s) => s.id === setId);
      if (!set) throw new Error("세트를 찾을 수 없습니다.");
      Object.assign(set, patch);
      return session;
    });
  }
  async addExercise(ownerId: string, sessionId: string, exercise: Exercise) {
    const profile = await this.database.profiles.get(ownerId);
    requireOwner(profile, ownerId);
    return this.changeSession(ownerId, sessionId, (session) => {
      if (session.status !== "active")
        throw new Error("종료된 운동에는 새 종목을 추가할 수 없습니다.");
      if (session.sets.length >= 390)
        throw new Error("세트 수가 너무 많습니다.");
      session.sets.push(
        ...Array.from({ length: 3 }, (_, order) =>
          this.newSet(exercise, profile!.unit, order),
        ),
      );
      return session;
    });
  }
  async updateSet(
    ownerId: string,
    sessionId: string,
    setId: string,
    patch: Partial<
      Pick<TrainingSet, "load" | "reps" | "seconds" | "kind" | "side" | "rir">
    >,
    completed?: boolean,
  ) {
    return this.changeSession(ownerId, sessionId, (session) => {
      const set = session.sets.find((entry) => entry.id === setId);
      if (!set) throw new Error("세트를 찾을 수 없습니다.");
      Object.assign(set, patch);
      // Draft edits are saved, but never silently treated as completed work.
      if (completed !== undefined) set.completedAt = completed ? now() : null;
      else set.completedAt = null;
      if (session.endedAt)
        session.status = session.sets.every((entry) => entry.completedAt)
          ? "complete"
          : "partial";
      return session;
    });
  }
  async addSet(ownerId: string, sessionId: string, exercise: Exercise) {
    return this.changeSession(ownerId, sessionId, (session) => {
      if (session.status !== "active")
        throw new Error("종료된 운동에는 새 세트를 추가할 수 없습니다.");
      const entries = session.sets.filter(
        (set) => set.exercise.id === exercise.id,
      );
      const last = entries.at(-1);
      const next = this.newSet(exercise, last?.unit ?? "kg", entries.length);
      session.sets.push({
        ...next,
        load: last?.load ?? null,
        reps: last?.reps ?? null,
        seconds: last?.seconds ?? null,
      });
      return session;
    });
  }
  async endSession(ownerId: string, sessionId: string) {
    return this.changeSession(ownerId, sessionId, (session) => {
      if (session.status !== "active") return session;
      const completed = session.sets.filter((set) => set.completedAt);
      if (!completed.length)
        throw new Error(
          "완료한 세트가 없습니다. 세트를 기록하거나 운동을 취소해주세요.",
        );
      session.status =
        completed.length === session.sets.length ? "complete" : "partial";
      session.endedAt = now();
      return session;
    });
  }
  async tombstone(
    ownerId: string,
    entity: "session" | "routine",
    entityId: string,
  ) {
    const table =
      entity === "session" ? this.database.sessions : this.database.routines;
    return this.database.transaction(
      "rw",
      table,
      this.database.outbox,
      async () => {
        const prior = await table.get(entityId);
        requireOwner(prior, ownerId);
        const payload = {
          ...prior!,
          deletedAt: now(),
          updatedAt: now(),
          revision: prior!.revision + 1,
        };
        await table.put(payload as Session & Routine);
        await this.enqueue(ownerId, entity, entityId, payload);
      },
    );
  }
  async backup(ownerId: string): Promise<Backup> {
    return this.database.transaction(
      "r",
      this.database.profiles,
      this.database.routines,
      this.database.sessions,
      async () => {
        const profile = await this.database.profiles.get(ownerId);
        requireOwner(profile, ownerId);
        return backupSchema.parse({
          format: "lightweight-backup",
          version: 1,
          exportedAt: now(),
          profile,
          routines: await this.database.routines
            .where("ownerId")
            .equals(ownerId)
            .toArray(),
          sessions: await this.database.sessions
            .where("ownerId")
            .equals(ownerId)
            .toArray(),
        });
      },
    );
  }
  parseBackup(text: string) {
    checkBackupFileSize(new TextEncoder().encode(text).byteLength);
    return backupSchema.parse(JSON.parse(text));
  }
  async restore(ownerId: string, input: Backup) {
    const backup = backupSchema.parse(input);
    return this.database.transaction(
      "rw",
      this.database.profiles,
      this.database.routines,
      this.database.sessions,
      this.database.outbox,
      this.database.cloud,
      async () => {
        // Explicit JSON import remaps ownership; never uploads automatically.
        requireOwner(await this.database.profiles.get(ownerId), ownerId);
        for (const [records, table] of [
          [backup.routines, this.database.routines],
          [backup.sessions, this.database.sessions],
        ] as const) {
          for (const record of records) {
            const existing = await table.get(record.id);
            if (existing && existing.ownerId !== ownerId)
              throw new Error(
                "다른 프로필과 기록 ID가 충돌하여 복원하지 않았습니다.",
              );
          }
        }
        const profile: Profile = {
          ...backup.profile,
          ownerId,
          revision: backup.profile.revision + 1,
          updatedAt: now(),
        };
        const routines: Routine[] = backup.routines.map((routine) => ({
          ...routine,
          ownerId,
        }));
        const sessions: Session[] = backup.sessions.map((session) => ({
          ...session,
          ownerId,
          routineSnapshot: session.routineSnapshot
            ? { ...session.routineSnapshot, ownerId }
            : null,
        }));
        await this.database.routines.where("ownerId").equals(ownerId).delete();
        await this.database.sessions.where("ownerId").equals(ownerId).delete();
        await this.database.outbox.where("ownerId").equals(ownerId).delete();
        await this.database.profiles.put(profile);
        await this.database.routines.bulkPut(routines);
        await this.database.sessions.bulkPut(sessions);
        await this.enqueue(ownerId, "profile", ownerId, profile);
        for (const routine of routines)
          await this.enqueue(ownerId, "routine", routine.id, routine);
        for (const session of sessions)
          await this.enqueue(ownerId, "session", session.id, session);
        const cloud = await this.cloudState(ownerId);
        await this.database.cloud.put({ ...cloud, pending: null });
      },
    );
  }
  async cloudState(ownerId: string): Promise<CloudState> {
    return (
      (await this.database.cloud.get(ownerId)) ?? {
        ownerId,
        baseRevision: 0,
        lastSyncedAt: null,
        pending: null,
        recovery: null,
      }
    );
  }
  async prepareUpload(ownerId: string): Promise<Upload> {
    return this.database.transaction("rw", this.database.tables, async () => {
      const cloud = await this.cloudState(ownerId);
      if (cloud.pending) return cloud.pending;
      const snapshot = checkSnapshot(await this.backup(ownerId), ownerId);
      if (snapshot.sessions.some((s) => s.status === "active" && !s.deletedAt))
        throw new Error("진행 중인 운동을 마친 후 동기화해주세요.");
      const pending: Upload = {
        operationId: uuid(),
        baseRevision: cloud.baseRevision,
        snapshot,
        queueIds: (
          await this.database.outbox.where("ownerId").equals(ownerId).toArray()
        ).map((item) => item.id),
      };
      await this.database.cloud.put({ ...cloud, pending });
      return pending;
    });
  }
  async acknowledgeUpload(
    ownerId: string,
    operationId: string,
    revision: number,
  ) {
    if (!Number.isSafeInteger(revision) || revision < 1)
      throw new Error("서버 버전을 확인해주세요.");
    return this.database.transaction(
      "rw",
      this.database.cloud,
      this.database.outbox,
      async () => {
        const cloud = await this.cloudState(ownerId);
        if (!cloud.pending || cloud.pending.operationId !== operationId) return;
        if (revision !== cloud.pending.baseRevision + 1)
          throw new Error("서버 응답의 버전이 일치하지 않습니다.");
        await this.database.outbox.bulkDelete(cloud.pending.queueIds);
        await this.database.cloud.put({
          ...cloud,
          baseRevision: revision,
          lastSyncedAt: now(),
          pending: null,
        });
      },
    );
  }
  private async localSignature(ownerId: string) {
    const snapshot = await this.backup(ownerId);
    const { exportedAt: _exportedAt, ...records } = snapshot;
    return JSON.stringify({
      records,
      cloud: await this.cloudState(ownerId),
      queue: await this.database.outbox
        .where("ownerId")
        .equals(ownerId)
        .toArray(),
    });
  }
  async previewDownload(
    ownerId: string,
    input: RemoteSnapshot,
  ): Promise<DownloadPreview> {
    const remote = checkRemote(input, ownerId);
    if (!remote.snapshot)
      throw new Error("이 계정에 아직 클라우드 기록이 없습니다.");
    return this.database.transaction("r", this.database.tables, async () => ({
      remote,
      localSignature: await this.localSignature(ownerId),
      dirty:
        !!(await this.cloudState(ownerId)).pending ||
        !!(await this.database.outbox.where("ownerId").equals(ownerId).count()),
    }));
  }
  async applyDownload(ownerId: string, preview: DownloadPreview) {
    const remote = checkRemote(preview.remote, ownerId);
    if (!remote.snapshot) throw new Error("클라우드 기록이 없습니다.");
    return this.database.transaction("rw", this.database.tables, async () => {
      if ((await this.localSignature(ownerId)) !== preview.localSignature)
        throw new Error(
          "확인하는 동안 기기 기록이 바뀌었습니다. 다시 불러와주세요.",
        );
      const recovery = await this.backup(ownerId);
      if (recovery.sessions.some((s) => s.status === "active" && !s.deletedAt))
        throw new Error("진행 중인 운동을 마친 후 불러와주세요.");
      await this.database.routines.where("ownerId").equals(ownerId).delete();
      await this.database.sessions.where("ownerId").equals(ownerId).delete();
      await this.database.outbox.where("ownerId").equals(ownerId).delete();
      await this.database.profiles.put(remote.snapshot!.profile);
      await this.database.routines.bulkPut(remote.snapshot!.routines);
      await this.database.sessions.bulkPut(remote.snapshot!.sessions);
      await this.database.cloud.put({
        ownerId,
        baseRevision: remote.revision,
        lastSyncedAt: now(),
        pending: null,
        recovery,
      });
    });
  }
}
export const store = new TrainingStore(db);
export function validatePreferences(input: unknown): Preferences {
  return preferencesSchema.parse(input);
}
