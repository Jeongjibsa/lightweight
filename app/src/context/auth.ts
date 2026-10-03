import { createContext, useContext } from "react";
import type { Session } from "@supabase/supabase-js";
export const AuthContext = createContext<{
  session: Session | null;
  loading: boolean;
  error: string;
}>({ session: null, loading: true, error: "" });
export function useAuth() {
  return useContext(AuthContext);
}
