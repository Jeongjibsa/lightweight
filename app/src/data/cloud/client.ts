import { createClient } from "@supabase/supabase-js";
import { publicConfig } from "./config";
let config: ReturnType<typeof publicConfig> = null;
export let configurationError = "";
try {
  config = publicConfig(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  );
} catch {
  configurationError =
    "Supabase 연결 설정을 확인해주세요. 기기 기록은 계속 사용할 수 있습니다.";
}
export const supabase = config
  ? createClient(config.url, config.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;
