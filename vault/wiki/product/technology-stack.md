---
type: "Technology Stack"
title: "현재 기술 스택과 라이브러리"
description: "app0.2.0의 실제 패키지 버전·역할·Mantine/글꼴 적용·배포 데이터 경계."
tags:
  - "product"
  - "technology"
  - "implementation"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T02:02:14+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-008.md"
    title: "요구"
  - id: "technical"
    resource: "../sources/SRC-036-mantine-supabase.md"
    title: "공식 자료"
  - id: "verification"
    resource: "../../raw/research/2026-10-04-mantine-supabase-verification.json"
    title: "설치/실제 검사"
version: "0.1.0"
change_id: "CHG-0008"
---

# 현재 기술 스택과 라이브러리

2026-10-04 / app0.2.0. **설치된 `app/package.json`·lockfile 기준 정확한 버전**이다. 프레임워크 교체 제안이 아닌 현재 구현 상태다. [사용자 요구](../../raw/conversations/2026-10-04-008.md) · [실제 검사](../../raw/research/2026-10-04-mantine-supabase-verification.json).

| 층 | 패키지·버전 | 실제 역할 |
|---|---|---|
| 언어/빌드 | TypeScript6.0.3, Vite8.3.2, @vitejs/plugin-react6.1.1 | strict 타입 검사·React 빌드·preview |
| 화면 | React19.3.0, react-dom19.3.0 | 반응형 PWA, 프로필/계정 전환 |
| UI | @mantine/core9.6.3, @mantine/hooks9.6.3 | provider/theme·Modal·TextInput·NativeSelect·UnstyledButton 및 계정/클라우드 UI |
| 글꼴 | Spoqa Han Sans Neo Regular400/Medium500/Bold700 | 공식 WOFF2를 같은 origin에서 제공, SIL OFL1.1 LICENSE 포함 |
| 아이콘 | lucide-react1.51.0 | 화면/동작 아이콘 |
| 기기 데이터 | Dexie4.4.6, dexie-react-hooks4.4.0 | IndexedDB schema2·원자 쓰기·live query·계정별 DB |
| 데이터 계약 | Zod4.6.5 | 사용자 입력/백업/RPC 응답 검증·서버 JSON Schema 생성 |
| 계정/클라우드 | @supabase/supabase-js2.117.2 | Auth 세션/비밀번호 로그인·인증 RPC 호출 |
| PWA | vite-plugin-pwa1.3.0 | manifest·서비스 워커·앱/글꼴 캐시·업데이트 안내 |
| 서버 | Supabase PostgreSQL17.11, Auth, pg_jsonschema | 비공개 기록/허용 목록·버전 충돌·중복 방지·서버 입력 검증 |
| 단위/통합 검사 | Vitest4.1.11, fake-indexeddb6.2.5 | Node의 unit6/integration24; 실제 브라우저 저장소와 구별 |
| 정적/형식 | oxlint1.86.0, Prettier3.9.9 | 코드 규칙·형식 검사 |
| 서버 개발 도구 | Supabase CLI2.119.0, pg8.23.1 | migration 생성·TLS DB probe·rollback 검증/허용 목록 CLI. 앱 번들에는 포함하지 않음 |
| 타입 개발 도구 | @types/node24.19.1, @types/react19.3.0, @types/react-dom19.3.0 | 컴파일용 타입 |

기본 로컬 검사는 Node24.14.1/npm11.11.0, CI는 Node24 major다. 프로젝트는 클라이언트 React+Vite PWA이며 Next.js·Tailwind·shadcn·외부 LLM 런타임·React Testing Library·저장소 Playwright Test runner를 사용하지 않는다. 마지막 두 검증 도구는 다음 하네스 후보다. 별도 개발 브라우저 관찰은 CUA/기존 Playwright CLI이며 앱 런타임 의존성이 아니다.

## UI·글꼴 적용 범위

`app/src/main.tsx`에 Mantine 스타일/Provider, `app/src/theme.ts`에 녹색 테마·입력 크기·Spoqa 글꼴을 적용했다. 기존 화면 배치 CSS를 유지하면서 공통 모달·입력·선택·버튼과 계정/클라우드 UI에 Mantine을 사용한다. 모든 HTML 요소를 Mantine으로 일괄 치환한 것은 아니다. 실제 브라우저에서 글꼴 로딩·입력16px·모달 초점/닫기·320/375/1440px 설정 화면을 확인했다.

`app/public/fonts/spoqa-han-sans-neo/`의 세 WOFF2와 LICENSE를 제공한다. 합계 약544KB이며 PWA precache에 포함한다. 외부 폰트 CDN 요청이 없어 오프라인 준비 후 사용할 수 있는 구조다. 이번 변경으로 실제 iPhone/offline 폰트 재실행을 통과했다고 주장하지 않는다.

Mantine의 동적 스타일 적용에 CSP `style-src 'self' 'unsafe-inline'`을 허용했다. `script-src 'self'`와 같은 origin 글꼴, 정확한 Supabase `connect-src`를 유지한다. 정적 `_headers`의 운영 적용은 아직 배포 검증 전이다.

## 빌드와 데이터 경계

React·Mantine·Supabase·저장/검증 의존성 청크를 나눴다. 앱 진입 JS는84.22KB/25.30KB gzip, Mantine CSS는233.86KB/34.17KB gzip, 전체 PWA precache는23개/1623.05KiB다. 청크 분리가 전체 다운로드량 감소를 보장하지 않는다. 호스트에는 `app/dist`만 제공한다. vault·서버 스크립트·DB 비밀번호·개인 JSON 백업은 배포하지 않는다.

[Supabase 연결/운영](supabase-integration.md) · [현재 하네스](../operations/testing-harness.md) · [공식 자료/범위](../sources/SRC-036-mantine-supabase.md)
