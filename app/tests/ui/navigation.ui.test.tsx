import { useState } from "react";
import { MantineProvider } from "@mantine/core";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { BottomNavigation } from "../../src/components/navigation";
import type { Screen } from "../../src/components/screens";
import type { Exercise } from "../../src/domain/models";
import { LibraryView, RoutinesView } from "../../src/components/exercises";
import { TrainingContext } from "../../src/context/training";
import { TrainingDatabase, TrainingStore } from "../../src/data/local/store";
import { owner, profileFixture } from "../fixtures/training";
import { theme } from "../../src/theme";

let db: TrainingDatabase | undefined;
afterEach(async () => {
  vi.restoreAllMocks();
  if (db) await db.delete();
  db = undefined;
});

it("주 메뉴는 중복 없이 다섯 화면을 제공하며 키보드로 이동하면 현재 위치를 갱신한다", async () => {
  function Harness() {
    const [current, setCurrent] = useState<Screen>("today");
    return (
      <MantineProvider env="test" theme={theme} forceColorScheme="dark">
        <BottomNavigation screen={current} navigate={setCurrent} />
      </MantineProvider>
    );
  }
  render(<Harness />);
  const menu = screen.getByRole("navigation", { name: "주 메뉴" });
  expect(within(menu).getAllByRole("link")).toHaveLength(5);
  const library = within(menu).getByRole("link", { name: "운동 탐색" });
  library.focus();
  await userEvent.setup().keyboard("{Enter}");
  expect(library.getAttribute("aria-current")).toBe("page");
  expect(
    within(menu)
      .getAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") === "page"),
  ).toHaveLength(1);
  expect(library.getAttribute("href")).toBe("#library");
});

it("검색한 운동은 키보드로 한 번 선택해 추가하며 정보 확인은 별도 동작으로 제공한다", async () => {
  const add = vi.fn(async (_exercise: Exercise) => {});
  render(
    <MantineProvider env="test" theme={theme} forceColorScheme="dark">
      <LibraryView onAdd={add} />
    </MantineProvider>,
  );
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("운동 검색"), "스쿼트");
  const row = screen.getByRole("button", { name: "바벨 스쿼트 추가" });
  row.focus();
  await user.keyboard("{Enter}");
  expect(add).toHaveBeenCalledTimes(1);
  expect(add.mock.calls[0]![0]).toMatchObject({ name: "바벨 스쿼트" });
  expect(screen.queryByRole("dialog")).toBeNull();
  const info = screen.getByRole("button", { name: "바벨 스쿼트 정보" });
  await user.click(info);
  await screen.findByRole("dialog", { name: "바벨 스쿼트" });
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(document.activeElement).toBe(info);
  expect(add).toHaveBeenCalledTimes(1);
});

it("새 루틴의 운동 선택을 바로 열고 연속 선택한 두 종목과 계획 세트를 저장한다", async () => {
  db = new TrainingDatabase(`navigation-ui-${crypto.randomUUID()}`);
  const store = new TrainingStore(db);
  await store.ensureProfile(owner);
  await store.saveProfile(owner, profileFixture());
  const profile = (await db.profiles.get(owner))!;
  render(
    <MantineProvider env="test" theme={theme} forceColorScheme="dark">
      <TrainingContext.Provider value={{ db, store, accountId: null }}>
        <RoutinesView
          profile={profile}
          routines={[]}
          run={async (action) => {
            await action();
            return true;
          }}
          start={vi.fn()}
        />
      </TrainingContext.Provider>
    </MantineProvider>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "루틴 만들기" }));
  const editor = screen.getByRole("dialog", { name: "나의 루틴 만들기" });
  await user.type(
    within(editor).getByRole("textbox", { name: /루틴 이름/ }),
    "가짜 연속 선택",
  );
  await user.click(
    within(editor).getByRole("button", { name: "바벨 스쿼트 추가" }),
  );
  await user.click(
    within(editor).getByRole("button", { name: "랫풀다운 추가" }),
  );
  await user.click(within(editor).getByRole("button", { name: "루틴 저장" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  const saved = await db.routines.toArray();
  expect(saved).toHaveLength(1);
  expect(
    saved[0]!.exercises.map((entry) => [entry.exercise.name, entry.sets]),
  ).toEqual([
    ["바벨 스쿼트", 3],
    ["랫풀다운", 3],
  ]);
});
