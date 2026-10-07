import { expect, it } from "vitest";
import { catalog } from "../../src/content/catalog";
import { totalSets } from "../../src/domain/volume";
import { setFixture } from "../fixtures/training";

it("new exercises keep independent machine, per-hand and added-bodyweight recording conventions", () => {
  const smith = setFixture({
    exercise: catalog.find((e) => e.id === "smith-squat")!,
    load: 70,
  });
  const incline = setFixture({
    exercise: catalog.find((e) => e.id === "dumbbell-incline-bench")!,
    load: 25,
  });
  const dips = [null, 10].map((load) =>
    setFixture({ exercise: catalog.find((e) => e.id === "dips")!, load }),
  );
  expect(totalSets([smith]).volume).toBe(700);
  expect(totalSets([incline]).volume).toBe(250);
  expect(totalSets(dips)).toMatchObject({
    workingRows: 2,
    reps: 20,
    volume: null,
    volumeRows: 0,
  });
  expect(totalSets([smith, incline, ...dips], true)).toMatchObject({
    workingRows: 4,
    reps: 40,
    volume: null,
  });
});
