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
  at: "2026-10-07T21:33:11+09:00"
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
  - id: "component-request"
    resource: "../../raw/conversations/2026-10-04-012.md"
    title: "컴포넌트 재점검/3D 요구"
  - id: "component-check"
    resource: "../../raw/research/2026-10-04-component-review.json"
    title: "실제 페이지별 관찰"
  - id: "e2e-request"
    resource: "../../raw/conversations/2026-10-04-013.md"
    title: "다음 순차 구현 요청"
  - id: "e2e-run"
    resource: "../../raw/research/2026-10-04-e2e-harness-verification.json"
    title: "9과업·27반복·최초 실패 증거"
  - id: "storage-request"
    resource: "../../raw/conversations/2026-10-04-014.md"
    title: "순차 요청"
  - id: "storage-run"
    resource: "../../raw/research/2026-10-04-storage-recovery-verification.json"
    title: "저장 보존 검사"
  - id: "ci-receipt"
    resource: "../../raw/research/2026-10-04-github-ci-37184261544.json"
    title: "GitHub CI 증거"
  - id: "cf-request"
    resource: "../../raw/conversations/2026-10-04-015.md"
    title: "Cloudflare 요청"
  - id: "cf-setup"
    resource: "../operations/cloudflare-setup.md"
    title: "연결 운영"
  - id: "email-complete"
    resource: "../../raw/conversations/2026-10-04-017.md"
    title: "사용자 이메일 인증 완료"
  - id: "deployment-check"
    resource: "../../raw/research/2026-10-04-pages-deployment.json"
    title: "실제 HTTPS 배포"
  - id: "redirect"
    resource: "../sources/SRC-047-auth-production-origin.md"
    title: "Auth 반환 주소"
  - id: "request22"
    resource: "../../raw/conversations/2026-10-04-022.md"
    title: "카탈로그·휴식·제목·Git·Google 요청"
  - id: "request22-loop"
    resource: "../../raw/research/2026-10-04-catalog-rest-timer-loop.json"
    title: "실행/캡처"
  - id: "git-google"
    resource: "../../raw/research/2026-10-04-git-oauth-review.json"
    title: "Git 구성/Google 검토"
  - id: "workout-ux-request"
    resource: "../../raw/conversations/2026-10-07-025.md"
    title: "운동 접기/휴식 접근 요구"
version: "0.2.3"
change_id: "CHG-0014"
---

# 현재 기술 스택과 라이브러리

## 첫 HTTPS 배포 — 2026-10-04 현재

운영: [lightweight-training.pages.dev](https://lightweight-training.pages.dev). preview: [운영 DB 연결 없는 미리보기](https://preview.lightweight-training.pages.dev). 화면과 기기 기록을 바로 사용할 수 있다. 공개 페이지이며 계정 데이터 접근은 Supabase 허용 목록/RLS로 제한한다. site-wide Access는 미설정이다.

이메일 완료 답변 뒤 project 생성 성공, 검증된3bc6022를 main에 fast-forward/push했다. GitHub3job success 후 app/dist만 배포했다. 24파일 artifact gate, 실제 공개23파일(index/PWA/font/JS/CSS)의 SHA256 일치와 보안 헤더를 운영/preview에서 확인했다. 다섯 실제 HTTPS 화면을 캡처/직접 확인했다. [실행](../../raw/research/2026-10-04-pages-deployment.json).

Supabase Site URL과 정확한 root 반환 경로 하나를 저장했다. Auth settings200/signupDisabled=true, 비로그인 read/write RPC401을 재확인했다. Auth 계정0개: 본인 등록/비밀번호는 사용자가 직접 준비, 허용 UUID·실제 로그인/복원/A-B/만료는 다음 단계다. 비밀번호 복구 UI는 아직 없다.

78개 Vitest + 배포 계약3개·build/format/E2E타입 통과, lint exit0이지만 기존WorkoutView effect 경고6개는 남는다. pages:verify는 읽기 전용으로 실제 헤더/파일 hash를 검사하며 네트워크/불일치에 실패한다. 실제 iPhone/과학 검토/운영 복구 관문은 유지한다. 다음 독립 구현은 공개 콘텐츠 registry/검토 gate와 기록 편의의 남은 범위다. 아래 증분은 당시의 상태다.


2026-10-04 / app0.2.0 / PRD0.7.2 / schema2. `app/package.json`·lockfile의 실제 버전이다. [전체 UI 변경](design-system.md) · [최신 검사](../../raw/research/2026-10-04-e2e-harness-verification.json).

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
| 자동 DOM | @testing-library/react16.3.3, dom10.4.2, user-event14.6.7, jsdom27.4.0 | ui17, 실제 components/Dexie·키보드/완료/오류/복원/필터/연속 선택 |
| 자동 browser | @playwright/test1.63.0, Chromium153.0.8010.12/rev1243, WebKit26.6/rev2359 | Chromium9/WebKit7·16개/신규7×3회;187c47c CI3job확인, 새HAR04 local |
| 정적/형식 | oxlint1.86.0, Prettier3.9.9 | lint·format |
| 서버 개발 도구 | Supabase CLI2.119.0, pg8.23.1 | migrations/TLS probe/SQL rollback·허용 목록; 앱 bundle 제외 |
| 타입 | @types/node24.19.1, react19.3.0, react-dom19.3.0 | 빌드 타입 |

기본 검사 환경 Node24.14.1/npm11.11.0, CI Node24 major. Next.js/Tailwind/shadcn·추가 chart/LLM runtime은 사용하지 않는다. 볼륨은 순수 TypeScript·실제 데이터 SVG·Mantine controls/Table이다. Playwright runner·trace·CI설정/로컬실패probe를 추가했고 CUA 수동관찰과 구별한다. browser 로컬 Node25.8.1, 기존빠른검사 Node24.14.1·CI Node24이며 이전187c47c Linux CI는 확인했고 새 HAR04 CI/실제Safari는 미확인이다. 개발용 `app/tests/harness/responsive.html`은 실제 iframe 폭을 선택하는 수동 fixture로 production entry/public asset이 아니다.

## UI·글꼴과 경계

CONV-0008의 부분 Mantine/Spoqa를 CONV-0010에서 전체 Mantine/Geist로 바꾸고, CONV-0011에서 차콜/노란 강조로 조정했다. 주요 UI 스타일은 `src/theme.ts`·Mantine props/styles API, document/safe-area·fixed bottom/skip link·SVG 기하는 `src/index.css`다. 하단 메뉴는 모든 폭에 유지한다. [기준](design-system.md).

Geist5개 normal variable WOFF2 subset 합계76.41KB, dist/assets 번들·PWA precache. `public/fonts/geist/LICENSE`에 OFL을 포함하고 종전 Spoqa3개 WOFF2/라이선스는 앱에서 제거했다. 과거 vault 자료는 보존한다. 설치 metadata에 Hangul subset이 없어 시스템 한글 글꼴로 fallback한다. 모든 한글이 Geist로 렌더된다는 뜻이 아니다. CDN 요청은 없으며 이번에 실제 iPhone/offline 폰트 재실행을 검증하지 않았다.

기존 CSP는 self fonts/scripts·정확한 Supabase connect-src·Mantine 동적 style의 unsafe-inline 정책을 유지한다. 운영 `_headers` 적용은 아직 배포 검증 전이다.

## 빌드·검사·데이터

CONV-0011 색상 증분에서는 패키지/버전 추가 없이 theme·표면/강조·PWA 자산을 수정했다. [당시 실행](../../raw/research/2026-10-04-charcoal-theme-verification.json). 이번 HAR03/05 증분에서는 개발용 Playwright만 추가했다.

현재 앱 진입97.24KB/30.50KB gzip, Mantine CSS233.86KB/34.17KB gzip, production precache25개/1277.55KiB, E2E precache25개/1277.47KiB. 청크 분리는 전체 다운로드 감소 보장이 아니다. 호스트에는 app/dist만 제공하며 vault/서버 secrets/개인 backup은 포함하지 않는다.

최신 unit21/integration26/ui17·64개/14파일, lint 경고0/build/E2E typecheck/format. DOM의 no-layout stubs/FileReader test 보완과 실제 browser layout을 구별한다. owner/schema/계산/RPC 유지, 백업 파일 직렬화/byte 검사·quota 안내·업데이트 안내 위치 수정. [최신 실행](../../raw/research/2026-10-04-e2e-harness-verification.json) · [Supabase](supabase-integration.md) · [하네스](../operations/testing-harness.md).

## CONV-0012 적용 범위

NativeSelect native popup을 제거하고 Mantine Select/Combobox로 통일했다. Accordion default/heading·filled 입력·Paper/Drawer theme으로 여백/표면을 관리한다. [현재 재감사](component-review.md). 버전/새 runtime dependency 변경은 없다. model-viewer/Three.js/React Three Fiber는 후순위 비교 후보이고 현재 설치된 스택으로 표시하지 않는다. [3D 검토](anatomy-3d-feasibility.md).

## HAR03/05 증분

새 dev dependency는 @playwright/test1.63.0뿐이다. runtime/theme/schema·원격설정은 변경하지 않았다. e2e 전용dist-e2e는 실제Supabase env를 빈값으로 덮어쓰며 운영dist와 분리한다.9과업/27반복·종료수정후9·실패probe를 확인했다. E2E 타입검사·독립 CI/browser명령과 고유실행증거를 추가했다. [새 실행](../../raw/research/2026-10-04-e2e-harness-verification.json).

## HAR04 현재 증분

새 dependency 없음. app0.2.0/schema2 유지. E2E 두build/staticserver·blank nativeDBfixture·quota 합성 주입·실제SW update를 확장했다. production precache25/1278.10KiB, 64개/14파일·browser16/새21회·실패probe. 백업은 compact JSON/파일10MiB 양방향 검사다. [자세한 계약](../operations/storage-recovery-harness.md). 위 HAR03의9/27회 단락은 이전 생성 당시 이력이다.

[최종 check/빌드 정밀값](../../raw/research/2026-10-04-storage-recovery-final-check.json): 앞선 원본의1278.09는 안내 이동 전 build값이며 final1278.10으로 append 정정했다. 검사 숫자는 유지한다.

## CONV-0015 배포 도구

Wrangler4.147.0을 devDependency로 pin했다(Node >=22; 현재 프로젝트 Node24 기준). Cloudflare official skills16/MCP5는 사용자 개발 환경에만 등록하며 앱 runtime/bundle에 넣지 않는다. Pages config와 actual-dist 검사는 연결 준비이고 원격 인증/배포는 별도다. [연결 운영](../operations/cloudflare-setup.md).

## CONV0022 구현/검토 — 2026-10-04

34종목/바벨18·큰 부위 아래 세부 분류/장비·별칭 필터와 사용자 추가 선택을 적용했다. 기본1분·즐겨찾기3~4개·완료 자동 시작·pause/resume/stop·deadline 재실행·profile/outbox/백업 보존을 구현했다. 다섯 H1 outline을 제거하고 programmatic focus는 유지했다.98개/19파일·Node8·전체30browser/최종문구6·build/types/format/artifact25, lint기존6경고. 실제 좁은 화면에서 문구 잘림을 찾아 수정했다. [계약/실행](../operations/catalog-rest-timer.md).

GitHub source=Jeongjibsa/lightweight·main·자동 배포 활성화를 읽었고 dependency 설치/Node24·승인된 production 공개 연결/빈 preview를 보완했다. 새 commit의 자동 Git 배포/원격 CI는 기록 시점 별도다. [배포 운영](../operations/pages-git-integration.md). Google OAuth는 가능하며 현재providerOFF/callback없음·credential/동일UID 연결/가입 차단·실기기 복귀가 필요하다. [검토](google-oauth-review.md). 과학 승인 콘텐츠0개/실제 운동·새 기기/나머지 G3/메일·운영·파일럿/P2 관문과 다음 운동 후 사용자 확인 일정은 유지한다.

## CONV0025 기존 스택 내 UX 증분

신규 dependency/schema 없이 Mantine9.6.3 Accordion/keepMounted·Portal/ActionIcon/Paper/Drawer/Modal과 browser IntersectionObserver/passive scroll/resize를 사용했다. [계약](../operations/workout-collapse-timer.md). AlarmKit/ActivityKit/WidgetKit/Web Push library는 설치/구현하지 않았다.
