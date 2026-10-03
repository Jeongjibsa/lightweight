export type PublicConfig = { url: string; key: string };
export function publicConfig(url?: string, key?: string): PublicConfig | null {
  if (!url?.trim() || !key?.trim()) return null;
  const parsed = new URL(url);
  if (
    parsed.protocol !== "https:" ||
    parsed.username ||
    parsed.password ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash
  )
    throw new Error("Supabase 프로젝트의 HTTPS URL을 확인해주세요.");
  if (!/^sb_publishable_[A-Za-z0-9_-]{16,}$/.test(key.trim()))
    throw new Error("브라우저에는 Supabase Publishable key만 사용해주세요.");
  return { url: parsed.origin, key: key.trim() };
}
