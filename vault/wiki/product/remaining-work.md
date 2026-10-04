---
type: "Remaining Work"
title: "현재 구현에서 운동 MVP까지 남은 작업"
description: "구현/검증/미완료를 구분하고 하네스부터 데이터·개인화·근거·실사용까지 순서를 정리한다."
tags:
  - "product"
  - "implementation"
  - "quality"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T20:32:03+09:00"
sources:
  - id: "cf-recheck"
    resource: "../../raw/research/2026-10-04-cloudflare-setup-recheck.json"
    title: "Cloudflare 공식 설정과 OAuth 재확인"
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-007.md"
    title: "CONV-0007 원문"
  - id: "progress"
    resource: "implementation-progress.md"
    title: "현재 증분"
  - id: "backlog"
    resource: "implementation-backlog.md"
    title: "세부 작업/의존성"
  - id: "harness"
    resource: "../operations/testing-harness.md"
    title: "검증 개선"
  - id: "cloud-request"
    resource: "../../raw/conversations/2026-10-04-008.md"
    title: "이번 요구"
  - id: "cloud"
    resource: "supabase-integration.md"
    title: "현재 연결"
  - id: "volume-mvp"
    resource: "volume-history-mvp.md"
    title: "추가 범위"
  - id: "volume-check"
    resource: "../../raw/research/2026-10-04-volume-history-verification.json"
    title: "볼륨/후보 구현 검사"
  - id: "settings-loop"
    resource: "../../raw/research/2026-10-04-settings-restore-loop.json"
    title: "복원 입력 회귀/수정"
  - id: "design-request"
    resource: "../../raw/conversations/2026-10-04-010.md"
    title: "전체 Mantine/Geist/하단 UX 요구"
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
  - id: "record-reuse"
    resource: "../operations/record-reuse.md"
    title: "재사용 계약"
  - id: "record-check"
    resource: "../../raw/research/2026-10-04-record-reuse-verification.json"
    title: "실행"
  - id: "pages-scope"
    resource: "../../raw/research/2026-10-04-pages-scoped-auth.json"
    title: "Pages 연결 확인"
version: "0.3.3"
approval_status: "proposal"
change_id: "CHG-0017"
---

# 현재 구현에서 운동 MVP까지 남은 작업

## 기록 편의와 Pages 연결 후속 — 2026-10-04

이전 값의 빈 입력 채우기·종료 운동 다시 시작·미완료 종목 교체·종료 세트 명시 수정/CAS를 구현했다. 원본/완료 시각·ID/snapshot 보존, 현재 단위/시간대/설정, 수정 후 즉시 리포트 재계산을 확인했다.72개·browser20·새6회·lint/build/types/format/artifact24 통과. 최초 browser2개와 DOM selector 실패 증거를 보존했다. [계약](../operations/record-reuse.md)·[실행](../../raw/research/2026-10-04-record-reuse-verification.json).

별도 대화의 CONV0016/CHG0017 문서는 유지했다. Wrangler OAuth의 실제 권한은 Pages write/account+user read/offline_access이며 intended account와 일치했다. 신규 프로젝트 생성은 CLI의 자동 Workers 전환 실패 후 직접 Pages 생성으로 바꿨으나, API8000077 이메일 인증 관문으로 거부됐다. 리소스/HTTPS는 미생성·미배포, 사용자 이메일 인증 답변 pending이다. [현재 확인](../../raw/research/2026-10-04-pages-scoped-auth.json). MCP 인증과 배포 CLI 인증을 구별한다.

LOG03/04의 정렬/메모/삭제 복구·장비 식별, 실Auth/동기화·SCI·실제 iPhone·운영 제공 관문은 남는다. 다음은 계정 준비 전 진행 가능한 리포트 관찰/충분성 및 공개 콘텐츠 gate다. 기존 운동 우선·식단/3D 후순위와 app0.2.0/schema2는 유지한다.


## CONV-0016 Cloudflare 설정 확인 후 — 2026-10-04

공식 스킬16개 갱신·MCP5개 등록 확인·main MCP OAuth login 성공과 계정 읽기 HTTP200·public docs 검색을 완료했다. 사용자가 cf 생략·기존 Wrangler 유지를 선택했다. REL-01에는 Wrangler/특화 MCP의 별도 인증 확인·원격 project/고정 origin·HTTPS/운영/앱 Auth 검증이 남아 in_progress를 유지한다. [실행](../../raw/research/2026-10-04-cloudflare-setup-recheck.json). 아래 OAuth pending은 이전 증분 당시 상태다. 기존 미완료 기능/실기기·과학 관문은 유지한다.

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

## CONV-0010→0011 전체 UI 반영

UI-02 전체 Mantine·Geist/차콜·노란 강조·전 폭 하단 메뉴·빠른 접근 증분은 완료했다. 당시55개(19/25/11), lint/build/format 통과. CONV-0010에서 iframe25조합, CONV-0011 색상 수정에서 오늘/리포트390px·설정320px·오늘1440px overflow0를 확인했다. [디자인 감사](design-audit.md). 다음 우선순위는 **HAR-03/05 실제 browser 회귀/CI**, **RESP-01/REL-02 iPhone/Safari 키보드·가로/확대·safe area·설치/오프라인 업데이트**, 실제 계정 준비 후 Auth/다기기·검토된 콘텐츠와 권장량 정책이다. 수동 하네스/모양 개선만으로 이 관문을 완료하지 않는다.


2026-10-04 / app0.2.0. 반응형·사용자 설정·로컬 기록/백업·Mantine/글꼴·Supabase 연결 증분을 구현했다. **운동 MVP 전체와 실제 실사용 관문은 아직 완료하지 않았다.** 실제 상태는 [진행 보고](implementation-progress.md), 작업 계약은 [백로그](implementation-backlog.md)를 따른다.

## 이전 로컬/연결 증분 — 당시 상태

5개 반응형 화면·사용자별 목표/횟수/분할/단위/시간대, 초안12종목·직접 종목·루틴/세트/재개/기초 집계·JSON 복원·PWA 업데이트. Mantine provider/입력/모달/버튼·Spoqa WOFF2/OFL/캐시. 등록 계정 Auth·계정 UUID별 DB·수동 클라우드 snapshot/retry/ACK/CAS/교체 전 recovery. 서버 private3테이블·RLS/execute ACL/owner/허용 목록·공개 가입 차단. unit6/integration24·원격 SQL16·비로그인 HTTP401·lint/build/format 통과.

로컬 프로필은 인증이 아니며 outbox가 생겼다는 사실만으로 클라우드 완료를 표시하지 않는다. 수동 서버 전송은 ACK를 받았을 때 완료다. 자동 레코드 병합·실제 계정 전체흐름은 아직 없다. 초안 그림/분류별 행 수는 검토된 근육 가이드·추천/티어가 아니다.

## 다음 순서와 완료 조건

| 순서 | 남은 작업 | 작업 ID | 완료 조건/현재 제한 |
|---|---|---|---|
| 1 | 백업 한도 초과 독립복구·실기기 저장/업데이트 | HAR-04, LOG-05/06, REL-02 | 로컬16/새21회 보존 검사 완료. gzip 독립복구18/새6회 완료;64MiB초과/분할·실제quota/eviction·iPhone 관문 남음 |
| 2 | 로컬 기록 편의의 다음 증분·남은 Auth DOM | LOG-03/04, HAR-02/06 | 이전 값 재사용/종목 대체/종료 기록 편집을 보존 계약과 함께 진행; 실계정 시험은 준비 후 |
| 3 | 본인 계정 등록/허용 목록·실제 Auth/복원 | SYNC-02/05 | 사용자가 비밀번호/계정 등록, 승인 UUID 허용 후 login→전송→다른 저장소 불러오기; A/B/만료/권한회수/오프라인 확인. 서버 연결정보 부족은 해결됨 |
| 4 | 전송/편집 충돌 흐름 고도화 | SYNC-03/04/05 | manual snapshot CAS/retry는 구현. 두 변경 명시 해결·삭제 재등장·pending 취소/복구·증가한 기록 크기 정책, 필요 시 자동 레코드 sync |
| 5 | 실제 운동 입력 편의 | LOG-03~06, RESP-01 | 이전 세션 재사용·종목 대체·종료 기록 편집·부하/장비 조건·삭제 흐름과 회귀 |
| 6 | 설명 가능한 개인화 | REP-01~03 | 직접/간접·단측/단위·같은 조건 추세·N/A·수정 재계산·입력/규칙/근거 버전·다음 행동 |
| 7 | 과학 시각/운동 설명·루틴 추천·티어 | SCI-01~04, LOG-02 | 전문/해부학/권한 검토→공개 registry→조건/보류/설명→리포트 연결 |
| 8 | HTTPS 배포·실기기·운영 복구 | REL-01~03 | 제공자/도메인/preview 분리·헤더·iOS 설치/키보드/잠금/offline/update·메일/복구 확인 |
| 9 | 본인 관찰→지인 제공 | PIL-01/02 | 실제 불편/누락/해석 문제→수정→회귀, G3/G4 만족 후 계정 독립/복원 과업 |
| 후속 | 식단/영양·선택 AI 설명 | NUT-01~04, AI-01 | 운동 우선 원칙 유지; 음식DB/권한·결측/커버리지·검토 공식/재현 계산 |

HAR03 로컬 회귀를 마쳤다. 다음은 계정 등록 없이 가능한 HAR04 저장 실패·큰 백업·브라우저 업데이트다. 실제 Auth는 계정 준비 후 진행한다. 로컬 입력/계산·SCI 전문 검토도 독립 진행할 수 있다. 개인 계정 비밀번호를 대화로 수집하지 않는다. [계정 준비 절차](supabase-integration.md)를 문서화했다. Q-15 로그인/복구/메일, Q-08/16/17 운영비/도메인/접근, Q-12 지원 iOS/실기기, Q-01 경험/장비/시간, Q-06 검토 역할은 필요한 단계에 정한다.

## CONV-0009 이후 실제 다음 묶음

HAR-02 초기 DOM·REP-04/05/06은 구현했다. 당시unit19/integration25/ui8·52개/11파일, lint/build/format·수동 CUA 리포트/후보 확인. 복원 후 설정 입력 잔류 회귀는 해결했다. 다음은 자동 browser E2E·실제 계정 준비 이후 Auth/다기기·실기기/콘텐츠/운영 관문이다. [증거](../../raw/research/2026-10-04-volume-history-verification.json). 아래 문단은 진행 순서를 보존한다.

HAR-02 DOM 과업을 먼저 추가하고 REP-04 볼륨 계산→REP-05 그래프/표→REP-06 본인 루틴/과거 수행량 후보를 진행한다. [세부 계약](volume-history-mvp.md). 실제 계정·자동 browser E2E·iPhone/근거 공개 관문은 유지한다. 권장 운동량 조정은 SCI-03B 후속이며 새로운 자동 증량을 먼저 켜지 않는다. 각 검증된 단위는 [commit 지침](../operations/commit-workflow.md)에 따라 local commit한다.

## 루프를 적용할 다음 과업

‘입력값 변경 직후 완료→reload’부터 DOM과 실제 브라우저 검사를 고정하고, 동일 과업에 저장 오류·Auth 전환/만료·응답 유실을 더한다. 이번에 모달 초점 유실은 재현→수정→브라우저 확인했지만 자동 spec에는 남기지 못했다. 이를 HAR-03 회귀로 추가한다. RISK-BACKUP-01 대용량 export/import 비대칭은 미재현 확인 후보로 유지한다. 실제 기기 결과와 과학 검토는 자동 검사의 성공과 별도로 관리한다.

연결 증분이 진행됐어도 G2~G5 전체 미통과, 외부 CI/실제 iPhone/공개 배포 미수행이다. 날짜/진척 백분율은 단정하지 않는다.

[하네스](../operations/testing-harness.md) · [루프](../operations/loop-engineering.md) · [기술 스택](technology-stack.md) · [미결](open-questions.md) · [CHG-0008](../../history/changes/CHG-0008.md)

복원 입력 루프와 최종52개 검사 범위: [실행 원본](../../raw/research/2026-10-04-settings-restore-loop.json). 실제 Auth 계정은 사용자가 직접 등록하고 비밀번호는 대화로 공유하지 않는다. HAR-03/05와 입력 편의는 계정 준비 전에도 진행 가능하다.
