import { dateInZone, type Profile, type Session } from "./models";
import { completedWorking, conditionKey, shiftDate } from "./volume";

export const coverageVersion = "record-coverage-v2";

// Describes recorded data only; these counts are not a training prescription.
export function reportCoverage(
  profile: Profile,
  sessions: Session[],
  now: Date,
) {
  const today = dateInZone(now, profile.timeZone);
  const weekday = new Date(`${today}T12:00:00Z`).getUTCDay();
  const start = shiftDate(today, -((weekday + 6) % 7));
  const records = sessions.filter(
    (s) =>
      s.ownerId === profile.ownerId &&
      !s.deletedAt &&
      s.status !== "cancelled" &&
      s.localDate >= start &&
      s.localDate <= today,
  );
  const ended = records.filter(
    (s) => s.status !== "active" && s.endedAt !== null,
  );
  const completed = ended.flatMap((s) => completedWorking(s.sets));
  const conditionDates = new Map<string, Set<string>>();
  for (const s of ended) {
    for (const set of completedWorking(s.sets)) {
      const key = conditionKey(set);
      const dates = conditionDates.get(key) ?? new Set<string>();
      dates.add(s.localDate);
      conditionDates.set(key, dates);
    }
  }
  const byNewest = (a: Session, b: Session) =>
    b.startedAt.localeCompare(a.startedAt);
  const active = records.filter((s) => s.status === "active").sort(byNewest);
  const incomplete = ended
    .filter((s) =>
      s.sets.some((set) => set.kind === "working" && !set.completedAt),
    )
    .sort(byNewest);
  return {
    version: coverageVersion,
    start,
    end: today,
    timeZone: profile.timeZone,
    goal: profile.preferences
      ? {
          min: profile.preferences.weeklyMin,
          max: profile.preferences.weeklyMax,
        }
      : null,
    completedDays: new Set(
      ended
        .filter((s) => completedWorking(s.sets).length)
        .map((s) => s.localDate),
    ).size,
    completedSessions: ended.filter((s) => completedWorking(s.sets).length)
      .length,
    completedRows: completed.length,
    missingRir: completed.filter((set) => set.rir === null).length,
    incompleteRows: ended.reduce(
      (n, s) =>
        n +
        s.sets.filter((set) => set.kind === "working" && !set.completedAt)
          .length,
      0,
    ),
    comparableConditions: [...conditionDates.values()].filter(
      (dates) => dates.size >= 2,
    ).length,
    activeSession: active[0] ?? null,
    incompleteSession: incomplete[0] ?? null,
    mixedTimeZones: ended.some((s) => s.timeZone !== profile.timeZone),
    // Records are recomputed live. Retain their revision identity for reproducibility.
    inputRevision: JSON.stringify([
      profile.ownerId,
      profile.revision,
      start,
      today,
      records
        .map((s) => [s.id, s.revision])
        .sort(([a], [b]) => String(a).localeCompare(String(b))),
    ]),
  };
}
