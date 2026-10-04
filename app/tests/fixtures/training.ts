import {
  profileSchema,
  routineSchema,
  sessionSchema,
  setSchema,
  type Profile,
  type Routine,
  type Session,
  type TrainingSet,
} from "../../src/domain/models";

export const owner = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
export const otherOwner = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
export const now = new Date("2026-10-04T03:00:00Z");
let counter = 0;
const id = () =>
  `00000000-0000-4000-8000-${String(++counter).padStart(12, "0")}`;
export function profileFixture(overrides: Partial<Profile> = {}): Profile {
  return profileSchema.parse({
    ownerId: owner,
    name: "가짜 검증 프로필",
    preferences: {
      goal: "hypertrophy",
      customGoal: "",
      weeklyMin: 3,
      weeklyMax: 4,
      split: "full_body",
      customSplit: "",
      minutes: 60,
      equipment: ["바벨", "덤벨", "머신", "케이블", "맨몸"],
    },
    unit: "kg",
    timeZone: "Asia/Seoul",
    revision: 1,
    updatedAt: "2026-10-04T03:00:00Z",
    ...overrides,
  });
}
export function setFixture(overrides: Partial<TrainingSet> = {}): TrainingSet {
  return setSchema.parse({
    id: id(),
    exercise: {
      id: "squat",
      name: "가짜 스쿼트",
      group: "하체",
      equipment: "바벨",
      loadMode: "total",
      review: "user_added",
    },
    order: 0,
    unit: "kg",
    load: 20,
    reps: 10,
    seconds: null,
    kind: "working",
    side: "both",
    rir: null,
    completedAt: "2026-10-01T04:00:00Z",
    ...overrides,
  });
}
export function routineFixture(overrides: Partial<Routine> = {}): Routine {
  return routineSchema.parse({
    id: id(),
    ownerId: owner,
    revision: 1,
    updatedAt: "2026-10-01T03:00:00Z",
    deletedAt: null,
    name: "가짜 루틴",
    exercises: [{ exercise: setFixture().exercise, sets: 3 }],
    preferencesSnapshot: profileFixture().preferences,
    ...overrides,
  });
}
export function sessionFixture(overrides: Partial<Session> = {}): Session {
  const date = overrides.localDate ?? "2026-10-01";
  return sessionSchema.parse({
    id: id(),
    ownerId: owner,
    revision: 1,
    updatedAt: `${date}T04:00:00Z`,
    deletedAt: null,
    name: "가짜 운동",
    localDate: date,
    timeZone: "Asia/Seoul",
    startedAt: `${date}T03:00:00Z`,
    endedAt: `${date}T04:00:00Z`,
    status: "complete",
    routineSnapshot: null,
    preferencesSnapshot: profileFixture().preferences,
    sets: [setFixture()],
    ...overrides,
  });
}
