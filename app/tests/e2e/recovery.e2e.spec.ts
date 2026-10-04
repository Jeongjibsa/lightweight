import { test, expect } from "./fixture";
import {
  configure,
  createRoutine,
  downloadBackup,
  startRoutine,
} from "./helpers";
import { databaseSnapshot, seedVersionOne } from "./storage";
import {
  owner,
  profileFixture,
  sessionFixture,
  routineFixture,
} from "../fixtures/training";
import { largeBackupFixture } from "../fixtures/large-backup";
import type { Backup, OutboxItem } from "../../src/domain/models";
import { readFile } from "node:fs/promises";

const sorted = (sessions: Backup["sessions"]) =>
  sessions.toSorted((a, b) => a.id.localeCompare(b.id));

test("HAR-04 native IndexedDB: outbox quota 주입→전체 rollback→재시도 한 번 저장", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = IDBObjectStore.prototype.add;
    IDBObjectStore.prototype.add = function (...args) {
      if (
        this.name === "outbox" &&
        sessionStorage.getItem("e2e-quota-once") === "1"
      ) {
        sessionStorage.removeItem("e2e-quota-once");
        throw new DOMException(
          "Synthetic quota fault at outbox enqueue",
          "QuotaExceededError",
        );
      }
      return original.apply(this, args);
    };
  });
  await page.goto("/");
  await configure(page);
  await createRoutine(page);
  await startRoutine(page);
  await page
    .getByRole("spinbutton", { name: "바벨 스쿼트 1세트 중량", exact: true })
    .fill("20");
  await page
    .getByRole("spinbutton", { name: "바벨 스쿼트 1세트 횟수", exact: true })
    .fill("8");
  // Persist the blur draft before arming the completion fault: no race with a separate draft transaction.
  await page
    .getByRole("spinbutton", { name: "바벨 스쿼트 1세트 횟수", exact: true })
    .blur();
  await expect
    .poll(async () => {
      const snapshot = await databaseSnapshot(page);
      return (
        snapshot.tables.sessions![0] as { sets: { reps: number | null }[] }
      ).sets[0]!.reps;
    })
    .toBe(8);
  const before = await databaseSnapshot(page);
  await page.evaluate(() => sessionStorage.setItem("e2e-quota-once", "1"));
  const complete = page.getByRole("button", {
    name: "바벨 스쿼트 1세트 완료",
    exact: true,
  });
  await complete.click();
  await expect(page.getByText(/이 기기의 저장 공간이 부족해/)).toBeVisible();
  await expect(complete).toHaveAttribute("aria-pressed", "false");
  expect(await databaseSnapshot(page)).toEqual(before);
  await complete.click();
  await expect(
    page.getByRole("button", {
      name: "바벨 스쿼트 1세트 완료 취소",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  const after = await databaseSnapshot(page);
  expect(after.tables.outbox!.length).toBe(before.tables.outbox!.length + 1);
  const data = (await downloadBackup(page)).data;
  expect(data.sessions[0]!.sets[0]).toMatchObject({ load: 20, reps: 8 });
  expect(data.sessions[0]!.sets[0]!.completedAt).toBeTruthy();
  await page.reload();
  expect(await databaseSnapshot(page)).toEqual(after);
});

test("HAR-04 schema1→2: 실제 browser DB 설정·삭제·outbox 보존", async ({
  page,
}) => {
  const session = sessionFixture();
  const backup: Backup = {
    format: "lightweight-backup",
    version: 1,
    exportedAt: "2026-10-04T03:00:00.000Z",
    profile: profileFixture(),
    routines: [routineFixture({ deletedAt: "2026-10-02T04:00:00Z" })],
    sessions: [session],
  };
  const outbox: OutboxItem[] = [
    {
      id: crypto.randomUUID(),
      ownerId: owner,
      entity: "session",
      entityId: session.id,
      revision: session.revision,
      createdAt: session.updatedAt,
      payload: session,
    },
  ];
  await seedVersionOne(page, backup, outbox);
  const before = await databaseSnapshot(page);
  expect(before.version).toBe(10);
  await page.goto("/");
  const migrated = (await downloadBackup(page)).data;
  expect(migrated.profile).toEqual(backup.profile);
  expect(migrated.routines).toEqual(backup.routines);
  expect(migrated.sessions).toEqual(backup.sessions);
  const after = await databaseSnapshot(page);
  expect(after.version).toBe(20);
  expect(after.tables.cloud).toEqual([]);
  for (const [name, records] of Object.entries(before.tables))
    expect(after.tables[name]).toEqual(records);
  await page.reload();
  expect(await databaseSnapshot(page)).toEqual(after);
});

test("HAR-04 14,400세트: 실제 큰 다운로드→복원·초과 입력 거부·기록 유지", async ({
  page,
}, info) => {
  const backup = largeBackupFixture(owner);
  await seedVersionOne(page, backup);
  await page.goto("/");
  const source = await downloadBackup(page);
  const text = await readFile(source.path, "utf8");
  expect(Buffer.byteLength(text)).toBeLessThanOrEqual(10485760);
  expect(sorted(source.data.sessions)).toEqual(sorted(backup.sessions));
  await page
    .getByLabel("백업 파일 선택", { exact: true })
    .setInputFiles(source.path);
  const dialog = page.getByRole("dialog", {
    name: "백업을 복원할까요?",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole("button", { name: "현재 프로필에 복원", exact: true })
    .click();
  await expect(dialog).toBeHidden();
  expect(sorted((await downloadBackup(page)).data.sessions)).toEqual(
    sorted(backup.sessions),
  );
  const before = await databaseSnapshot(page);
  await page.getByLabel("백업 파일 선택", { exact: true }).setInputFiles({
    name: "oversized-synthetic.json",
    mimeType: "application/json",
    buffer: Buffer.alloc(10485761, " "),
  });
  await expect(
    page.getByText("백업 파일은 10MiB 이하만 사용할 수 있습니다.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(dialog).toBeHidden();
  expect(await databaseSnapshot(page)).toEqual(before);
  await info.attach("large-backup.json", {
    body: Buffer.from(
      JSON.stringify({
        sessions: 36,
        sets: 14400,
        exportedBytes: Buffer.byteLength(text),
        importLimitBytes: 10485760,
        rejectedBytes: 10485761,
      }),
    ),
    contentType: "application/json",
  });
});

test("10MiB 초과 기록의 압축 다운로드를 새 기기에 복원하고 손상 파일에서 기록을 보존한다", async ({
  page,
  browser,
  diagnostics,
}, info) => {
  const backup = largeBackupFixture(owner, 60);
  expect(Buffer.byteLength(JSON.stringify(backup))).toBeGreaterThan(10485760);
  await seedVersionOne(page, backup);
  await page.goto("/");
  const source = await downloadBackup(page);
  expect(source.filename).toMatch(/\.json\.gz$/);
  expect(source.bytes).toBeLessThanOrEqual(10485760);
  expect(sorted(source.data.sessions)).toEqual(sorted(backup.sessions));
  const context = await browser.newContext();
  try {
    const restored = await context.newPage();
    diagnostics(restored);
    await restored.goto("/#settings");
    await expect(
      restored.getByLabel("프로필 이름", { exact: true }),
    ).toBeVisible();
    expect((await databaseSnapshot(restored)).tables.sessions).toHaveLength(0);
    await restored
      .getByLabel("백업 파일 선택", { exact: true })
      .setInputFiles(source.path);
    const dialog = restored.getByRole("dialog", {
      name: "백업을 복원할까요?",
      exact: true,
    });
    await expect(dialog).toBeVisible();
    await dialog
      .getByRole("button", { name: "현재 프로필에 복원", exact: true })
      .click();
    await expect(dialog).toBeHidden();
    const result = await downloadBackup(restored);
    // An independent context creates its own owner; IDs and actual sets must survive.
    expect(
      sorted(result.data.sessions).map((s) => ({ ...s, ownerId: owner })),
    ).toEqual(sorted(backup.sessions));
    await restored.reload();
    expect(sorted((await downloadBackup(restored)).data.sessions)).toEqual(
      sorted(result.data.sessions),
    );
    const before = await databaseSnapshot(restored);
    const corrupt = await readFile(source.path);
    corrupt[corrupt.length - 8] ^= 1;
    await restored.getByLabel("백업 파일 선택", { exact: true }).setInputFiles({
      name: "corrupt.json.gz",
      mimeType: "application/gzip",
      buffer: corrupt,
    });
    await expect(
      restored.getByText(
        "백업 파일을 읽지 못했습니다. 파일 형식을 확인한 뒤 다시 선택해주세요.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(dialog).toBeHidden();
    expect(await databaseSnapshot(restored)).toEqual(before);
    await info.attach("compressed-backup.json", {
      body: Buffer.from(
        JSON.stringify({
          sessions: 60,
          sets: 24000,
          expandedBytes: Buffer.byteLength(JSON.stringify(backup)),
          compressedBytes: source.bytes,
          independentContext: true,
          corruptionRejected: true,
        }),
      ),
      contentType: "application/json",
    });
  } finally {
    await context.close();
  }
});
