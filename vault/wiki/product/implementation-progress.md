---
type: "Implementation Report"
title: "로컬 PWA 구현 결과와 다음 작업"
description: "실제로 구현/시험한 범위와 미완료 과학·계정·실기기·운영 검증을 기록."
tags:
  - "product"
  - "implementation"
  - "testing"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T10:18:25+09:00"
sources:
  - id: "responsive-local-request"
    resource: "../../raw/conversations/2026-10-03-006.md"
    title: "반응형·사용자별 설정·로컬 구현 요청"
  - id: "local-contract"
    resource: "implementation-contracts.md"
    title: "로컬 구현 계약"
  - id: "technical"
    resource: "../sources/SRC-034-responsive-local.md"
    title: "기술 근거"
  - id: "browser-restore"
    resource: "../../raw/research/2026-10-03-browser-restore-verification.json"
    title: "빈 브라우저 저장소 복원 추가 검증"
  - id: "harness-audit"
    resource: "../../raw/research/2026-10-04-harness-audit.json"
    title: "감사/재검사"
  - id: "harness"
    resource: "../operations/testing-harness.md"
    title: "구조/개선"
  - id: "cloud-request"
    resource: "../../raw/conversations/2026-10-04-008.md"
    title: "요구"
  - id: "cloud-verification"
    resource: "../../raw/research/2026-10-04-mantine-supabase-verification.json"
    title: "이번 검사"
  - id: "cloud-contract"
    resource: "supabase-integration.md"
    title: "실제 계약"
  - id: "dom-check"
    resource: "../../raw/research/2026-10-04-dom-harness-verification.json"
    title: "DOM 검사"
  - id: "volume-check"
    resource: "../../raw/research/2026-10-04-volume-history-verification.json"
    title: "볼륨/후보 구현 검사"
  - id: "volume-final"
    resource: "../../raw/research/2026-10-04-volume-history-final-verification.json"
    title: "최종 설명/코드 검사"
  - id: "settings-loop"
    resource: "../../raw/research/2026-10-04-settings-restore-loop.json"
    title: "복원 입력 회귀/수정"
version: "0.2.0"
change_id: "CHG-0008"
---

# 로컬 PWA 구현 결과와 다음 작업

## 최신 복원 입력 회귀 수정 — 2026-10-04

볼륨 기능78e5cb1 local commit 후 LOOP-SETTINGS-RESTORE-01을 닫았다. 실제SettingsView/Store의 파일복원 직후 이전 입력 잔류를 재현하고 profile payload가 바뀌면 form을 갱신했다. same-owner/revision 복원→재저장 보존, unrelated 기록 갱신의 미저장 초안 보존2과업. unit19/integration25/ui8·52개/11파일·lint/build/format 통과. 최종PWA update/리포트와320/375/1440px도 확인했다. [원본](../../raw/research/2026-10-04-settings-restore-loop.json). [루프 설명](../operations/loop-engineering.md). 실제 browser 파일복원은 수정 후 반복하지 않았고 Auth/iPhone/runner·CI 관문은 남았다.

## 이전 볼륨/오늘 후보 증분 — 2026-10-04

PRD0.5.0의 REP-04/05/06을 구현/검증했다. 일별/같은 운동 조건·28/84/전체·본세트/반복/시간/중량 기록량, 실제 날짜 간격 SVG·N/A 선 끊기·유효1점·숫자 표/coverage·변화율 보류, kg/lb·한 손/머신/좌우 구분과 owner/준비/삭제/미래 제외. 현재 live session에서 계산해 편집/완료 취소·DB 재개·삭제·백업 복원 후 재계산한다. schema/RPC 변경 없음.

오늘 후보는 최근28일 종료 본세트와 같은 설정·장비에 맞는 본인 루틴의 최근 수행 순서를 참고한다. 현재 계획과 과거 실제/partial을 구분하고 자료 부족/오늘 수행/active는 보류한다. 명시 선택만 시작하며 자동 증량/회복/최적량 판단은 없다. SCI-03B/검토된 새 운동 추천은 후속이다.

unit19/integration25/ui6, 합계50개/10파일·lint 경고0/strict build/format 통과. precache23개/1644.45KiB. 수치·기간·조건/0/N/A·설정/장비/owner/오늘 보류, Store 재계산과 DOM 필터/명시 선택을 검사했다. 수동 CUA의 가짜4174에서 복원→28/84→시간/한 손/스쿼트→후보B 계획3/실제partial2→선택/active보류→reload 확인, 320/375/1440px 리포트 page overflow0·표 내부 가로 스크롤, console0. 마지막 label 분류/중복 구분은 이후 코드 검사로 확인했다. [원본](../../raw/research/2026-10-04-volume-history-verification.json).

기존 누적 구현9cccb4f, 계획/지침897f44d, HAR-02 초기ead48d7을 local commit했다. 실제 Auth·browser runner/CI·iPhone/HTTPS/근거 공개 관문은 남았다. browser 복원 중 이전 설정 입력값 잔류를 발견했으며 위 최신 복원 입력 회귀 증분에서 수정했다.

## 이전 HAR-02 증분 — 2026-10-04

DOM 통합 project/라벨 기반 입력·오류·재시도 과업3개를 추가했고 unit6/integration24/ui3·합계33개/5파일과 lint/build/format 통과. HAR-02 in_progress, 실제 browser/E2E/계정 준비는 남았다. [실행 원본](../../raw/research/2026-10-04-dom-harness-verification.json). 계획/commit 지침은897f44d로 보존했다.

## 이전 Mantine/Supabase 증분 — 2026-10-04

app **0.2.0** / PRD **0.4.0** / IndexedDB **schema2**. Mantine UI·Spoqa Han Sans Neo와 Supabase Auth/DB 연결 증분을 구현했다. 상세 버전은 [기술 스택](technology-stack.md), 연결/권한/전송 계약과 계정 준비는 [Supabase 문서](supabase-integration.md)를 따른다.

| 구현/검사 | 실제 결과 | 한계 |
|---|---|---|
| UI/글꼴 | Provider/theme·입력/모달/버튼·계정/클라우드 UI, 공식 WOFF2/OFL·PWA 캐시 | 기존 화면 CSS 유지, 모든 요소 치환 아님 |
| Auth/기기 DB | 등록 이메일/비밀번호·세션 갱신·계정 UUID별 DB/화면 재생성 | 실제 human login 미시험; password는 초기 구현 선택 |
| 원격 기록 | private3테이블·migration/RLS/grants·invoker RPC·허용 목록·명시 소유자 검사 | 자동 per-record sync/병합 미구현 |
| 수동 snapshot | operation 재시도·서버 revision 충돌 거부·캡처 ACK·교체 전 recovery/로컬 서명 | 실제 로그인→다기기 흐름 미시험 |
| 가입 설정 | 사용자 승인 후 공개 가입 OFF, Auth API signupDisabled=true | 본인 Auth 계정 등록/허용 목록 추가 필요 |
| 코드 검사 | format/lint/strict build 통과, unit6+integration24/4파일 | DOM/E2E runner·coverage·외부 CI 없음 |
| 서버 검사 | 원격 rollback SQL16개 통과; publishable-only read/write HTTP401/42501; TLS CA/hostname 확인 | SQL JWT claim≠실제 Auth access token |
| Advisor | security/performance lints 빈 배열, 테스트 잔여0 | 전체 보안 인증 아님 |
| 브라우저 | 새4174 origin의 가짜 설정 저장/reload/update, 320/375/1440px 설정·관찰 루틴/모달 overflow 없음, font16px, 초점 trap/Escape/복귀, console0 | 전체 과거5화면 matrix 재실행 아님, 실제 iOS/Safari 미시험 |
| 루프 사례 | 모달 조건부 unmount 후 BODY로 초점 유실→opener 복귀 수정→같은 과업 확인 | 자동 UI regression으로 아직 고정하지 않음 |

기본 검사 Node24.14.1/npm11.11.0. build precache23개/1623.05KiB. [이번 실행 원본](../../raw/research/2026-10-04-mantine-supabase-verification.json). 예전4173의 진행 운동을 종료/삭제하지 않고 새4174에서 가짜 데이터를 검증했다. 두 주소는 다른 기기 저장소다. 4173은 운동과 저장을 마친 뒤 업데이트 안내를 적용하면 된다. 기록은 자동으로 다른 origin에 옮겨지지 않는다.

단계 상태: M3/SYNC-01~05 **in_progress**, HAR-01 **done**, HAR-04 migration·HAR-06 원격 권한 일부 **in_progress**. G2~G5는 전체 미통과다. 다음은 실제 승인 계정·A/B Auth/복원 흐름과 HAR-02/03/05 자동 회귀. 로컬 입력 편의·개인화·검토된 콘텐츠/실기기·배포·식단은 남았다. 공개 배포·메일 발송·커밋/푸시는 수행하지 않았다.

## 이전 로컬 증분·감사 기록 — 생성 당시 상태

아래 app0.1.0/schema1·프로젝트 없음·검사16개 표기는 그 당시 결과를 보존한 이력이다. 현재 판단은 위 표와 연결 문서를 따른다.


2026-10-03 / app 0.1.0 / PRD 0.3.0 / IndexedDB schema 1. 사용자 요청으로 로컬 구현에 착수했다. 운동 MVP 전체, 실제 iPhone 제공, 클라우드 연동 완료를 의미하지 않는다. 가짜 데이터만 시험했다.

## 이번 구현

- 반응형 5개 화면: 오늘·운동 탐색·루틴·리포트·설정. 작은 화면 하단 메뉴와 큰 화면 사이드 메뉴.
- 목표·주당 최소/최대 횟수·분할·시간·장비·단위·시간대의 프로필별 입력/설정/전환. 새 사용자의 목표/횟수/분할 미설정.
- 12개 기록용 초안 종목의 검색/분류·사용자 추가 종목, 루틴 작성/복사/정렬/편집/삭제, 세션 시작 시 계획/설정 스냅샷.
- 중량/횟수/시간·준비/본세트·좌우·선택 RIR·완료/완료 취소·세트 추가·부분 종료·진행 세션 재개·휴식 타이머.
- Dexie 기록/outbox 원자 저장·소유자 검증·tombstone, JSON 내보내기/미리보기/전체 교체 복원.
- 완료 본세트 입력 행과 분류별 주간 요약. 직접/간접 근육 세트·효과/골격근량 추세·처방은 미제공.
- PWA manifest/아이콘/캐시·안전한 업데이트 안내, 정적 보안 헤더, CI 워크플로 설정.

코드 경로: `app/src/App.tsx`, `app/src/components/`, `app/src/domain/models.ts`, `app/src/data/local/store.ts`, `app/src/data/local/store.test.ts`, `app/vite.config.ts`, `app/public/_headers`, `.github/workflows/check.yml`. 실행 안내: `app/README.md`. 호스트 산출물: `app/dist`. vault 내부 링크는 지식 번들 밖으로 연결하지 않으므로 코드 경로는 텍스트로 적는다.

## 실제 검사

환경: Node 24.14.1 / npm 11.11.0 / macOS 로컬 / Playwright CLI Chromium 154.0.8037.97. 주요 의존성은 `app/package-lock.json`에 고정했다. React 품질 점검 스킬에 따라 컴포넌트·hooks·라벨/초점·렌더 순수성·중복 상태·아이콘 import를 검토하고 lint 경고를 수정했다.

| 검사 | 결과와 범위 |
|---|---|
| `npm run lint` | 통과, 오류/경고 0 |
| `npm run build` | strict TypeScript + Vite build 통과, PWA precache 14개 파일 생성 |
| `npm run test` | Vitest 16개 통과: 설정/분할 독립, 소유자 경계, 중복 시작/완료, 결측/0, 기록/outbox 롤백, 과거 스냅샷, DB 재연결, 새 저장소 복원, 잘못된/충돌 백업, 본세트 집계, 날짜/단위 |
| 브라우저 설정/프로필 | A/B 각각 다른 목표·횟수·분할·단위 저장, 새로고침과 전환 후 보존, B에 A 기록 미노출 |
| 브라우저 기록 | 루틴 작성→시작→빈 완료 거부→0kg/10회 완료, 20kg/8회 추가 기록, 미완료 포함 일부 종료, 리포트1회/완료2/계획3 확인 |
| 오프라인 | SW 등록/제어·캐시 준비 후 네트워크 차단→재시작→재개→추가 세트 입력→종료→리포트 확인 |
| 백업 UI | JSON 다운로드→파일 선택→개수/교체 미리보기→같은 프로필 복원, 설정/기록 보존; 빈 별도 DB 복원은 fake-indexeddb 계약 시험 및 별도 Chromium 브라우저 세션 UI로 확인 |
| 업데이트 | 새 빌드의 업데이트 안내, 진행 중 적용 비활성화, 빈 테스트 운동 취소 후 적용, 프로필/루틴/완료 기록 보존 |
| 반응형 | 5개 주요 화면 × 320/390/440/768/1024/1440px, 운동 기록 화면의 같은 폭 및 844×390 가로에서 수평 넘침 없음 |
| 로컬 헤더 | `curl -sI http://127.0.0.1:4173/`로 CSP·nosniff·Referrer/Frame/Permissions 확인; 운영 호스트 미설정 |
| 브라우저 console | 업데이트 후 오류/경고0 확인 |
| 문서 | 아래 vault 구조·링크·불변 해시 검사 보고서에서 실제 결과 확인 |

화면/다운로드/임시 가짜 백업은 추적 제외된 `output/playwright`와 `.playwright-cli`에 보관한다. WebKit/실제 Safari, iOS 홈 화면 설치·키보드·잠금·저장소 보존, 200% 확대·전체 접근성·실제 운영 헤더/메일/계정·외부 CI는 아직 미시험이다. 폭 시험은 WCAG 전체 인증이 아니다.

## CHG-0006 저장 후 추가 검증

별도 새 Chromium 세션의 빈 IndexedDB에서 가짜 백업을 가져와 적용하고 목표/횟수/분할·루틴1개·운동1개·완료2/계획3 리포트가 복원된 것을 확인했다. console 오류/경고0. [추가 검증 기록](../../raw/research/2026-10-03-browser-restore-verification.json). CHG-0006의 생성 당시 미시험 표기는 보존하고 현재 결과만 추가했다. 제품 요구/PRD 버전은 변경하지 않는다.

## 2026-10-04 하네스 감사

현재16개 테스트/config/CI를 감사하고 lint/test/strict build를 재실행해 통과했다. 이번에는 browser를 다시 실행하지 않았다. 현행은 한 파일의 unit/fake IndexedDB integration 혼합이며 이전 Chromium 검증은 저장소 E2E/CI로 고정돼 있지 않다. [현재 하네스](../operations/testing-harness.md) · [실행 원본](../../raw/research/2026-10-04-harness-audit.json). 큰 백업 제한 비대칭은 대용량 미재현 확인 후보다.

[남은 작업](remaining-work.md)과 [루프 운영](../operations/loop-engineering.md), HAR-01~06을 제안했다. 앱0.1.0/schema1 유지, 새 테스트/spec·하네스 구현·새 의존성 설치·원격 CI·실기기/배포는 수행하지 않았다. 기존 브라우저 결과와 CHG-0006의 작성 시점은 보존한다.

## 단계별 상태와 다음 순서

| 범위 | 현재 | 다음 확인 |
|---|---|---|
| M0 계약 | 로컬/프로필 계약 작성, 원격 계약은 미완료 | 서버 idempotency/base_revision·충돌·삭제/복원 계약 |
| M1 기반 | 로컬 앱·PWA·검사 구성 구현/시험 | 외부 CI 실행, 실기기/다른 엔진 |
| M2 로컬 기능 | 핵심 기록/루틴/백업 경로 구현 | 이전 세션 값/재사용·종목 대체·종료 기록 편집, 실제 기기 과업 |
| M2 과학 시각 | 개념도/검토 전 라벨만 구현 | 검토된 근육 범위·수행 그림/권한·텍스트 |
| M3 계정/동기화 | 미구현, 프로젝트 없음 | Supabase 프로젝트 준비 후 Auth·RLS/grants·로그인/메일·기기 이관·전송/충돌·A/B/API 시험 |
| M4 리포트 | 로컬 사실 집계 초안 | 직접/간접 계약·동일 조건 추세·충분성/근거/입력 버전·다음 행동 |
| M5 추천/티어 | 미구현 | 전문/해부학/콘텐츠 검토와 공개 등록부, 조건별 규칙 |
| M6~M8 | 계획 유지 | HTTPS 배포/실기기→본인 관찰/지인→식단 |

현재는 G1 중간 시안의 로컬 증분이다. G2~G5는 통과하지 않았다. 서버 프로젝트가 없어도 로컬 미완료 기능과 근거 콘텐츠 검토 작업은 진행 가능하다. 로그인·RLS·실제 클라우드 권한 검증은 연결 준비 이후 진행한다.

## Related

[구현 계약](implementation-contracts.md) · [작업계획](implementation-plan.md) · [백로그](implementation-backlog.md) · [문서 검증](../../history/validation-latest.json) · [CHG-0006](../../history/changes/CHG-0006.md)

최종 설명 검토: 이력 검토를 건너뛴 active/오늘/설정 보류에는 제외0개 대신 미검토를 표시한다. 최종50개/10파일·l int/build/format 통과, precache23개/1644.45KiB. [마지막 실행](../../raw/research/2026-10-04-volume-history-final-verification.json).
