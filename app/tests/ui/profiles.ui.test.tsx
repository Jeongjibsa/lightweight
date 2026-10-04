import { MantineProvider } from "@mantine/core";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "../../src/App";
import { TrainingContext } from "../../src/context/training";
import { TrainingDatabase, TrainingStore } from "../../src/data/local/store";
import { theme } from "../../src/theme";
import {
  owner,
  otherOwner,
  profileFixture,
  setFixture,
} from "../fixtures/training";

// Auth is outside this local profile contract. No cloud calls or real credentials.
vi.mock("../../src/data/cloud/client", () => ({
  supabase: null,
  configurationError: "",
}));
let db: TrainingDatabase;
let store: TrainingStore;
beforeEach(async () => {
  db = new TrainingDatabase(`profiles-ui-${crypto.randomUUID()}`);
  store = new TrainingStore(db);
  localStorage.setItem("lightweight.active-profile.v1", owner);
  window.history.replaceState(null, "", "/#settings");
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  await store.ensureProfile(owner);
  await store.ensureProfile(otherOwner);
  await store.saveProfile(owner, profileFixture({ name: "가짜 프로필 A" }));
  await store.saveProfile(
    otherOwner,
    profileFixture({
      ownerId: otherOwner,
      name: "가짜 프로필 B",
      unit: "lb",
      preferences: {
        ...profileFixture().preferences!,
        goal: "strength",
        split: "two_way",
      },
    }),
  );
  for (const [id, name] of [
    [owner, "A만의 가짜 루틴"],
    [otherOwner, "B만의 가짜 루틴"],
  ]) {
    await store.saveRoutine(id!, {
      name: name!,
      exercises: [{ exercise: setFixture().exercise, sets: 3 }],
    });
  }
});
afterEach(async () => {
  vi.restoreAllMocks();
  localStorage.clear();
  await db.delete();
});
function mount() {
  return render(
    <MantineProvider env="test" theme={theme} forceColorScheme="dark">
      <TrainingContext.Provider value={{ db, store, accountId: null }}>
        <App />
      </TrainingContext.Provider>
    </MantineProvider>,
  );
}
const nameInput = () =>
  screen.getByRole("textbox", { name: "프로필 이름" }) as HTMLInputElement;
async function switchTo(name: string) {
  await userEvent
    .setup()
    .click(screen.getByRole("combobox", { name: "현재 프로필" }));
  await userEvent
    .setup()
    .click(screen.getByRole("option", { name, exact: true }));
}

it("App의 A→B 로딩 중 이전 입력을 숨기고 B 설정/루틴만 표시하며 A로 돌아와도 원본을 보존한다", async () => {
  const beforeA = await store.backup(owner);
  const beforeB = await store.backup(otherOwner);
  const ensure = store.ensureProfile.bind(store);
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  vi.spyOn(store, "ensureProfile").mockImplementation(async (id) => {
    if (id === otherOwner) await gate;
    return ensure(id);
  });
  mount();
  await waitFor(() => expect(nameInput().value).toBe("가짜 프로필 A"));
  await switchTo("가짜 프로필 B");
  expect(screen.getByText("내 훈련 기록을 불러오는 중…")).toBeTruthy();
  expect(screen.queryByRole("textbox", { name: "프로필 이름" })).toBeNull();
  release();
  await waitFor(() => expect(nameInput().value).toBe("가짜 프로필 B"));
  expect(
    (screen.getByRole("combobox", { name: "분할 방법" }) as HTMLInputElement)
      .value,
  ).toBe("2분할");
  expect(
    (screen.getByRole("combobox", { name: "중량 단위" }) as HTMLInputElement)
      .value,
  ).toBe("lb");
  const user = userEvent.setup();
  const menu = screen.getByRole("navigation", { name: "주 메뉴" });
  await user.click(within(menu).getByRole("link", { name: "나의 루틴" }));
  expect(
    await screen.findByRole("heading", { name: "B만의 가짜 루틴" }),
  ).toBeTruthy();
  expect(screen.queryByRole("heading", { name: "A만의 가짜 루틴" })).toBeNull();
  await user.click(within(menu).getByRole("link", { name: "설정" }));
  await switchTo("가짜 프로필 A");
  await waitFor(() => expect(nameInput().value).toBe("가짜 프로필 A"));
  expect((await store.backup(owner)).profile).toEqual(beforeA.profile);
  expect((await store.backup(owner)).routines).toEqual(beforeA.routines);
  expect((await store.backup(otherOwner)).profile).toEqual(beforeB.profile);
  expect((await store.backup(otherOwner)).routines).toEqual(beforeB.routines);
  expect(localStorage.getItem("lightweight.active-profile.v1")).toBe(owner);
});

it("설정 저장이 끝날 때까지 프로필 전환/생성을 막고 A 설정만 저장한다", async () => {
  mount();
  await waitFor(() => expect(nameInput().value).toBe("가짜 프로필 A"));
  const save = store.saveProfile.bind(store);
  const beforeB = await db.profiles.get(otherOwner);
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  vi.spyOn(store, "saveProfile").mockImplementation(async (id, profile) => {
    await gate;
    return save(id, profile);
  });
  const user = userEvent.setup();
  await user.clear(nameInput());
  await user.type(nameInput(), "가짜 A 저장 완료");
  await user.click(screen.getByRole("button", { name: "훈련 설정 저장" }));
  try {
    expect(
      (
        screen.getByRole("combobox", {
          name: "현재 프로필",
        }) as HTMLInputElement
      ).disabled,
    ).toBe(true);
    expect(
      (
        screen.getByRole("button", {
          name: "새 프로필 만들기",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  } finally {
    release();
  }
  await waitFor(() =>
    expect(
      (
        screen.getByRole("combobox", {
          name: "현재 프로필",
        }) as HTMLInputElement
      ).disabled,
    ).toBe(false),
  );
  await waitFor(async () =>
    expect((await db.profiles.get(owner))!.name).toBe("가짜 A 저장 완료"),
  );
  expect(await db.profiles.get(otherOwner)).toEqual(beforeB);
  await switchTo("가짜 프로필 B");
  await waitFor(() => expect(nameInput().value).toBe("가짜 프로필 B"));
});

it("B 초기화가 먼저 끝나도 B workspace 조회가 끝나기 전 A 입력을 다시 표시하지 않는다", async () => {
  const query = store.workspace.bind(store);
  const ensure = store.ensureProfile.bind(store);
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const initialized = vi.fn();
  vi.spyOn(store, "workspace").mockImplementation(async (id) => {
    if (id === otherOwner) await gate;
    return query(id);
  });
  vi.spyOn(store, "ensureProfile").mockImplementation(async (id) => {
    const profile = await ensure(id);
    initialized(id);
    return profile;
  });
  mount();
  await waitFor(() => expect(nameInput().value).toBe("가짜 프로필 A"));
  await switchTo("가짜 프로필 B");
  try {
    await waitFor(() => expect(initialized).toHaveBeenCalledWith(otherOwner));
    expect(screen.queryByRole("textbox", { name: "프로필 이름" })).toBeNull();
    expect(screen.getByText("내 훈련 기록을 불러오는 중…")).toBeTruthy();
  } finally {
    release();
  }
  await waitFor(() => expect(nameInput().value).toBe("가짜 프로필 B"));
});
