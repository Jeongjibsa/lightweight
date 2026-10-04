import {
  toKilograms,
  type Exercise,
  type Session,
  type TrainingSet,
} from "./models";

export const volumeVersion = "record-volume-v2";
export type VolumeMetric = "workingRows" | "reps" | "seconds" | "volume";
export type VolumePeriod = "28" | "84" | "all";
export interface VolumeTotals {
  workingRows: number;
  reps: number | null;
  seconds: number | null;
  volume: number | null;
  volumeRows: number;
}
export interface VolumeDay extends VolumeTotals {
  date: string;
}
export interface ExerciseCondition {
  key: string;
  exercise: Exercise;
  side: TrainingSet["side"];
  comparison?: TrainingSet["comparison"];
}
export function conditionKey(
  set: Pick<TrainingSet, "exercise" | "side" | "comparison">,
) {
  const e = set.exercise;
  const equipment = set.comparison?.equipmentLabel.trim() ?? "";
  const rom = set.comparison?.rangeOfMotion.trim() ?? "";
  return JSON.stringify([
    e.id,
    e.name,
    e.group,
    e.equipment,
    e.loadMode,
    set.side,
    // Keep legacy keys stable when no user-supplied condition is present.
    ...(equipment || rom ? [equipment, rom] : []),
  ]);
}
export function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
export function isRecorded(session: Session, ownerId: string) {
  return (
    session.ownerId === ownerId &&
    !session.deletedAt &&
    session.status !== "cancelled"
  );
}
export function completedWorking(sets: TrainingSet[]) {
  return sets.filter(
    (set) => set.kind === "working" && set.completedAt !== null,
  );
}
export function totalSets(sets: TrainingSet[], daily = false): VolumeTotals {
  const rows = completedWorking(sets);
  let reps: number | null = null;
  let seconds: number | null = null;
  let volume: number | null = null;
  let volumeRows = 0;
  for (const set of rows) {
    const mode = set.exercise.loadMode;
    if (mode === "timed") {
      if (set.seconds !== null) seconds = (seconds ?? 0) + set.seconds;
    } else if (set.reps !== null) reps = (reps ?? 0) + set.reps;
    if (
      (mode === "total" ||
        (!daily && (mode === "per_hand" || mode === "machine"))) &&
      set.load !== null &&
      set.reps !== null
    ) {
      volume = (volume ?? 0) + toKilograms(set.load, set.unit) * set.reps;
      volumeRows++;
    }
  }
  return { workingRows: rows.length, reps, seconds, volume, volumeRows };
}
export function volumeConditions(
  sessions: Session[],
  ownerId: string,
  today: string,
) {
  const conditions = new Map<string, ExerciseCondition>();
  for (const session of sessions) {
    if (!isRecorded(session, ownerId) || session.localDate > today) continue;
    for (const set of completedWorking(session.sets)) {
      const key = conditionKey(set);
      conditions.set(key, {
        key,
        exercise: set.exercise,
        side: set.side,
        comparison: set.comparison,
      });
    }
  }
  return [...conditions.values()].sort((a, b) => a.key.localeCompare(b.key));
}
export function volumeDays(
  sessions: Session[],
  ownerId: string,
  today: string,
  period: VolumePeriod,
  condition: string | null = null,
): VolumeDay[] {
  const start =
    period === "all" ? null : shiftDate(today, -(Number(period) - 1));
  const byDate = new Map<string, TrainingSet[]>();
  for (const session of sessions) {
    if (
      !isRecorded(session, ownerId) ||
      session.localDate > today ||
      (start && session.localDate < start)
    )
      continue;
    const sets = completedWorking(session.sets).filter(
      (set) => condition === null || conditionKey(set) === condition,
    );
    if (!sets.length) continue;
    const previous = byDate.get(session.localDate) ?? [];
    previous.push(...sets);
    byDate.set(session.localDate, previous);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, sets]) => ({ date, ...totalSets(sets, condition === null) }));
}
export function changePercent(first: number | null, last: number | null) {
  return first === null || last === null || first === 0
    ? null
    : ((last - first) / first) * 100;
}
// Keep date spacing and N/A breaks identical in the graph and its contracts.
export function trendSegments(days: VolumeDay[], metric: VolumeMetric) {
  const start = days.length ? Date.parse(days[0]!.date) : 0;
  const end = days.length ? Date.parse(days.at(-1)!.date) : 0;
  const segments: { date: string; value: number; x: number }[][] = [];
  let current: (typeof segments)[number] = [];
  for (const day of days) {
    const value = day[metric];
    if (value === null) {
      if (current.length) segments.push(current);
      current = [];
    } else
      current.push({
        date: day.date,
        value,
        x: end === start ? 0.5 : (Date.parse(day.date) - start) / (end - start),
      });
  }
  if (current.length) segments.push(current);
  return segments;
}
