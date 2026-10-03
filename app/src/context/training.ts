import { createContext, useContext } from "react";
import {
  db,
  store,
  TrainingDatabase,
  TrainingStore,
} from "../data/local/store";
import { accountDatabaseName } from "../data/local/account";
const local = { db, store, accountId: null as string | null };
const workspaces = new Map<
  string,
  { db: TrainingDatabase; store: TrainingStore; accountId: string }
>();
export function trainingWorkspace(accountId: string | null) {
  if (!accountId) return local;
  let existing = workspaces.get(accountId);
  if (!existing) {
    const database = new TrainingDatabase(accountDatabaseName(accountId));
    existing = { db: database, store: new TrainingStore(database), accountId };
    workspaces.set(accountId, existing);
  }
  return existing;
}
export const TrainingContext = createContext(local);
export function useTraining() {
  return useContext(TrainingContext);
}
