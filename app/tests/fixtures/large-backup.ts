import type { Backup } from "../../src/domain/models";
import { profileFixture, sessionFixture, setFixture } from "./training";

// Valid, synthetic long-term records. Multi-byte labels expose byte/character mistakes.
export function largeBackupFixture(ownerId: string, sessionCount = 36): Backup {
  const set = setFixture({
    exercise: { ...setFixture().exercise, name: "가".repeat(80) },
  });
  const session = sessionFixture({ ownerId });
  return {
    format: "lightweight-backup",
    version: 1,
    exportedAt: "2026-10-04T03:00:00.000Z",
    profile: profileFixture({ ownerId }),
    routines: [],
    sessions: Array.from({ length: sessionCount }, () => ({
      ...session,
      id: crypto.randomUUID(),
      sets: Array.from({ length: 400 }, (_, order) => ({
        ...set,
        id: crypto.randomUUID(),
        order,
      })),
    })),
  };
}
