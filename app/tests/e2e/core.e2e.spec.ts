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

test("운동 순서 변경의 취소/저장→reload/빈 저장소 복원에서 완료 세트와 루틴을 보존한다", async ({
  page,
  browser,
  diagnostics,
}, info) => {
  await page.goto("/");
  await configure(page);
  await createRoutine(page, "가짜 순서 루틴");
  await startRoutine(page);
  await completeSet(page, 1, "40", "6");
  await page.getByRole("button", { name: "운동 추가", exact: true }).click();
  await page
    .getByRole("dialog", { name: "운동 추가", exact: true })
    .getByRole("button", { name: "케이블 로우 추가", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeHidden();
  const original = (await downloadBackup(page)).data;
  await navigate(page, "오늘");
  await page
    .getByRole("button", { name: "진행 중인 운동 이어하기", exact: true })
    .click();
  await page
    .getByRole("button", { name: "운동 순서 변경", exact: true })
    .click();
  let dialog = page.getByRole("dialog", {
    name: "운동 순서 변경",
    exact: true,
  });
  await dialog
    .getByRole("button", { name: "케이블 로우 위로", exact: true })
    .click();
  await expect(dialog.getByRole("listitem")).toHaveText([
    "1. 케이블 로우",
    "2. 바벨 스쿼트",
  ]);
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    expect(
      await dialog
        .getByRole("button", { name: "바벨 스쿼트 위로", exact: true })
        .evaluate((el) => {
          const r = el.getBoundingClientRect();
          const hit = document.elementFromPoint(
            r.x + r.width / 2,
            r.y + r.height / 2,
          );
          return hit === el || (hit !== null && el.contains(hit));
        }),
    ).toBe(true);
    await info.attach(`order-dialog-${width}.png`, {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  }
  await dialog.getByRole("button", { name: "취소", exact: true }).click();
  expect((await downloadBackup(page)).data.sessions).toEqual(original.sessions);
  await navigate(page, "오늘");
  await page
    .getByRole("button", { name: "진행 중인 운동 이어하기", exact: true })
    .click();
  await page
    .getByRole("button", { name: "운동 순서 변경", exact: true })
    .click();
  dialog = page.getByRole("dialog", { name: "운동 순서 변경", exact: true });
  await dialog
    .getByRole("button", { name: "케이블 로우 위로", exact: true })
    .click();
  await dialog.getByRole("button", { name: "순서 저장", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { level: 3 })).toHaveText([
    "케이블 로우",
    "바벨 스쿼트",
  ]);
  const changed = await downloadBackup(page);
  expect(changed.data.routines).toEqual(original.routines);
  const prior = original.sessions[0]!;
  const ordered = changed.data.sessions[0]!;
  expect(ordered.sets.at(-1)).toEqual(prior.sets[0]);
  expect(ordered.sets.slice(0, 3)).toEqual(prior.sets.slice(1));
  expect({
    ...ordered,
    sets: prior.sets,
    revision: prior.revision,
    updatedAt: prior.updatedAt,
  }).toEqual(prior);
  await page.reload();
  expect((await downloadBackup(page)).data.sessions).toEqual(
    changed.data.sessions,
  );
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
    await restored.goto("/#settings");
    await restored
      .getByLabel("백업 파일 선택", { exact: true })
      .setInputFiles(changed.path);
    await restored
      .getByRole("dialog", { name: "백업을 복원할까요?", exact: true })
      .getByRole("button", { name: "현재 프로필에 복원", exact: true })
      .click();
    await expect(restored.getByRole("dialog")).toBeHidden();
    expect(normalizeBackup((await downloadBackup(restored)).data)).toEqual(
      normalizeBackup(changed.data),
    );
    await navigate(restored, "오늘");
    await restored
      .getByRole("button", { name: "진행 중인 운동 이어하기", exact: true })
      .click();
    await expect(restored.getByRole("heading", { level: 3 })).toHaveText([
      "케이블 로우",
      "바벨 스쿼트",
    ]);
    await expect(
      restored.getByRole("button", {
        name: "바벨 스쿼트 1세트 완료 취소",
        exact: true,
      }),
    ).toHaveAttribute("aria-pressed", "true");
  } finally {
    await context.close();
  }
});

test("E2E-03 다운로드 백업→잘못된 파일 거부→빈 context 복원→삭제한 루틴 복구/과거 기록 보존", async ({
  page,
  browser,
  diagnostics,
}, info) => {
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
    await navigate(restored, "나의 루틴");
    await restored
      .getByRole("button", { name: "삭제한 루틴 1개", exact: true })
      .click();
    const recoverButton = restored.getByRole("button", {
      name: "가짜 E2E 전신 A 복사 복구",
      exact: true,
    });
    const deletedPanel = restored.getByRole("region", {
      name: "삭제한 루틴 1개",
      exact: true,
    });
    await expect
      .poll(() =>
        deletedPanel.evaluate(
          (panel) =>
            panel.scrollHeight > 0 &&
            panel.getBoundingClientRect().height >= panel.scrollHeight - 1,
        ),
      )
      .toBe(true);
    for (const width of [320, 390]) {
      await restored.setViewportSize({ width, height: 844 });
      await recoverButton.scrollIntoViewIfNeeded();
      expect(
        await restored.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      const hit = await recoverButton.evaluate((button) => {
        const bounds = button.getBoundingClientRect();
        return {
          height: bounds.height,
          unobscured: button.contains(
            document.elementFromPoint(
              bounds.x + bounds.width / 2,
              bounds.y + bounds.height / 2,
            ),
          ),
        };
      });
      expect(hit.height).toBeGreaterThanOrEqual(44);
      expect(hit.unobscured).toBe(true);
      const closeNotice = restored.getByRole("button", {
        name: "알림 닫기",
        exact: true,
      });
      if (await closeNotice.isVisible()) await closeNotice.click();
      await info.attach(`routine-recovery-list-${width}.png`, {
        body: await restored.screenshot(),
        contentType: "image/png",
      });
    }
    await recoverButton.click();
    const recovery = restored.getByRole("dialog", {
      name: "삭제한 루틴 복구",
      exact: true,
    });
    for (const width of [320, 390]) {
      await restored.setViewportSize({ width, height: 844 });
      expect(
        await restored.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      await info.attach(`routine-recovery-${width}.png`, {
        body: await restored.screenshot(),
        contentType: "image/png",
      });
    }
    await recovery.getByRole("button", { name: "취소", exact: true }).click();
    expect(normalizeBackup((await downloadBackup(restored)).data)).toEqual(
      normalizeBackup(source.data),
    );
    await navigate(restored, "나의 루틴");
    await restored
      .getByRole("button", { name: "삭제한 루틴 1개", exact: true })
      .click();
    await restored
      .getByRole("button", { name: "가짜 E2E 전신 A 복사 복구", exact: true })
      .click();
    await restored
      .getByRole("dialog", { name: "삭제한 루틴 복구", exact: true })
      .getByRole("button", { name: "루틴 복구", exact: true })
      .click();
    await expect(restored.getByRole("dialog")).toBeHidden();
    await expect(
      restored.getByRole("heading", {
        name: "가짜 E2E 전신 A 복사",
        exact: true,
      }),
    ).toBeVisible();
    const after = (await downloadBackup(restored)).data;
    const normalizedAfter = normalizeBackup(after);
    const originalDeleted = normalizeBackup(source.data).routines.find(
      (r) => !!r.deletedAt,
    )!;
    const recovered = normalizedAfter.routines.find(
      (r) => r.id === originalDeleted.id,
    )!;
    expect({
      ...recovered,
      revision: originalDeleted.revision,
      updatedAt: originalDeleted.updatedAt,
      deletedAt: originalDeleted.deletedAt,
    }).toEqual(originalDeleted);
    expect(recovered.deletedAt).toBeNull();
    expect(recovered.revision).toBe(originalDeleted.revision + 1);
    expect(normalizedAfter.sessions).toEqual(
      normalizeBackup(source.data).sessions,
    );
    await restored.reload();
    expect(normalizeBackup((await downloadBackup(restored)).data)).toEqual(
      normalizedAfter,
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
    page
      .getByRole("region", { name: "볼륨과 기록 추이", exact: true })
      .getByRole("cell", { name: "240 kg·회", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "이번 주 기록 점검", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "완료 본세트 1행 중 RIR 미입력 1행 · RIR은 선택 입력이에요.",
      { exact: true },
    ),
  ).toBeVisible();
  await page
    .getByRole("heading", { name: "이번 주 기록 점검", exact: true })
    .scrollIntoViewIfNeeded();
  await info.attach("report-coverage.png", {
    body: await page.screenshot(),
    contentType: "image/png",
  });
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
  await load.press("Tab");
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

test("종료 기록 삭제/복구→집계 제외/복귀→reload/새 저장소 백업 보존", async ({
  page,
  browser,
  diagnostics,
}, info) => {
  await page.goto("/");
  await configure(page);
  await createRoutine(page);
  await startRoutine(page);
  await completeSet(page, 1, "20", "8");
  await endWorkout(page);
  const before = (await downloadBackup(page)).data;
  const original = before.sessions[0]!;
  const record = () =>
    page.getByRole("button", { name: /가짜 E2E 전신 A.*1\/1세트.*완료/ });
  await navigate(page, "리포트");
  await expect(
    page
      .getByRole("group", { name: "완료 본세트", exact: true })
      .getByText("1", { exact: true }),
  ).toBeVisible();
  await record().click();
  await page
    .getByRole("button", { name: "종료 기록 삭제", exact: true })
    .click();
  let deletion = page.getByRole("dialog", {
    name: "종료 기록을 삭제할까요?",
    exact: true,
  });
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await info.attach(`ended-record-delete-${width}.png`, {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  }
  await deletion.getByRole("button", { name: "취소", exact: true }).click();
  expect((await downloadBackup(page)).data.sessions).toEqual(before.sessions);
  await navigate(page, "리포트");
  await record().click();
  await page
    .getByRole("button", { name: "종료 기록 삭제", exact: true })
    .click();
  deletion = page.getByRole("dialog", {
    name: "종료 기록을 삭제할까요?",
    exact: true,
  });
  await deletion
    .getByRole("button", { name: "기록 삭제", exact: true })
    .click();
  await expect(deletion).toBeHidden();
  await expect(
    page.getByRole("heading", { name: "아직 기록이 없어요", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("group", { name: "완료 본세트", exact: true })
      .getByText("0", { exact: true }),
  ).toBeVisible();
  const deletedFile = await downloadBackup(page);
  const deleted = deletedFile.data.sessions[0]!;
  expect(deleted.deletedAt).not.toBeNull();
  expect({
    ...deleted,
    revision: original.revision,
    updatedAt: original.updatedAt,
    deletedAt: original.deletedAt,
  }).toEqual(original);
  await page.reload();
  await navigate(page, "리포트");
  await page
    .getByRole("button", { name: "삭제한 종료 기록 1개", exact: true })
    .click();
  const panel = page.getByRole("region", {
    name: "삭제한 종료 기록 1개",
    exact: true,
  });
  await expect
    .poll(() =>
      panel.evaluate(
        (el) =>
          el.scrollHeight > 0 &&
          el.getBoundingClientRect().height >= el.scrollHeight - 1,
      ),
    )
    .toBe(true);
  const recoveryButton = page.getByRole("button", {
    name: `${original.localDate} ${original.name} 복구`,
    exact: true,
  });
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await recoveryButton.scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    expect(
      await recoveryButton.evaluate((button) => {
        const bounds = button.getBoundingClientRect();
        return (
          bounds.height >= 44 &&
          button.contains(
            document.elementFromPoint(
              bounds.x + bounds.width / 2,
              bounds.y + bounds.height / 2,
            ),
          )
        );
      }),
    ).toBe(true);
    const close = page.getByRole("button", { name: "알림 닫기", exact: true });
    if (await close.isVisible()) await close.click();
    await info.attach(`ended-record-list-${width}.png`, {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  }
  await recoveryButton.click();
  let recovery = page.getByRole("dialog", {
    name: "종료 기록 복구",
    exact: true,
  });
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await info.attach(`ended-record-recover-${width}.png`, {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  }
  await recovery.getByRole("button", { name: "취소", exact: true }).click();
  expect((await downloadBackup(page)).data.sessions).toEqual(
    deletedFile.data.sessions,
  );
  await navigate(page, "리포트");
  await page
    .getByRole("button", { name: "삭제한 종료 기록 1개", exact: true })
    .click();
  await recoveryButton.click();
  recovery = page.getByRole("dialog", { name: "종료 기록 복구", exact: true });
  await recovery
    .getByRole("button", { name: "기록 복구", exact: true })
    .click();
  await expect(recovery).toBeHidden();
  await expect(record()).toBeVisible();
  await expect(
    page
      .getByRole("group", { name: "완료 본세트", exact: true })
      .getByText("1", { exact: true }),
  ).toBeVisible();
  const after = await downloadBackup(page);
  const recovered = after.data.sessions[0]!;
  expect({
    ...recovered,
    revision: original.revision,
    updatedAt: original.updatedAt,
  }).toEqual(original);
  expect(recovered.revision).toBe(original.revision + 2);
  expect(after.data.routines).toEqual(before.routines);
  await page.reload();
  expect((await downloadBackup(page)).data.sessions).toEqual(
    after.data.sessions,
  );
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
    await restored.goto("/#settings");
    await restored
      .getByLabel("백업 파일 선택", { exact: true })
      .setInputFiles(after.path);
    await restored
      .getByRole("dialog", { name: "백업을 복원할까요?", exact: true })
      .getByRole("button", { name: "현재 프로필에 복원", exact: true })
      .click();
    await expect(restored.getByRole("dialog")).toBeHidden();
    expect(normalizeBackup((await downloadBackup(restored)).data)).toEqual(
      normalizeBackup(after.data),
    );
    await navigate(restored, "리포트");
    await expect(
      restored.getByRole("button", { name: /가짜 E2E 전신 A.*1\/1세트.*완료/ }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
