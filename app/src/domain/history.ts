import {
  dateInZone,
  type Preferences,
  type Profile,
  type Routine,
  type Session,
} from "./models";
import { completedWorking, isRecorded, shiftDate } from "./volume";

export const historyVersion = "routine-history-v1";
export function samePreferences(a: Preferences | null, b: Preferences | null) {
  if (!a || !b) return false;
  return (
    JSON.stringify([
      a.goal,
      a.customGoal,
      a.weeklyMin,
      a.weeklyMax,
      a.split,
      a.customSplit,
      a.minutes,
      [...new Set(a.equipment)].sort(),
    ]) ===
    JSON.stringify([
      b.goal,
      b.customGoal,
      b.weeklyMin,
      b.weeklyMax,
      b.split,
      b.customSplit,
      b.minutes,
      [...new Set(b.equipment)].sort(),
    ])
  );
}
export type HistoryCandidate =
  | {
      state: "held";
      reason:
        "settings" | "equipment" | "active" | "today" | "history" | "routines";
      changedRecords: number;
    }
  | {
      state: "candidate";
      routine: Routine;
      previous: Session | null;
      changedRecords: number;
      historyCount: number;
    };
export function todayCandidate(
  profile: Profile,
  routines: Routine[],
  sessions: Session[],
  now: Date,
): HistoryCandidate {
  const today = dateInZone(now, profile.timeZone);
  const own = sessions.filter((s) => isRecorded(s, profile.ownerId));
  const held = (
    reason: Extract<HistoryCandidate, { state: "held" }>["reason"],
    changedRecords = 0,
  ): HistoryCandidate => ({ state: "held", reason, changedRecords });
  if (own.some((s) => s.status === "active")) return held("active");
  if (own.some((s) => s.localDate === today && completedWorking(s.sets).length))
    return held("today");
  const p = profile.preferences;
  if (!p) return held("settings");
  if (!p.equipment.length) return held("equipment");
  const recent = own.filter(
    (s) =>
      (s.status === "complete" || s.status === "partial") &&
      s.endedAt !== null &&
      s.localDate >= shiftDate(today, -28) &&
      s.localDate < today &&
      completedWorking(s.sets).length,
  );
  const history = recent.filter((s) =>
    samePreferences(s.preferencesSnapshot, p),
  );
  const changedRecords = recent.length - history.length;
  if (!history.length) return held("history", changedRecords);
  const eligible = routines.filter(
    (r) =>
      r.ownerId === profile.ownerId &&
      !r.deletedAt &&
      samePreferences(r.preferencesSnapshot, p) &&
      r.exercises.length &&
      r.exercises.every((entry) =>
        p.equipment.some((equipment) => equipment === entry.exercise.equipment),
      ),
  );
  if (!eligible.length) return held("routines", changedRecords);
  const latest = new Map<string, Session>();
  for (const s of history) {
    if (!s.routineSnapshot) continue;
    const id = s.routineSnapshot.id;
    const previous = latest.get(id);
    if (
      !previous ||
      s.startedAt > previous.startedAt ||
      (s.startedAt === previous.startedAt && s.id > previous.id)
    )
      latest.set(id, s);
  }
  const routine = eligible.toSorted(
    (a, b) =>
      (latest.get(a.id)?.startedAt ?? "").localeCompare(
        latest.get(b.id)?.startedAt ?? "",
      ) || a.id.localeCompare(b.id),
  )[0]!;
  return {
    state: "candidate",
    routine,
    previous: latest.get(routine.id) ?? null,
    changedRecords,
    historyCount: history.length,
  };
}
