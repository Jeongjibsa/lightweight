import { useState } from "react";
import { MantineProvider } from "@mantine/core";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLiveQuery } from "dexie-react-hooks";
import { afterEach, expect, it, vi } from "vitest";
import { TrainingDatabase, TrainingStore } from "../../src/data/local/store";
import { TrainingContext } from "../../src/context/training";
import { WorkoutView } from "../../src/components/workout";
import { DeletedSessionRecords } from "../../src/components/deleted-session-records";
import { catalog } from "../../src/content/catalog";
import { summarize } from "../../src/domain/models";
import { theme } from "../../src/theme";
import type { Run } from "../../src/components/shared";

let db: TrainingDatabase | undefined;
afterEach(async () => {
  vi.restoreAllMocks();
  await db?.delete();
});
it("종료 기록 삭제/복구의 취소·실패·재시도에서 값과 집계를 보존한다", async () => {
  const database = new TrainingDatabase(
    `ended-recovery-ui-${crypto.randomUUID()}`,
  );
  db = database;
  const store = new TrainingStore(database);
  const ownerId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  await store.ensureProfile(ownerId);
  let session = await store.startSession(ownerId);
  session = await store.addExercise(ownerId, session.id, catalog[8]!);
  session = await store.updateSet(
    ownerId,
    session.id,
    session.sets[0]!.id,
    { load: 0, reps: 8 },
    true,
  );
  const original = await store.endSession(ownerId, session.id);
  function Harness() {
    const current = useLiveQuery(() => store.workspace(ownerId), []);
    const [showRecord, setShowRecord] = useState(true);
    const [error, setError] = useState("");
    const run: Run = async (action) => {
      try {
        await action();
        setError("");
        return true;
      } catch {
        setError("저장 오류: 다시 시도해주세요.");
        return false;
      }
    };
    return (
      <MantineProvider env="test" theme={theme} forceColorScheme="dark">
        <TrainingContext.Provider
          value={{ db: database, store, accountId: null }}
        >
          {error && <p role="alert">{error}</p>}
          {current && (
            <>
              <p>완료 본세트 {summarize(current.sessions).workingRows}개</p>
              {showRecord && current.sessions[0] ? (
                <WorkoutView
                  session={current.sessions[0]}
                  run={run}
                  onBack={() => setShowRecord(false)}
                />
              ) : (
                <DeletedSessionRecords ownerId={ownerId} run={run} />
              )}
            </>
          )}
        </TrainingContext.Provider>
      </MantineProvider>
    );
  }
  render(<Harness />);
  const user = userEvent.setup();
  await screen.findByText("완료 본세트 1개");
  await user.click(
    await screen.findByRole("button", { name: "종료 기록 삭제", exact: true }),
  );
  await user.click(
    within(screen.getByRole("dialog")).getByRole("button", {
      name: "취소",
      exact: true,
    }),
  );
  expect(await database.sessions.get(original.id)).toEqual(original);
  await user.click(
    screen.getByRole("button", { name: "종료 기록 삭제", exact: true }),
  );
  vi.spyOn(database.outbox, "add").mockRejectedValueOnce(
    new Error("synthetic deletion failure"),
  );
  await user.click(
    screen.getByRole("button", { name: "기록 삭제", exact: true }),
  );
  await screen.findByRole("alert");
  expect(await database.sessions.get(original.id)).toEqual(original);
  expect(screen.queryByRole("dialog")).not.toBeNull();
  await user.click(
    screen.getByRole("button", { name: "기록 삭제", exact: true }),
  );
  await screen.findByText("완료 본세트 0개");
  await user.click(
    await screen.findByRole("button", {
      name: "삭제한 종료 기록 1개",
      exact: true,
    }),
  );
  const deleted = (await database.sessions.get(original.id))!;
  const recover = () =>
    screen.findByRole("button", {
      name: `${original.localDate} ${original.name} 복구`,
      exact: true,
    });
  await user.click(await recover());
  await user.click(
    within(screen.getByRole("dialog")).getByRole("button", {
      name: "취소",
      exact: true,
    }),
  );
  expect(await database.sessions.get(original.id)).toEqual(deleted);
  await user.click(await recover());
  vi.spyOn(database.outbox, "add").mockRejectedValueOnce(
    new Error("synthetic recovery failure"),
  );
  await user.click(
    screen.getByRole("button", { name: "기록 복구", exact: true }),
  );
  await screen.findByRole("alert");
  expect(await database.sessions.get(original.id)).toEqual(deleted);
  expect(screen.queryByRole("dialog")).not.toBeNull();
  await user.click(
    screen.getByRole("button", { name: "기록 복구", exact: true }),
  );
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  await screen.findByText("완료 본세트 1개");
  const restored = (await database.sessions.get(original.id))!;
  expect({
    ...restored,
    revision: original.revision,
    updatedAt: original.updatedAt,
  }).toEqual(original);
});
