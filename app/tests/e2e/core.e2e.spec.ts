import { test, expect } from "./fixture";
import { fixedTime, origin } from "./environment";
import {
  choose,
  completeSet,
  configure,
  createRoutine,
  downloadBackup,
  endWorkout,
  navigate,
  normalizeBackup,
  startRoutine,
} from "./helpers";

test("E2E-01 빈 프로필→설정/루틴→결측 거부/0kg 즉시 완료→reload/리포트", async ({
  page,
}) => {
  await page.goto("/");
  await configure(page);
  await createRoutine(page);
  await startRoutine(page);
  await page
    .getByRole("spinbutton", { name: "바벨 스쿼트 1세트 횟수", exact: true })
    .fill("10");
  await page
    .getByRole("button", { name: "바벨 스쿼트 1세트 완료", exact: true })
    .click();
  await expect(
    page.getByText("완료하려면 중량을 입력해주세요. 0도 입력할 수 있습니다.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "바벨 스쿼트 1세트 완료", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await completeSet(page, 1, "0", "10");
  await page.reload();
  await page
    .getByRole("button", { name: "진행 중인 운동 이어하기", exact: true })
    .click();
  await expect(
    page.getByRole("spinbutton", {
      name: "바벨 스쿼트 1세트 중량",
      exact: true,
    }),
  ).toHaveValue("0");
  await expect(
    page.getByRole("spinbutton", {
      name: "바벨 스쿼트 1세트 횟수",
      exact: true,
    }),
  ).toHaveValue("10");
  await endWorkout(page);
  const { data } = await downloadBackup(page);
  expect(data.routines).toHaveLength(1);
  expect(data.sessions).toHaveLength(1);
  expect(data.sessions[0]!.status).toBe("complete");
  expect(data.sessions[0]!.sets).toHaveLength(1);
  expect(data.sessions[0]!.sets[0]).toMatchObject({
    load: 0,
    reps: 10,
    unit: "kg",
    kind: "working",
    side: "both",
  });
  expect(data.sessions[0]!.sets[0]!.completedAt).toBe(fixedTime);
  await navigate(page, "리포트");
  await expect(
    page.getByRole("heading", { name: "볼륨과 기록 추이", exact: true }),
  ).toBeVisible();
});

test("E2E-03 다운로드 백업→잘못된 파일 거부→빈 context 복원→IDs/삭제/기록 보존", async ({
  page,
  browser,
  diagnostics,
}) => {
  await page.goto("/");
  await configure(page);
  await createRoutine(page);
  await startRoutine(page);
  await completeSet(page);
  await endWorkout(page);
  await navigate(page, "나의 루틴");
  await page.getByRole("button", { name: "복사", exact: true }).click();
  const copied = page
    .getByRole("heading", { name: "가짜 E2E 전신 A 복사", exact: true })
    .locator("..");
  await copied.getByRole("button", { name: "삭제", exact: true }).click();
  await page
    .getByRole("dialog", { name: "루틴 삭제", exact: true })
    .getByRole("button", { name: "루틴 삭제", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeHidden();
  const source = await downloadBackup(page);
  expect(source.data.routines).toHaveLength(2);
  expect(source.data.routines.filter((r) => r.deletedAt)).toHaveLength(1);
  const context = await browser.newContext({
    baseURL: origin,
    viewport: { width: 390, height: 844 },
    locale: "ko-KR",
    timezoneId: "Asia/Seoul",
    serviceWorkers: "block",
  });
  try {
    const restored = await context.newPage();
    diagnostics(restored);
    await restored.clock.setFixedTime(new Date(fixedTime));
    await restored.goto("/#settings");
    await expect(
      restored.getByRole("textbox", { name: "프로필 이름", exact: true }),
    ).toHaveValue("나의 훈련");
    const before = (await downloadBackup(restored)).data;
    expect(before.routines).toHaveLength(0);
    expect(before.sessions).toHaveLength(0);
    await restored.getByLabel("백업 파일 선택", { exact: true }).setInputFiles({
      name: "invalid-synthetic.json",
      mimeType: "application/json",
      buffer: Buffer.from("{"),
    });
    await expect(
      restored.getByText(
        "백업 파일을 읽지 못했습니다. 파일 형식을 확인한 뒤 다시 선택해주세요.",
        { exact: true },
      ),
    ).toBeVisible();
    expect(normalizeBackup((await downloadBackup(restored)).data)).toEqual(
      normalizeBackup(before),
    );
    await restored
      .getByLabel("백업 파일 선택", { exact: true })
      .setInputFiles(source.path);
    await restored
      .getByRole("dialog", { name: "백업을 복원할까요?", exact: true })
      .getByRole("button", { name: "현재 프로필에 복원", exact: true })
      .click();
    await expect(restored.getByRole("dialog")).toBeHidden();
    await expect(
      restored.getByRole("textbox", { name: "프로필 이름", exact: true }),
    ).toHaveValue("가짜 E2E 프로필 A");
    const result = (await downloadBackup(restored)).data;
    expect(result.profile.ownerId).not.toBe(source.data.profile.ownerId);
    expect(result.profile.revision).toBe(source.data.profile.revision + 1);
    expect(normalizeBackup(result)).toEqual(normalizeBackup(source.data));
    await restored.reload();
    expect(normalizeBackup((await downloadBackup(restored)).data)).toEqual(
      normalizeBackup(source.data),
    );
  } finally {
    await context.close();
  }
});

test("E2E-04 로컬 A→B 설정/루틴 분리→A 복귀/reload 원본 보존", async ({
  page,
}) => {
  await page.goto("/");
  await configure(page);
  await createRoutine(page);
  const original = (await downloadBackup(page)).data;
  await page
    .getByRole("button", { name: "새 프로필 만들기", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "프로필 이름", exact: true }),
  ).toHaveValue("나의 훈련");
  await configure(page, "가짜 E2E 프로필 B", "lb", "2분할");
  await navigate(page, "나의 루틴");
  await expect(
    page.getByRole("heading", { name: "가짜 E2E 전신 A", exact: true }),
  ).toBeHidden();
  await createRoutine(page, "가짜 E2E 루틴 B");
  const b = (await downloadBackup(page)).data;
  expect(b.profile.ownerId).not.toBe(original.profile.ownerId);
  expect(b.profile.unit).toBe("lb");
  expect(b.profile.preferences!.split).toBe("two_way");
  expect(b.routines.map((r) => r.name)).toEqual(["가짜 E2E 루틴 B"]);
  await choose(page, "현재 프로필", "가짜 E2E 프로필 A");
  await expect(
    page.getByRole("textbox", { name: "프로필 이름", exact: true }),
  ).toHaveValue("가짜 E2E 프로필 A");
  await page.reload();
  expect((await downloadBackup(page)).data).toEqual(original);
});

test("E2E-06 부분:5화면×4폭 overflow/키보드 선택·Escape opener 복귀", async ({
  page,
}, info) => {
  await page.goto("/");
  await navigate(page, "운동 탐색");
  const opener = page.getByRole("button", {
    name: "바벨 스쿼트 정보",
    exact: true,
  });
  await opener.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "바벨 스쿼트", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(opener).toBeFocused();
  const layouts = [];
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    for (const name of ["오늘", "운동 탐색", "나의 루틴", "리포트", "설정"]) {
      await navigate(page, name);
      const size = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(size.client).toBe(width);
      expect(size.scroll).toBe(size.client);
      layouts.push({ name, width, ...size });
    }
  }
  await info.attach("responsive.json", {
    body: Buffer.from(JSON.stringify(layouts, null, 2)),
    contentType: "application/json",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: info.outputPath("settings-390.png") });
});

test("종료 기록 수정→볼륨 재계산→다시 시작·이전값·종목 교체에서 과거 기록을 보존한다", async ({
  page,
}, info) => {
  await page.goto("/");
  await configure(page);
  await createRoutine(page, "가짜 재사용 루틴");
  await startRoutine(page);
  await completeSet(page, 1, "20", "8");
  await endWorkout(page);
  await page
    .getByRole("button", { name: /가짜 재사용 루틴.*1\/1세트/ })
    .click();
  await page
    .getByRole("button", { name: "바벨 스쿼트 1세트 기록 수정", exact: true })
    .click();
  const correction = page.getByRole("dialog", {
    name: "세트 기록 수정",
    exact: true,
  });
  await correction
    .getByRole("spinbutton", { name: "수정할 중량 · kg", exact: true })
    .fill("40");
  await correction
    .getByRole("spinbutton", { name: "수정할 횟수", exact: true })
    .fill("6");
  await correction
    .getByRole("button", { name: "수정 기록 저장", exact: true })
    .click();
  await expect(correction).toBeHidden();
  await info.attach("ended-correction.png", {
    body: await page.screenshot(),
    contentType: "image/png",
  });
  const before = (await downloadBackup(page)).data;
  expect(before.sessions[0]!.sets[0]).toMatchObject({ load: 40, reps: 6 });
  await navigate(page, "리포트");
  await expect(
    page.getByRole("cell", { name: "240 kg·회", exact: true }),
  ).toBeVisible();
  await navigate(page, "오늘");
  await page
    .getByRole("button", { name: /가짜 재사용 루틴.*1\/1세트/ })
    .click();
  await page
    .getByRole("button", { name: "이 운동 다시 시작", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "운동 마치기", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("spinbutton", {
      name: "바벨 스쿼트 1세트 중량",
      exact: true,
    }),
  ).toHaveValue("40");
  await expect(
    page.getByRole("spinbutton", {
      name: "바벨 스쿼트 1세트 횟수",
      exact: true,
    }),
  ).toHaveValue("6");
  await expect(
    page.getByRole("button", { name: "바벨 스쿼트 1세트 완료", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  const during = (await downloadBackup(page)).data;
  expect(during.sessions.find((s) => s.id === before.sessions[0]!.id)).toEqual(
    before.sessions[0],
  );
  const active = during.sessions.find((s) => s.status === "active")!;
  expect(active.id).not.toBe(before.sessions[0]!.id);
  expect(active.sets[0]!.rir).toBeNull();
  await navigate(page, "오늘");
  await page
    .getByRole("button", { name: "진행 중인 운동 이어하기", exact: true })
    .click();
  const load = page.getByRole("spinbutton", {
    name: "바벨 스쿼트 1세트 중량",
    exact: true,
  });
  await load.fill("");
  await page.getByRole("heading", { name: "바벨 스쿼트", exact: true }).click();
  await page
    .getByRole("button", { name: "이전 값 불러오기", exact: true })
    .click();
  await expect(load).toHaveValue("40");
  await page
    .getByRole("button", { name: "다른 운동으로 교체", exact: true })
    .click();
  const replacement = page.getByRole("dialog", {
    name: "다른 운동으로 교체",
    exact: true,
  });
  await replacement
    .getByRole("button", { name: "케이블 로우 추가", exact: true })
    .click();
  await expect(replacement).toBeHidden();
  await expect(
    page.getByRole("spinbutton", {
      name: "케이블 로우 1세트 중량",
      exact: true,
    }),
  ).toHaveValue("");
  const after = (await downloadBackup(page)).data;
  expect(after.sessions.find((s) => s.id === before.sessions[0]!.id)).toEqual(
    before.sessions[0],
  );
  expect(after.sessions.find((s) => s.id === active.id)!.sets[0]).toMatchObject(
    {
      exercise: { name: "케이블 로우" },
      load: null,
      reps: null,
      completedAt: null,
    },
  );
  await page.reload();
  expect((await downloadBackup(page)).data.sessions).toEqual(after.sessions);
});
