import { useLiveQuery } from "dexie-react-hooks";
import { MantineProvider } from "@mantine/core";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it } from "vitest";
import { SettingsView } from "../../src/components/settings";
import { TrainingContext } from "../../src/context/training";
import { TrainingDatabase, TrainingStore } from "../../src/data/local/store";
import { owner, profileFixture } from "../fixtures/training";

let db: TrainingDatabase;
let store: TrainingStore;
beforeEach(async () => {
  db = new TrainingDatabase(`settings-ui-${crypto.randomUUID()}`);
  store = new TrainingStore(db);
  await store.ensureProfile(owner);
  await store.saveProfile(owner, profileFixture());
});
afterEach(async () => {
  await db.delete();
});
function Harness() {
  const workspace = useLiveQuery(() => store.workspace(owner), []);
  return (
    <MantineProvider env="test">
      <TrainingContext.Provider value={{ db, store, accountId: null }}>
        {workspace?.profile && (
          <SettingsView
            profile={workspace.profile}
            profiles={[workspace.profile]}
            run={async (action) => {
              await action();
              return true;
            }}
            switchProfile={() => {}}
            createProfile={async () => {}}
          />
        )}
      </TrainingContext.Provider>
    </MantineProvider>
  );
}
const profileName = () =>
  screen.getByLabelText("프로필 이름") as HTMLInputElement;

it("같은 owner/revision의 백업도 복원 즉시 입력값을 바꾸며 다시 저장해도 이전 설정으로 덮어쓰지 않는다", async () => {
  const user = userEvent.setup();
  render(<Harness />);
  await screen.findByLabelText("프로필 이름");
  await user.clear(profileName());
  await user.type(profileName(), "저장하지 않은 이전 초안");
  const restored = profileFixture({
    name: "복원된 가짜 설정",
    unit: "lb",
    timeZone: "UTC",
    preferences: {
      ...profileFixture().preferences!,
      goal: "strength",
      split: "two_way",
      weeklyMin: 2,
      weeklyMax: 3,
      minutes: 45,
      equipment: ["덤벨"],
    },
  });
  const backup = {
    format: "lightweight-backup",
    version: 1,
    exportedAt: "2026-10-04T03:00:00Z",
    profile: restored,
    routines: [],
    sessions: [],
  };
  const revisionBefore = (await db.profiles.get(owner))!.revision;
  await user.upload(
    screen.getByLabelText("백업 파일 선택"),
    new File([JSON.stringify(backup)], "synthetic-backup.json", {
      type: "application/json",
    }),
  );
  await user.click(
    await screen.findByRole("button", { name: "현재 프로필에 복원" }),
  );
  await waitFor(async () =>
    expect((await db.profiles.get(owner))!.name).toBe("복원된 가짜 설정"),
  );
  expect((await db.profiles.get(owner))!.revision).toBe(revisionBefore);
  await waitFor(() => expect(profileName().value).toBe("복원된 가짜 설정"));
  expect(
    (screen.getByRole("radio", { name: "근력 향상" }) as HTMLInputElement)
      .checked,
  ).toBe(true);
  expect((screen.getByLabelText("분할 방법") as HTMLSelectElement).value).toBe(
    "two_way",
  );
  expect((screen.getByLabelText("중량 단위") as HTMLSelectElement).value).toBe(
    "lb",
  );
  await user.click(screen.getByRole("button", { name: "훈련 설정 저장" }));
  await waitFor(async () =>
    expect((await db.profiles.get(owner))!.revision).toBeGreaterThan(
      revisionBefore,
    ),
  );
  expect((await db.profiles.get(owner))!).toMatchObject({
    name: restored.name,
    unit: restored.unit,
    timeZone: restored.timeZone,
    preferences: restored.preferences,
  });
});
it("기록 갱신으로 다시 렌더링해도 저장하지 않은 프로필 입력은 유지한다", async () => {
  const user = userEvent.setup();
  render(<Harness />);
  await screen.findByLabelText("프로필 이름");
  await user.clear(profileName());
  await user.type(profileName(), "아직 저장하지 않은 이름");
  await store.startSession(owner);
  await waitFor(async () => expect(await db.sessions.count()).toBe(1));
  expect(profileName().value).toBe("아직 저장하지 않은 이름");
});
