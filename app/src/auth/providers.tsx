import { useEffect, useState, type ReactNode } from "react";
import { Loader, Stack, Text } from "@mantine/core";
import { AuthContext, useAuth } from "../context/auth";
import { TrainingContext, trainingWorkspace } from "../context/training";
import { supabase } from "../data/cloud/client";
import type { Session } from "@supabase/supabase-js";
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    session: Session | null;
    loading: boolean;
    error: string;
  }>({ session: null, loading: !!supabase, error: "" });
  useEffect(() => {
    if (!supabase) return;
    let disposed = false;
    let events = 0;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      events++;
      if (!disposed) setState({ session, loading: false, error: "" });
    });
    const before = events;
    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!disposed && events === before)
          setState({
            session: data.session,
            loading: false,
            error: error
              ? "로그인 상태를 확인하지 못했습니다. 다시 로그인해주세요."
              : "",
          });
      })
      .catch(() => {
        if (!disposed && events === before)
          setState({
            session: null,
            loading: false,
            error: "로그인 상태를 확인하지 못했습니다.",
          });
      });
    return () => {
      disposed = true;
      subscription.unsubscribe();
    };
  }, []);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  if (loading)
    return (
      <Stack className="boot-screen" align="center">
        <Loader />
        <Text>로그인 상태를 확인하는 중…</Text>
      </Stack>
    );
  const accountId = session?.user.id ?? null;
  return (
    <TrainingContext.Provider
      key={accountId ?? "local"}
      value={trainingWorkspace(accountId)}
    >
      {children}
    </TrainingContext.Provider>
  );
}
