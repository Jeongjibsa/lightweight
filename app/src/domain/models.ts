import { z } from "zod";

export const goals = {
  hypertrophy: "근육량 증대",
  strength: "근력 향상",
  consistency: "규칙적인 운동",
  custom: "직접 설정",
} as const;
export const splits = {
  full_body: "무분할",
  two_way: "2분할",
  three_way: "3분할",
  four_way: "4분할",
  five_way: "5분할",
  custom: "직접 설정",
} as const;
export const equipmentOptions = [
  "덤벨",
  "바벨",
  "머신",
  "케이블",
  "맨몸",
] as const;
export const groups = ["가슴", "등", "어깨", "팔", "하체", "코어"] as const;
// Recording/navigation taxonomy, not exclusive muscle recruitment or a ranking.
export const subgroups = {
  가슴: ["상부", "중부", "하부"],
  등: ["광배", "상부 등", "등 전체"],
  어깨: ["전면", "측면", "후면"],
  팔: ["이두", "삼두", "전완"],
  하체: ["허벅지 앞쪽", "허벅지 뒤쪽", "둔부", "종아리", "하체 전체"],
  코어: ["복부", "옆구리"],
} as const;
export const restPreferencesSchema = z.object({
  seconds: z.number().int().min(15).max(1800),
  favorites: z
    .array(z.number().int().min(15).max(1800))
    .min(3)
    .max(4)
    .refine(
      (values) => new Set(values).size === values.length,
      "서로 다른 시간을 입력해주세요.",
    ),
});
export type RestPreferences = z.infer<typeof restPreferencesSchema>;
export const defaultRestPreferences: RestPreferences = {
  seconds: 60,
  favorites: [60, 90, 120, 180],
};
export const loadModes = {
  total: "총 중량",
  per_hand: "한 손 중량",
  machine: "머신 표시 중량",
  bodyweight: "맨몸 추가 중량",
  assisted: "보조량",
  timed: "시간",
} as const;
const id = z.uuid();
const stamp = z.iso.datetime();
export const preferencesSchema = z
  .object({
    goal: z.enum(["hypertrophy", "strength", "consistency", "custom"]),
    customGoal: z.string().trim().max(100),
    weeklyMin: z.number().int().min(1).max(7),
    weeklyMax: z.number().int().min(1).max(7),
    split: z.enum([
      "full_body",
      "two_way",
      "three_way",
      "four_way",
      "five_way",
      "custom",
    ]),
    customSplit: z.string().trim().max(100),
    minutes: z.number().int().min(10).max(240).nullable(),
    equipment: z.array(z.enum(equipmentOptions)).max(5),
  })
  .superRefine((value, ctx) => {
    if (value.weeklyMax < value.weeklyMin)
      ctx.addIssue({
        code: "custom",
        path: ["weeklyMax"],
        message: "최대 횟수는 최소 횟수 이상이어야 합니다.",
      });
    if (value.goal === "custom" && !value.customGoal)
      ctx.addIssue({
        code: "custom",
        path: ["customGoal"],
        message: "목표를 입력해주세요.",
      });
    if (value.split === "custom" && !value.customSplit)
      ctx.addIssue({
        code: "custom",
        path: ["customSplit"],
        message: "분할 방법을 입력해주세요.",
      });
  });
export type Preferences = z.infer<typeof preferencesSchema>;
export const profileSchema = z.object({
  ownerId: id,
  name: z.string().trim().min(1).max(40),
  preferences: preferencesSchema.nullable(),
  restTimer: restPreferencesSchema.optional(),
  unit: z.enum(["kg", "lb"]),
  timeZone: z
    .string()
    .max(100)
    .refine((value) => {
      try {
        new Intl.DateTimeFormat("en", { timeZone: value });
        return true;
      } catch {
        return false;
      }
    }),
  revision: z.number().int().min(1),
  updatedAt: stamp,
});
export type Profile = z.infer<typeof profileSchema>;
export const exerciseSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().trim().min(1).max(80),
  group: z.enum(groups),
  subgroup: z.string().min(1).max(40).optional(),
  aliases: z.array(z.string().min(1).max(80)).max(8).optional(),
  equipment: z.string().max(80),
  loadMode: z.enum([
    "total",
    "per_hand",
    "machine",
    "bodyweight",
    "assisted",
    "timed",
  ]),
  review: z.enum(["catalog_draft", "user_added"]),
});
export type Exercise = z.infer<typeof exerciseSchema>;
const metadata = {
  id,
  ownerId: id,
  revision: z.number().int().min(1),
  updatedAt: stamp,
  deletedAt: stamp.nullable(),
};
export const routineSchema = z.object({
  ...metadata,
  name: z.string().trim().min(1).max(80),
  exercises: z
    .array(
      z.object({
        exercise: exerciseSchema,
        sets: z.number().int().min(1).max(12),
      }),
    )
    .min(1)
    .max(30),
  preferencesSnapshot: preferencesSchema.nullable(),
});
export type Routine = z.infer<typeof routineSchema>;
export const comparisonSchema = z.object({
  equipmentLabel: z.string().trim().max(80),
  rangeOfMotion: z.string().trim().max(80),
});
export type Comparison = z.infer<typeof comparisonSchema>;
export const setSchema = z
  .object({
    id,
    exercise: exerciseSchema,
    order: z.number().int().min(0),
    unit: z.enum(["kg", "lb"]),
    load: z.number().min(0).max(3000).nullable(),
    reps: z.number().int().min(1).max(1000).nullable(),
    seconds: z.number().int().min(1).max(86400).nullable(),
    kind: z.enum(["working", "warmup"]),
    side: z.enum(["both", "left", "right"]),
    rir: z.number().min(0).max(10).nullable(),
    comparison: comparisonSchema.optional(),
    completedAt: stamp.nullable(),
  })
  .superRefine((value, ctx) => {
    if (!value.completedAt) return;
    if (value.exercise.loadMode === "timed") {
      if (value.seconds === null)
        ctx.addIssue({
          code: "custom",
          path: ["seconds"],
          message: "완료하려면 시간을 입력해주세요.",
        });
    } else {
      if (value.reps === null)
        ctx.addIssue({
          code: "custom",
          path: ["reps"],
          message: "완료하려면 횟수를 입력해주세요.",
        });
      if (value.load === null && value.exercise.loadMode !== "bodyweight")
        ctx.addIssue({
          code: "custom",
          path: ["load"],
          message: "완료하려면 중량을 입력해주세요. 0도 입력할 수 있습니다.",
        });
    }
  });
export type TrainingSet = z.infer<typeof setSchema>;
export const sessionSchema = z
  .object({
    ...metadata,
    name: z.string().max(80),
    note: z.string().trim().max(1000).optional(),
    localDate: z.iso.date(),
    timeZone: profileSchema.shape.timeZone,
    startedAt: stamp,
    endedAt: stamp.nullable(),
    status: z.enum(["active", "complete", "partial", "cancelled"]),
    routineSnapshot: routineSchema.nullable(),
    preferencesSnapshot: preferencesSchema.nullable(),
    sets: z.array(setSchema).max(400),
  })
  .superRefine((value, ctx) => {
    const setIds = value.sets.map((set) => set.id);
    if (new Set(setIds).size !== setIds.length)
      ctx.addIssue({
        code: "custom",
        path: ["sets"],
        message: "세트 ID가 중복되었습니다.",
      });
    if (
      value.routineSnapshot &&
      value.routineSnapshot.ownerId !== value.ownerId
    )
      ctx.addIssue({
        code: "custom",
        path: ["routineSnapshot"],
        message: "루틴 소유자가 일치하지 않습니다.",
      });
    if (value.status === "active" && value.endedAt !== null)
      ctx.addIssue({
        code: "custom",
        path: ["endedAt"],
        message: "진행 중인 운동에 종료 시각이 있습니다.",
      });
    if (
      (value.status === "complete" || value.status === "partial") &&
      value.endedAt === null
    )
      ctx.addIssue({
        code: "custom",
        path: ["endedAt"],
        message: "종료한 운동에 종료 시각이 필요합니다.",
      });
    if (value.endedAt && value.endedAt < value.startedAt)
      ctx.addIssue({
        code: "custom",
        path: ["endedAt"],
        message: "종료 시각은 시작 시각 이후여야 합니다.",
      });
  });
export type Session = z.infer<typeof sessionSchema>;
export type Entity = "profile" | "routine" | "session";
export interface OutboxItem {
  id: string;
  ownerId: string;
  entity: Entity;
  entityId: string;
  revision: number;
  createdAt: string;
  payload: Profile | Routine | Session;
}
export const backupSchema = z
  .object({
    format: z.literal("lightweight-backup"),
    version: z.literal(1),
    exportedAt: stamp,
    profile: profileSchema,
    routines: z.array(routineSchema).max(500),
    sessions: z.array(sessionSchema).max(10000),
  })
  .superRefine((value, ctx) => {
    const records = [...value.routines, ...value.sessions];
    if (records.some((record) => record.ownerId !== value.profile.ownerId))
      ctx.addIssue({
        code: "custom",
        message: "백업에 다른 프로필의 기록이 섞여 있습니다.",
      });
    for (const entries of [value.routines, value.sessions]) {
      if (new Set(entries.map((entry) => entry.id)).size !== entries.length)
        ctx.addIssue({
          code: "custom",
          message: "백업의 기록 ID가 중복되었습니다.",
        });
    }
    if (
      value.sessions.filter(
        (session) => !session.deletedAt && session.status === "active",
      ).length > 1
    )
      ctx.addIssue({
        code: "custom",
        message: "진행 중인 운동은 프로필당 하나만 복원할 수 있습니다.",
      });
  });
export type Backup = z.infer<typeof backupSchema>;
export function dateInZone(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}
export function toKilograms(value: number, unit: "kg" | "lb") {
  return unit === "kg" ? value : value * 0.45359237;
}
export function summarize(sessions: Session[]) {
  const records = sessions.filter(
    (session) => !session.deletedAt && session.status !== "cancelled",
  );
  const completed = records.flatMap((session) =>
    session.sets.filter((set) => set.completedAt && set.kind === "working"),
  );
  return {
    sessionCount: records.filter((session) =>
      session.sets.some((set) => set.completedAt && set.kind === "working"),
    ).length,
    workingRows: completed.length,
    days: new Set(
      records
        .filter((session) =>
          session.sets.some((set) => set.completedAt && set.kind === "working"),
        )
        .map((session) => session.localDate),
    ).size,
    plannedRows: records.reduce(
      (count, session) =>
        count + session.sets.filter((set) => set.kind === "working").length,
      0,
    ),
    byGroup: Object.fromEntries(
      groups.map((group) => [
        group,
        completed.filter((set) => set.exercise.group === group).length,
      ]),
    ) as Record<(typeof groups)[number], number>,
  };
}
