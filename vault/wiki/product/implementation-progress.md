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
  at: "2026-10-04T20:22:34+09:00"
sources:
  - id: "cf-recheck"
    resource: "../../raw/research/2026-10-04-cloudflare-setup-recheck.json"
    title: "Cloudflare 공식 설정과 OAuth 재확인"
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
  - id: "design-request"
    resource: "../../raw/conversations/2026-10-04-010.md"
    title: "전체 Mantine/Geist/하단 UX 요구"
  - id: "design-verification"
    resource: "../../raw/research/2026-10-04-mantine-geist-design-verification.json"
    title: "현재 UI 검사"
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
  - id: "profile-backup-loop"
    resource: "../../raw/research/2026-10-04-profile-backup-dom-loop.json"
    title: "HAR-02 최초 실패·실제 수정·59개 검사"
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
  - id: "gzip"
    resource: "../operations/compressed-backup.md"
    title: "압축 복구 계약"
  - id: "gzip-check"
    resource: "../../raw/research/2026-10-04-compressed-backup-verification.json"
    title: "실행"
version: "0.3.3"
change_id: "CHG-0017"
---

# 로컬 PWA 구현 결과와 다음 작업

## CONV-0016 Cloudflare 개발 환경 설정 — 2026-10-04

공식 installer로 스킬16개를 갱신하고 기존 MCP5개 URL/enabled를 확인했다. Codex main MCP OAuth login은 exit0/성공, 현재 main 계정 읽기는 HTTP200·public docs 검색은 성공했다. 사용자가 cf 생략·기존 Wrangler 유지를 선택했다. 특화 MCP3/Wrangler 인증·원격 배포는 미검증이며 앱 Auth/iPhone·SCI 관문은 유지한다. [실행](../../raw/research/2026-10-04-cloudflare-setup-recheck.json) · [운영](../operations/cloudflare-setup.md). 이번 환경/문서 작업은 앱 코드나 검사 결과를 변경하지 않았다. 아래는 이전 증분 시점의 상태다.

## 압축 백업 후속 증분 — 2026-10-04

CONV0015의 남은 순차 작업에서10MiB 초과 기록의 독립복구를 구현했다. 기존 JSONv1·DB schema2·cloud snapshot10MB는 유지하며 큰 파일은gzip output10MiB/expanded64MiB로 제한해 모든 필드를 보존한다. unsupported API/손상/잘림/과도팽창·schema 오류는 DB 적용 전에 거부한다. 공통 writer를 기기/교체 전 복구 export에 적용했다.

66개·lint/build/E2E typecheck/format/artifact24 통과. browser18(Chromium10/WebKit8)·새2×3회6회,24,000세트 실제 gzip download→새context restore/reload·CRC 손상 때5table 동일을 확인했다. 최초2 실패는 fixture의tables 오참조였으며 원본 증거를 보존했다. [계약](../operations/compressed-backup.md)·[실행](../../raw/research/2026-10-04-compressed-backup-verification.json).

64MiB 초과/분할·actualiPhone/physical quota/eviction·실Auth/다기기 서버복구는 남아 HAR04/LOG06을 전체done으로 표시하지 않는다. Cloudflare 신규 OAuth는 응답 없이 만료했으며 승인 질문 pending/미배포다.67ec882의 새CI3job success를 확인했다. 다음은 이전 값/운동 재사용·종목 대체·종료 기록 수정이다.


## CONV-0015 Cloudflare 연결과 순차 진행 — 2026-10-04

Cloudflare 공식 설정과 남은 구현의 commit/push를 사용자가 요청했다. 호스팅 제공자는 Cloudflare 방향으로 정했으며 Pages Direct Upload·lightweight-training 고정 project/main은 구현 선택이다. 공식 skills16/MCP5 등록과 Wrangler4.147.0/artifact gate를 준비했다. **새 OAuth 권한 승인·원격 배포는 pending**이며 기존 plugin account 조회 성공과 구별한다. 자동 검토의 broad OAuth Continue 거부를 우회하지 않고 full/Pages 제한 권한 선택을 요청했다. [운영](../operations/cloudflare-setup.md).

a2b3f9f push 뒤 새 [GitHub CI3job](../../raw/research/2026-10-04-cloudflare-setup.json)이 모두 성공했다. 기존64개·lint/build/E2E typecheck와 실제 dist24파일 검사를 확인했다. main 반영·후속 배포는 현재 요청 범위에서 진행한다. 운동 MVP 전체는 미완료이며 실제 Auth/다기기·iPhone·SCI·콘텐츠/3D/식단의 관문은 유지한다. usage limit은 발생하지 않았고 실제 제공되는 기능 외 quota reset을 실행하지 않았다.


## HAR04 / 외부 CI 현재 증분 — 2026-10-04

기존187c47c를 codex/e2e-harness에 push했고 [GitHub 3job](../../raw/research/2026-10-04-github-ci-37184261544.json)이 모두 성공했다. 실패 trace/화면/console/환경을 실제 다운로드해 확인하여 HAR05를 done으로 갱신했다. 이 결과는 이전187c47c이며 아래 새 코드는 아직 GitHub에서 실행하지 않았다.

HAR04에서 실제 큰 Blob을 자체 parser가 거부하는 문제를 재현→compact JSON/입출력10MiB byte 계약으로 수정했다. 초과 파일을 만들거나 잘라내지 않고 기존 기록을 보존하며 안내한다. 실제 waiting SW 안내가 운동 종료 버튼을 막는 문제도 재현→Mantine 안내를 main 상단 흐름으로 수정했다.

unit21/integration26/ui17의64개/14파일, lint 경고0/build/E2E typecheck/format 통과. 실제 browser16개(Chromium9/WebKit7), 새7개만3회21개 반복과 실패probe 통과. 14,400세트7,778,029byte 파일의 실제 다운로드/복원·10MiB+1 거부, native schema10→20 보존, quota 오류 주입 후5테이블 rollback/재시도1회, 실제SW v1→waiting v2→적용/offline과5테이블 동일을 확인했다. [불변 실행](../../raw/research/2026-10-04-storage-recovery-verification.json) · [자세한 하네스](../operations/storage-recovery-harness.md).

HAR04는 in_progress다. 실제iPhone/physical quota/eviction·10MiB 초과 파일의 독립 복구/분할 정책·실계정/다기기 복구가 남았다. Q12/15·SCI/REL/운영 관문을 유지한다. PRD0.7.2 PATCH·app0.2.0/schema2·운동 먼저/식단·3D 후순위 유지. 아래는 이전 증분 이력이다.

## 이전 HAR-03/05 증분 — 2026-10-04

`codex/e2e-harness`에서 @playwright/test1.63.0 runner·독립 production build/preview·빈 context·실제 UI 입력/파일 다운로드/복원·Chromium SW 오프라인을 추가했다. **Chromium5/WebKit4의9과업을 세 번씩27회 통과**했고, 종료 처리 수정 후9회 재확인했다. Vitest59개/13파일·lint 경고0/build/E2E typecheck/format도 통과했다. [불변 실행](../../raw/research/2026-10-04-e2e-harness-verification.json).

HAR-03은 로컬 runner 기준 done이다. HAR-05는 engine별 CI·실패 trace/화면/console/환경·고유 실행ID/코드 해시·7일보관 설정과 로컬 실패 probe를 완료했으나 **새 GitHub workflow 실행은 미확인이라 in_progress**다. 의도적 실패1개와 runner exit1을 부모 probe가 검증한 뒤 exit0으로 끝내며 정상9과업에는 probe를 넣지 않는다. E2E06은 다섯 화면×네 실제 폭/정보창 키보드·Escape focus 부분만 확인했다.

개인 기록·Auth·Supabase 외부 요청 없이 별도4188/빈 브라우저 context에서 가짜 자료만 생성했다. desktop WebKit은 실제 Safari/iPhone이 아니며 PWA는 Chromium에서만 검사한다. 실제 Auth/과학 콘텐츠/기기·HTTPS 관문과 HAR04 업데이트/quota/큰 백업은 남았다. PRD0.7.1은 현황 정정 PATCH, app0.2.0/schema2·기능 요구는 유지한다. 아래 문단은 이전 증분 이력이다.

## HAR-02 후속 — 로컬 프로필/파일 재시도 완료

CONV-0012의 순차 작업으로 실제 App/SettingsView·Mantine·Dexie/liveQuery를 연결했다. 백업 읽기 실패 후 같은 파일 재선택, A→B→A 설정/루틴 보존, 저장 중 프로필 전환/생성 차단, B 초기화 완료/조회 지연 중 A 입력 비노출의4개 DOM 계약을 추가했다. 세 제품 실패를 먼저 재현하고 FileButton resetRef·pending guard·workspace owner 확인으로 수정했다. [최초 실패/검사 원본](../../raw/research/2026-10-04-profile-backup-dom-loop.json).

현재 **unit19/integration25/ui15·59개/13파일**, lint 경고0/build/format:check 통과. 전용4177 가짜 화면에서 잘못된 파일의 한국어 오류→같은 경로의 정상 파일 재선택→복원 미리보기·취소를 확인했고,390px 복원 버튼 글자 잘림도 responsive SimpleGrid로 수정/재캡처했다. 실제 복원/DB 보존은 DOM 계약에서 확인했다. 본 후속 browser 실행에서는 미리보기에서 취소했다.

HAR-02의 **로컬 파일·프로필 DOM 부분**은 완료했으며 실제 Auth 전환은 남아 전체 상태를 in_progress로 유지한다. Auth client와 SW hook은 test-only 대체이며 실제 로그인/RLS/오프라인을 시험한 것이 아니다. 다음 순서는 HAR-03/05 자동 browser/CI 증거, 이어 HAR-04·실계정 SYNC·콘텐츠 SCI·실기기 REL 관문이다. PRD는0.7.0이고 기능 요구/데이터 schema/원격 설정 변경은 없다.


## CONV-0012 현재 재점검

[UI-03 재감사](component-review.md)에서 공식 Mantine 예시와 실제 페이지 캡처를 비교해 Select/Accordion·여백·표면/편집창을 수정했다.55개·lint/build/format·20폭/화면 overflow0. FR-17 [3D 검토](anatomy-3d-feasibility.md)는 기술/자산 관문 문서만 완료하고 VIS-3D-02/03은 P2후순위다. 이 UI 감사 후 HAR-02 로컬 파일 재선택/프로필 DOM 보강을 위 후속 증분에서 마쳤다. 다음은 HAR-03/05 자동 browser/CI·실계정 SYNC·콘텐츠 SCI·실기기 REL 관문이다. 운동 MVP 전체 완료로 표시하지 않는다.

## 최신 색상 증분 — 2026-10-04

PRD0.6.1 / CONV-0011. 같은 `codex/mantine-blue-dark` branch에서 Mantine UI 다크/Monokai 참고 차콜·노란 강조색을 적용했다. 카드/입력/선택/그래프·PWA theme-color/아이콘까지 조정했다. 주요 filled 버튼·ThemeIcon의 전경은 검은색이다. 데이터/schema/권한/계산은 변경하지 않았다.

기존55개(19 unit/25 integration/11 UI)·lint/build/format 통과. 가짜4176의 오늘·리포트390px/설정320px/오늘1440px 가로 넘침0, computed colors·console0 확인. 실제 iPhone/전체 대비/Auth/오프라인 업데이트는 이번 재검증 범위 밖이다. [실행](../../raw/research/2026-10-04-charcoal-theme-verification.json) · [현재 디자인](design-system.md). 아래 파란 화면/25조합은 이전 증분 이력이다.

## 이전 전체 UI 증분 — 2026-10-04

PRD0.6.0 / app0.2.0 / schema2 / branch `codex/mantine-blue-dark`. 전체 Mantine·Geist/한글 fallback·blue-dark·전 폭 하단탭·내용 높이 bottom sheet·빠른 시작/종목 추가/연속 루틴 선택·sticky 운동 dock을 적용했다. 기존 partial 적용 범위는 이전 이력으로 유지한다. [디자인](design-system.md) · [감사](design-audit.md).

unit19/integration25/ui11·55개/12파일, lint 경고0/build/format. fake4176에서40kg×10 완료/종료→400kg·회 report와 연속루틴/설정 저장, 다섯 화면×320/375/390/768/1440px overflow0·nav 최소56.79×60. [불변 관찰](../../raw/research/2026-10-04-mantine-geist-design-verification.json). 이번에 production offline/update·실제 iPhone·Auth E2E/CI를 통과했다고 기록하지 않는다. 아래 이전 검증/숫자는 당시 이력이다.

## 이전 복원 입력 회귀 수정 — 2026-10-04

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

- 반응형 5개 화면: 오늘·운동 탐색·루틴·리포트·설정. 당시 작은 화면 하단 메뉴/큰 화면 사이드 메뉴였으며 CONV-0010에서 전 폭 하단으로 변경했다.
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
