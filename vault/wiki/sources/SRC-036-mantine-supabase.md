---
type: "Reference"
title: "Mantine·Spoqa Han Sans Neo·Supabase 공식 구현 근거"
description: "UI 공급자·글꼴 라이선스·Auth/키·DB 권한·TLS·JSON 검증의 표적 확인과 실제 구현 범위를 기록한다."
tags:
  - "source"
  - "technology"
  - "security"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T02:02:14+09:00"
sources:
  - id: "official-1"
    resource: "https://mantine.dev/guides/vite/"
    title: "공식 기술 자료"
  - id: "official-2"
    resource: "https://mantine.dev/theming/mantine-provider/"
    title: "공식 기술 자료"
  - id: "official-3"
    resource: "https://mantine.dev/core/modal/"
    title: "공식 기술 자료"
  - id: "official-4"
    resource: "https://github.com/spoqa/spoqa-han-sans"
    title: "공식 기술 자료"
  - id: "official-5"
    resource: "https://github.com/spoqa/spoqa-han-sans/blob/main/LICENSE"
    title: "공식 기술 자료"
  - id: "official-6"
    resource: "https://supabase.com/changelog.md"
    title: "공식 기술 자료"
  - id: "official-7"
    resource: "https://supabase.com/docs/guides/getting-started/api-keys"
    title: "공식 기술 자료"
  - id: "official-8"
    resource: "https://supabase.com/docs/reference/javascript/initializing"
    title: "공식 기술 자료"
  - id: "official-9"
    resource: "https://supabase.com/docs/reference/javascript/auth-signinwithpassword"
    title: "공식 기술 자료"
  - id: "official-10"
    resource: "https://supabase.com/docs/guides/database/connecting-to-postgres"
    title: "공식 기술 자료"
  - id: "official-11"
    resource: "https://supabase.com/docs/guides/platform/ssl-enforcement"
    title: "공식 기술 자료"
  - id: "official-12"
    resource: "https://supabase.com/docs/guides/database/functions"
    title: "공식 기술 자료"
  - id: "official-13"
    resource: "https://supabase.com/docs/guides/database/extensions/pg_jsonschema"
    title: "공식 기술 자료"
  - id: "official-14"
    resource: "https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable"
    title: "공식 기술 자료"
  - id: "official-15"
    resource: "https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable"
    title: "공식 기술 자료"
source_id: "SRC-036"
resource: "https://mantine.dev/guides/vite/"
review_scope: "공식 관련 본문·패키지 타입 표적 확인; 실제 검사 범위 별도 기록"
retrieved_at: "2026-10-04T02:02:14+09:00"
---

# Mantine·Spoqa Han Sans Neo·Supabase 공식 구현 근거

ID: SRC-036. 확인일 2026-10-04. 공식 안내의 관련 본문과 로컬 설치 패키지 타입을 표적 확인했다. 제품 전체 문서나 보안 인증을 완료한 것은 아니다. 이번 변경에 새 건강·운동·영양 효과 주장은 없다.

| 출처 묶음 | 읽은 범위 | 적용과 한계 |
|---|---|---|
| Mantine | Vite styles import·MantineProvider·Modal 초점/스크롤/닫기 옵션 | provider/theme와 공통 모달 적용. 조건부 unmount 시 초점 복귀는 앱에서 보완하고 실제 브라우저로 확인 |
| Spoqa 공식 저장소·LICENSE | 제공 글꼴 파일과 SIL Open Font License 1.1 | Regular/Medium/Bold WOFF2와 LICENSE를 같은 origin에 제공. 공식 배포 글꼴을 변형하지 않음 |
| Supabase changelog·API keys·JS 초기화 | 현재 공개 API 권한 변경·publishable/server secret 구분·SDK 생성 | 정확한 버전 고정. 공개 키 존재는 개인 기록 권한 근거가 아님 |
| Password login | 등록된 이메일/비밀번호 signInWithPassword API | 초기 구현 방식. 사용자 최종 로그인 수단 선택이나 실제 계정 로그인 성공으로 표시하지 않음 |
| DB 연결·SSL | direct/pooler와 인증서 검증 연결 안내 | Session pooler에 공식 CA와 hostname 검증. IPv6 direct 접속 실패를 TLS 완화로 우회하지 않음 |
| Functions·pg_jsonschema | invoker/definer·search_path·execute 권한·JSON Schema 검사 | 공개 invoker RPC, 비공개 definer에서 auth.uid/허용 목록 직접 검사. Zod JSON Schema와 추가 교차필드 검증 |
| Advisor 0028/0029 | anon/authenticated에 노출된 definer의 위험과 권한 정정 | 기존 public event_trigger helper 실행권한 정정. 적용 뒤 security/performance lints 빈 배열 확인; 전체 보안 보장은 아님 |

## 확인한 공식 자료

- [공식 자료 1](https://mantine.dev/guides/vite/)
- [공식 자료 2](https://mantine.dev/theming/mantine-provider/)
- [공식 자료 3](https://mantine.dev/core/modal/)
- [공식 자료 4](https://github.com/spoqa/spoqa-han-sans)
- [공식 자료 5](https://github.com/spoqa/spoqa-han-sans/blob/main/LICENSE)
- [공식 자료 6](https://supabase.com/changelog.md)
- [공식 자료 7](https://supabase.com/docs/guides/getting-started/api-keys)
- [공식 자료 8](https://supabase.com/docs/reference/javascript/initializing)
- [공식 자료 9](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
- [공식 자료 10](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [공식 자료 11](https://supabase.com/docs/guides/platform/ssl-enforcement)
- [공식 자료 12](https://supabase.com/docs/guides/database/functions)
- [공식 자료 13](https://supabase.com/docs/guides/database/extensions/pg_jsonschema)
- [공식 자료 14](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable)
- [공식 자료 15](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable)

## 실제 검사와 미시험

[실행 수집 기록](../../raw/research/2026-10-04-mantine-supabase-verification.json)에 실제 패키지 버전·코드 해시·검사 범위를 연결했다. JSON Schema 출력만으로 Zod refine 규칙이 서버에 모두 자동 이식되는 것은 아니므로 SQL 교차필드 검증을 별도로 작성했다. 원격 role/JWT SQL 검사는 실제 Auth 토큰/브라우저 계정 흐름과 구별한다. 실제 계정이 없어 로그인→전송→다른 기기 복원은 미시험이다. Vitest v4 projects 근거는 [SRC-035](SRC-035-testing-harness.md)를 유지한다.
