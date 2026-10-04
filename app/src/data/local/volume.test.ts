import "fake-indexeddb/auto";
import { expect, it } from "vitest";
import { TrainingDatabase, TrainingStore } from "./store";
import { volumeDays } from "../../domain/volume";
import {
  owner,
  otherOwner,
  profileFixture,
  sessionFixture,
} from "../../../tests/fixtures/training";

it("실제 store의 편집/완료취소·DB 재개·삭제·백업 복원마다 볼륨을 재계산한다", async () => {
  const name = `volume-${crypto.randomUUID()}`;
  let db = new TrainingDatabase(name);
  let store = new TrainingStore(db);
  const session = sessionFixture();
  try {
    await store.ensureProfile(owner);
    await store.restore(owner, {
      format: "lightweight-backup",
      version: 1,
      exportedAt: "2026-10-04T03:00:00Z",
      profile: profileFixture(),
      routines: [],
      sessions: [session],
    });
    const read = async () =>
      volumeDays(
        (await store.workspace(owner)).sessions,
        owner,
        "2026-10-04",
        "28",
      );
    expect((await read())[0]!.volume).toBe(200);
    await store.updateSet(
      owner,
      session.id,
      session.sets[0]!.id,
      { load: 30 },
      true,
    );
    expect((await read())[0]!.volume).toBe(300);
    await store.updateSet(owner, session.id, session.sets[0]!.id, {}, false);
    expect(await read()).toEqual([]);
    await store.updateSet(
      owner,
      session.id,
      session.sets[0]!.id,
      { load: 0 },
      true,
    );
    const backup = await store.backup(owner);
    db.close();
    db = new TrainingDatabase(name);
    store = new TrainingStore(db);
    expect((await read())[0]!.volume).toBe(0);
    await store.tombstone(owner, "session", session.id);
    expect(await read()).toEqual([]);
    await store.restore(owner, backup);
    expect((await read())[0]!.volume).toBe(0);
    expect(
      volumeDays(
        (await store.workspace(owner)).sessions,
        otherOwner,
        "2026-10-04",
        "28",
      ),
    ).toEqual([]);
  } finally {
    await db.delete();
  }
});
