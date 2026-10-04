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
  at: "2026-10-04T14:16:08+09:00"
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
  - id: "settings-loop"
    resource: "../../raw/research/2026-10-04-settings-restore-loop.json"
    title: "복원 입력 회귀/수정"
  - id: "design-request"
    resource: "../../raw/conversations/2026-10-04-010.md"
    title: "전체 Mantine/Geist/하단 UX 요구"
  - id: "design-technical"
    resource: "../sources/SRC-039-mantine-geist-design.md"
    title: "기술 확인"
  - id: "design-verification"
    resource: "../../raw/research/2026-10-04-mantine-geist-design-verification.json"
    title: "실행"
  - id: "tone-request"
    resource: "../../raw/conversations/2026-10-04-011.md"
    title: "Monokai/Mantine 톤 변경 요구"
  - id: "tone-verification"
    resource: "../../raw/research/2026-10-04-charcoal-theme-verification.json"
    title: "차콜 증분 실행"
version: "0.2.1"
change_id: "CHG-0011"
---

# 현재 기술 스택과 라이브러리

2026-10-04 / app0.2.0 / PRD0.6.1 / schema2. `app/package.json`·lockfile의 실제 버전이다. [전체 UI 변경](design-system.md) · [최신 검사](../../raw/research/2026-10-04-charcoal-theme-verification.json).

| 층 | 패키지·버전 | 실제 역할 |
|---|---|---|
| 언어/빌드 | TypeScript6.0.3, Vite8.3.2, @vitejs/plugin-react6.1.1 | strict 타입·React 빌드·preview |
| 화면 | React19.3.0, react-dom19.3.0 | 반응형 PWA/계정별 화면 |
| UI | @mantine/core9.6.3, @mantine/hooks9.6.3 | charcoal/yellow theme·layout·Paper/Button/ActionIcon/NavLink·입력·표·Drawer/Modal·모든 주요 UI |
| 글꼴 | @fontsource-variable/geist5.3.0 | Geist Variable 번들, 한글 시스템 fallback, OFL LICENSE |
| 아이콘 | lucide-react1.51.0 | 화면/action·charcoal/yellow Dumbbell 앱 아이콘 원본 |
| 기기 데이터 | Dexie4.4.6, dexie-react-hooks4.4.0 | IndexedDB schema2·트랜잭션·live query·계정별 DB |
| 계약 | Zod4.6.5 | 입력/백업/RPC·JSON Schema 생성 |
| 계정/클라우드 | @supabase/supabase-js2.117.2 | Auth·등록 password login·manual RPC |
| PWA | vite-plugin-pwa1.3.0 | manifest/SW·앱/폰트 캐시·운동 중 업데이트 guard |
| 서버 | Supabase PostgreSQL17.11, Auth, pg_jsonschema | 기존 private 권한/허용 목록·충돌/중복·입력 검증; 이번 UI 변경에서 서버 변경 없음 |
| 자동 unit/integration | Vitest4.1.11, fake-indexeddb6.2.5 | unit19/통합25, 실제 브라우저/서버 Auth와 구별 |
| 자동 DOM | @testing-library/react16.3.3, dom10.4.2, user-event14.6.7, jsdom27.4.0 | ui11, 실제 components/Dexie·키보드/완료/오류/복원/필터/연속 선택 |
| 정적/형식 | oxlint1.86.0, Prettier3.9.9 | lint·format |
| 서버 개발 도구 | Supabase CLI2.119.0, pg8.23.1 | migrations/TLS probe/SQL rollback·허용 목록; 앱 bundle 제외 |
| 타입 | @types/node24.19.1, react19.3.0, react-dom19.3.0 | 빌드 타입 |

기본 검사 환경 Node24.14.1/npm11.11.0, CI Node24 major. Next.js/Tailwind/shadcn·추가 chart/LLM runtime은 사용하지 않는다. 볼륨은 순수 TypeScript·실제 데이터 SVG·Mantine controls/Table이다. Playwright Test runner·CI browser trace는 미구현이며 CUA 수동 관찰을 구별한다. 개발용 `app/tests/harness/responsive.html`은 실제 iframe 폭을 선택하는 수동 fixture로 production entry/public asset이 아니다.

## UI·글꼴과 경계

CONV-0008의 부분 Mantine/Spoqa를 CONV-0010에서 전체 Mantine/Geist로 바꾸고, CONV-0011에서 차콜/노란 강조로 조정했다. 주요 UI 스타일은 `src/theme.ts`·Mantine props/styles API, document/safe-area·fixed bottom/skip link·SVG 기하는 `src/index.css`다. 하단 메뉴는 모든 폭에 유지한다. [기준](design-system.md).

Geist5개 normal variable WOFF2 subset 합계76.41KB, dist/assets 번들·PWA precache. `public/fonts/geist/LICENSE`에 OFL을 포함하고 종전 Spoqa3개 WOFF2/라이선스는 앱에서 제거했다. 과거 vault 자료는 보존한다. 설치 metadata에 Hangul subset이 없어 시스템 한글 글꼴로 fallback한다. 모든 한글이 Geist로 렌더된다는 뜻이 아니다. CDN 요청은 없으며 이번에 실제 iPhone/offline 폰트 재실행을 검증하지 않았다.

기존 CSP는 self fonts/scripts·정확한 Supabase connect-src·Mantine 동적 style의 unsafe-inline 정책을 유지한다. 운영 `_headers` 적용은 아직 배포 검증 전이다.

## 빌드·검사·데이터

현재 색상 증분은 패키지/버전 추가 없이 theme·표면/강조·PWA 자산을 수정했다. [최신 실행](../../raw/research/2026-10-04-charcoal-theme-verification.json).

앱 진입97.06KB/30.42KB gzip, Mantine CSS233.86KB/34.17KB gzip, precache25개/1217.59KiB. 청크 분리는 전체 다운로드 감소 보장이 아니다. 호스트에는 app/dist만 제공하며 vault/서버 secrets/개인 backup은 포함하지 않는다.

최신 unit19/integration25/ui11·55개/12파일, lint 경고0/build/format. DOM의 no-layout stubs/FileReader test 보완과 수동 CUA layout을 구별한다. owner/schema/스토어/계산/RPC 변경 없음. [최신 실행](../../raw/research/2026-10-04-charcoal-theme-verification.json) · [Supabase](supabase-integration.md) · [하네스](../operations/testing-harness.md).
