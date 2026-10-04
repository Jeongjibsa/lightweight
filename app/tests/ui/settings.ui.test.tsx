import { useState } from "react";
import { errorMessage } from "../../src/domain/errors";
import { useLiveQuery } from "dexie-react-hooks";
import { MantineProvider } from "@mantine/core";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { SettingsView } from "../../src/components/settings";
import { TrainingContext } from "../../src/context/training";
import { TrainingDatabase, TrainingStore } from "../../src/data/local/store";
import { owner, profileFixture } from "../fixtures/training";
import { largeBackupFixture } from "../fixtures/large-backup";

let db: TrainingDatabase;
let store: TrainingStore;
beforeEach(async () => {
  db = new TrainingDatabase(`settings-ui-${crypto.randomUUID()}`);
  store = new TrainingStore(db);
  await store.ensureProfile(owner);
  await store.saveProfile(owner, profileFixture());
});
afterEach(async () => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  await db.delete();
});
function Harness() {
  const [failure, setFailure] = useState("");
  const workspace = useLiveQuery(() => store.workspace(owner), []);
  return (
    <MantineProvider env="test">
      {failure && <div role="alert">{failure}</div>}
      <TrainingContext.Provider value={{ db, store, accountId: null }}>
        {workspace?.profile && (
          <SettingsView
            profile={workspace.profile}
            profiles={[workspace.profile]}
            run={async (action) => {
              try {
                await action();
                return true;
              } catch (error) {
                setFailure(errorMessage(error));
                return false;
              }
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

it("큰 기록의 실제 내보내기 파일을 자체 parser로 다시 읽고 ID·세트를 보존한다", async () => {
  const fixture = largeBackupFixture(owner);
  await db.sessions.bulkPut(fixture.sessions);
  let download: Blob | undefined;
  vi.stubGlobal("URL", {
    createObjectURL: (blob: Blob) => {
      download = blob;
      return "blob:synthetic-backup";
    },
    revokeObjectURL: vi.fn(),
  });
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  render(<Harness />);
  await screen.findByLabelText("프로필 이름");
  await userEvent
    .setup()
    .click(
      screen.getByRole("button", { name: "현재 프로필 백업", exact: true }),
    );
  await waitFor(() => expect(download).toBeDefined());
  const text = await new File([download!], "synthetic-large.json").text();
  // This is the application's actual download Blob, not a copied serializer.
  expect(() => store.parseBackup(text)).not.toThrow();
  const parsed = store.parseBackup(text);
  expect(parsed.sessions).toHaveLength(36);
  const sorted = (sessions: typeof fixture.sessions) =>
    sessions.toSorted((a, b) => a.id.localeCompare(b.id));
  expect(sorted(parsed.sessions)).toEqual(sorted(fixture.sessions));
}, 15000);

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
  expect(
    (screen.getByRole("combobox", { name: "분할 방법" }) as HTMLInputElement)
      .value,
  ).toBe("2분할");
  expect(
    (screen.getByRole("combobox", { name: "중량 단위" }) as HTMLInputElement)
      .value,
  ).toBe("lb");
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

it("파일 읽기가 일시적으로 실패해도 같은 백업 파일을 다시 선택해 복원할 수 있다", async () => {
  const user = userEvent.setup();
  render(<Harness />);
  await screen.findByLabelText("프로필 이름");
  const before = await db.profiles.get(owner);
  const backup = await store.backup(owner);
  backup.profile.name = "같은 파일 재시도 가짜 설정";
  const file = new File([JSON.stringify(backup)], "retry-synthetic.json", {
    type: "application/json",
  });
  const read = vi
    .spyOn(file, "text")
    .mockRejectedValueOnce(new Error("일시적인 파일 읽기 실패"));
  const input = screen.getByLabelText("백업 파일 선택");
  await user.upload(input, file);
  expect(
    await screen.findByText(
      "백업 파일을 읽지 못했습니다. 파일 형식을 확인한 뒤 다시 선택해주세요.",
    ),
  ).toBeTruthy();
  expect(await db.profiles.get(owner)).toEqual(before);
  await user.upload(input, file);
  await user.click(
    await screen.findByRole("button", { name: "현재 프로필에 복원" }),
  );
  await waitFor(() =>
    expect(profileName().value).toBe("같은 파일 재시도 가짜 설정"),
  );
  expect(read).toHaveBeenCalledTimes(2);
  expect((await db.profiles.get(owner))!.name).toBe(
    "같은 파일 재시도 가짜 설정",
  );
});

it("압축을 지원하지 않는 환경의 큰 export는 다운로드 전에 안내하며 DB 기록을 변경하지 않는다", async () => {
  const fixture = largeBackupFixture(owner, 60);
  await db.sessions.bulkPut(fixture.sessions);
  const before = await store.backup(owner);
  const createObjectURL = vi.fn();
  vi.stubGlobal("URL", { createObjectURL, revokeObjectURL: vi.fn() });
  vi.stubGlobal("CompressionStream", undefined);
  render(<Harness />);
  await screen.findByLabelText("프로필 이름");
  await userEvent
    .setup()
    .click(
      screen.getByRole("button", { name: "현재 프로필 백업", exact: true }),
    );
  expect(
    (await screen.findByText(/이 브라우저는 큰 기록의 압축 백업/)).textContent,
  ).toContain("기존 기록은 유지됩니다");
  expect(createObjectURL).not.toHaveBeenCalled();
  const after = await store.backup(owner);
  expect(after.profile).toEqual(before.profile);
  expect(after.sessions).toEqual(before.sessions);
}, 15000);
