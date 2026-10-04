import { useState, type FormEvent } from "react";
import {
  Alert,
  Badge,
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { LogIn, LogOut, ShieldCheck } from "lucide-react";
import { supabase, configurationError } from "../data/cloud/client";
import { useAuth } from "../context/auth";
export function AccountPanel({ busy }: { busy: boolean }) {
  const { session, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function login(event: FormEvent) {
    event.preventDefault();
    if (!supabase || saving || busy) return;
    setSaving(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error)
        setError(
          "로그인하지 못했습니다. 이메일과 비밀번호, 계정 상태를 확인해주세요.",
        );
      else setPassword("");
    } catch {
      setError("네트워크를 확인하고 다시 로그인해주세요.");
    } finally {
      setSaving(false);
    }
  }
  async function logout() {
    if (!supabase || saving || busy) return;
    setSaving(true);
    setError("");
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) setError("로그아웃하지 못했습니다. 다시 시도해주세요.");
    } catch {
      setError("로그아웃하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <Paper>
      <Group gap="sm" justify="space-between" mb="md">
        <Title order={2} mb="sm">
          계정 연결
        </Title>
        <Badge variant="light">
          {session
            ? "로그인됨"
            : supabase
              ? "Supabase 연결 준비됨"
              : "기기 저장"}
        </Badge>
      </Group>
      {authError && <Alert color="red">{authError}</Alert>}
      {configurationError && <Alert color="orange">{configurationError}</Alert>}
      {error && (
        <Alert role="alert" color="red">
          {error}
        </Alert>
      )}
      {!supabase ? (
        <Text size="sm" c="dimmed" my="sm">
          프로젝트 설정 후 계정 로그인을 사용할 수 있습니다.
        </Text>
      ) : session ? (
        <>
          <Text size="sm" c="dimmed" my="sm">
            {session.user.email ?? "연결된 계정"}
          </Text>
          <Text size="xs" c="dimmed" my="sm">
            이 계정의 기기 저장소를 사용합니다. 로그인 전에 작성한 기기 프로필은
            별도로 보존됩니다.
          </Text>
          <Button
            leftSection={<LogOut size={18} />}
            variant="default"
            disabled={busy}
            loading={saving}
            onClick={() => void logout()}
          >
            이 기기에서 로그아웃
          </Button>
        </>
      ) : (
        <Stack onSubmit={login} component="form" gap="md">
          <Text size="sm" c="dimmed" my="sm">
            등록된 계정으로 로그인하세요. 기기 프로필 기록은 로그인 계정으로
            자동 전송되지 않습니다.
          </Text>
          <TextInput
            label="이메일"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <PasswordInput
            label="비밀번호"
            autoComplete="current-password"
            visibilityToggleButtonProps={{ "aria-label": "비밀번호 표시 전환" }}
            required
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <Button
            type="submit"
            leftSection={<LogIn size={18} />}
            disabled={busy}
            loading={saving}
          >
            로그인
          </Button>
        </Stack>
      )}
      {busy && (
        <Text size="xs" c="dimmed" my="sm">
          진행 중인 운동과 저장을 마친 후 계정을 전환할 수 있습니다.
        </Text>
      )}
      <Text size="xs" c="dimmed" my="sm">
        <ShieldCheck size={15} /> 계정별 저장소를 분리하며, 클라우드 전송은
        설정에서 별도로 실행합니다.
      </Text>
    </Paper>
  );
}
