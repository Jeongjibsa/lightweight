import type { Page } from "@playwright/test";
import type { Backup, OutboxItem } from "../../src/domain/models";

export async function databaseSnapshot(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("lightweight-v1");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      const names = [...db.objectStoreNames];
      const tx = db.transaction(names, "readonly");
      const result = await Promise.all(
        names.map(
          (name) =>
            new Promise<[string, unknown[]]>((resolve, reject) => {
              const request = tx.objectStore(name).getAll();
              request.onsuccess = () => resolve([name, request.result]);
              request.onerror = () => reject(request.error);
            }),
        ),
      );
      return { version: db.version, tables: Object.fromEntries(result) };
    } finally {
      db.close();
    }
  });
}
export async function seedVersionOne(
  page: Page,
  backup: Backup,
  outbox: OutboxItem[] = [],
) {
  // This blank same-origin fixture runs before production App/Dexie opens the DB.
  await page.goto("/__e2e/blank");
  await page.evaluate(
    async ({ backup, outbox }) => {
      localStorage.setItem(
        "lightweight.active-profile.v1",
        backup.profile.ownerId,
      );
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open("lightweight-v1", 10); // Dexie schema 1 = native version 10.
        request.onupgradeneeded = () => {
          const definitions: [string, string, string[]][] = [
            ["profiles", "ownerId", []],
            ["routines", "id", ["ownerId", "updatedAt"]],
            ["sessions", "id", ["ownerId", "localDate", "updatedAt"]],
            ["outbox", "id", ["ownerId", "entityId", "createdAt"]],
          ];
          for (const [name, keyPath, indexes] of definitions) {
            const store = request.result.createObjectStore(name, { keyPath });
            for (const index of indexes) store.createIndex(index, index);
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      try {
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction([...db.objectStoreNames], "readwrite");
          tx.objectStore("profiles").put(backup.profile);
          for (const record of backup.routines)
            tx.objectStore("routines").put(record);
          for (const record of backup.sessions)
            tx.objectStore("sessions").put(record);
          for (const record of outbox) tx.objectStore("outbox").put(record);
          tx.oncomplete = () => resolve();
          tx.onabort = () => reject(tx.error);
        });
      } finally {
        db.close();
      }
    },
    { backup, outbox },
  );
}
