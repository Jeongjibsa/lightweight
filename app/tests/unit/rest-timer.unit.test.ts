import { expect, it } from "vitest";
import {
  defaultRestPreferences,
  exerciseSchema,
  profileSchema,
  restPreferencesSchema,
  subgroups,
} from "../../src/domain/models";
import {
  pauseRest,
  remainingRest,
  resumeRest,
  startRest,
} from "../../src/domain/rest-timer";
import { catalog } from "../../src/content/catalog";
import { profileFixture } from "../fixtures/training";

it("rest timer uses deadline time across delayed ticks, pause/resume and expiry", () => {
  const running = startRest("set:stamp", 60, 1000);
  expect(remainingRest(running, 1000)).toBe(60);
  expect(remainingRest(running, 31500)).toBe(30);
  expect(remainingRest(running, 1000000)).toBe(0);
  const paused = pauseRest(running, 31000);
  expect(remainingRest(paused, 100000)).toBe(30);
  const resumed = resumeRest(paused, 100000);
  expect(remainingRest(resumed, 110000)).toBe(20);
  expect(remainingRest({ ...resumed, stopped: true }, 110000)).toBe(0);
});
it("favorites accept three or four distinct bounded durations and start with one minute", () => {
  expect(defaultRestPreferences.seconds).toBe(60);
  for (const favorites of [
    [30, 60, 90],
    [30, 60, 90, 1800],
  ])
    expect(
      restPreferencesSchema.safeParse({ seconds: 60, favorites }).success,
    ).toBe(true);
  for (const favorites of [
    [60, 60, 120],
    [60, 120],
    [15, 60, 120, 180, 300],
    [14, 60, 120],
    [60, 120, 1801],
  ])
    expect(
      restPreferencesSchema.safeParse({ seconds: 60, favorites }).success,
    ).toBe(false);
});
it("catalog keeps legacy IDs and includes big three, barbell loads and region navigation", () => {
  expect(catalog).toHaveLength(34);
  expect(new Set(catalog.map((e) => e.id)).size).toBe(catalog.length);
  for (const exercise of catalog) {
    expect(exerciseSchema.safeParse(exercise).success).toBe(true);
    expect(subgroups[exercise.group]).toContain(exercise.subgroup);
    if (exercise.equipment === "바벨") expect(exercise.loadMode).toBe("total");
  }
  for (const id of ["squat", "barbell-bench", "barbell-deadlift"])
    expect(catalog.find((e) => e.id === id)?.equipment).toBe("바벨");
  expect(catalog[8]!.id).toBe("squat");
  for (const region of ["전면", "측면", "후면"])
    expect(
      catalog.some((e) => e.group === "어깨" && e.subgroup === region),
    ).toBe(true);
});
it("legacy profiles/exercise snapshots still parse without new optional fields", () => {
  const profile = profileSchema.parse({
    ...profileFixture(),
    ownerId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    revision: 1,
    updatedAt: "2026-10-04T00:00:00.000Z",
  });
  expect(profile.restTimer).toBeUndefined();
  const { subgroup: _, aliases: __, ...old } = catalog[5]!;
  expect(exerciseSchema.parse(old)).toEqual(old);
});
