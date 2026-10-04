---
type: "Testing Contract"
title: "저장·백업·업데이트 보존 하네스"
description: "HAR04의 실제 브라우저 과업·합성 오류·독립 기대값·지원 한도·다음 관문."
tags:
  - "operations"
  - "testing"
  - "storage"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T16:22:01+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-014.md"
    title: "요청"
  - id: "verification"
    resource: "../../raw/research/2026-10-04-storage-recovery-verification.json"
    title: "검사"
  - id: "technical"
    resource: "../sources/SRC-044-storage-pwa-recovery.md"
    title: "공식 안내"
version: "0.1.0"
approval_status: "implementation-policy-not-new-user-approval"
change_id: "CHG-0014"
---

# 저장·백업·업데이트 보존 하네스

2026-10-04 / app0.2.0/schema2/PRD0.7.2. [실행 원본](../../raw/research/2026-10-04-storage-recovery-verification.json) · [공식 안내](../sources/SRC-044-storage-pwa-recovery.md) · [전체 하네스](testing-harness.md).

## 실제 실행 구조

run-e2e.mjs가 고유 실행 폴더/환경·code SHA256을 만든다. e2e-server.mjs는 production vite.config.ts를 가져오는 test-only e2e-vite.config.mjs로 dist-e2e/v1과 v2를 별도 build한다. 두 HTML의 meta marker만 달라 실제 Workbox precache revision과 SW가 달라진다. 제품 소스에 테스트용 분기를 넣지 않았다.

127.0.0.1:4188 전용 Node 정적 서버는 public/_headers의 같은 보안 헤더·MIME를 제공한다. test-only POST /__e2e/build는 현재 runID header와 v1/v2를 확인해 정적 root만 전환한다. /__e2e/blank는 앱이 DB를 열기 전 fixture 준비용 같은 origin의 빈 HTML이다. 두 endpoint와 marker는 운영 app/dist에 포함하지 않는다. 모든 과업 시작 시 v1로 리셋한다. 한 worker·독립 context로 서버 전환 경합과 실제 사용자 저장소 접근을 피한다. 다른 process가 port를 쓰면 실패하고 종료 시 연결/서버도 정리한다.

Supabase URL/key는 build 때 빈 값으로 덮어쓴다. 외부 HTTP 요청과 unhandled page 오류가 있으면 실패한다. Date만 고정하고 타이머는 동작한다. 새 HAR04 7과업을 포함해 Chromium9/WebKit7, 총16개다. 수정 뒤16개 통과, 비동기 새7개만 세 번씩21회 통과, 실패 artifact probe도 통과했다. 자동 retries0을 유지한다.

## 계약과 독립 기대값

| 과업 | 실제 동작·기대값 | 제한 |
|---|---|---|
| 저장 실패/2엔진 | UI로 routine/start/draft 저장→native outbox.add에 QuotaExceededError 1회→complete 거부·기존5테이블 전체 동일→retry 완료와 outbox 정확히+1→reload DB 동일 | 디스크 사용량/quota 자체는 합성; 실제 native IndexedDB transaction rollback을 검증 |
| migration/2엔진 | 같은 origin의 native version10에 schema1 fixture 준비→production Dexie가20으로 upgrade→설정/삭제 routine/session/outbox 필드·IDs 동일, cloud 빈 table→reload 동일 | 과거 실제 사용자 DB를 사용하지 않음; 미래 schema 검증 아님 |
| 큰 파일/2엔진 | 36세션×400세트,14,400개의 한국어 snapshot/UUID→실제7,778,029byte 다운로드→파일 업로드/명시 교체 복원→모든 세트/IDs 동일→한도+1byte 파일은 미리보기 없이 거부/DB 유지 | 파일 전체10MiB 이하, 무제한 자료 지원 아님 |
| update/Chromium | v1 제어 중 실제v2 설치/waiting→진행 운동일 때 버튼 비활성→강제 click 없이 세트/종료→활성 버튼으로 교체→v2 HTML/controller·오프라인 reload→DB 전체 동일 | desktop Chromium만; 다중 tab/잠금·실제iPhone은 별도 |

UI/Vitest도 실제 내보내기 Blob을 parser로 읽는다. 잘못된 test 배열 순서만 ID 기준 정렬하며 개별 기록/세트/IDs/삭제표식 비교를 생략하지 않는다. 정확한10MiB UTF-8 정상JSON+공백은 수용하고1byte 초과/문자 길이는 짧지만 UTF-8이 초과한 파일은 거부한다. 초과 export에서는 ObjectURL이 만들어지지 않고 원본 설정/세션이 동일함을 확인한다.

fault는 앱 코드를 mock하지 않고 blank test context에 addInitScript로 native add를 감싼다. 입력 blur의 draft transaction이 끝난 것을 독립 native read로 기다린 뒤 complete transaction에만 오류를 걸어 경합을 막는다. 오류가 성공으로 표시되지 않고 완료 상태가 false이며 원본/outbox가 함께 rollback하는지 비교한다. 이 결과를 실제 브라우저 용량 소진/eviction 시험으로 부르지 않는다.

## 현재 백업 정책

파일 format/version1·내용·스키마는 유지한다. JSON 출력은 들여쓰기를 생략해 저장된 모든 필드를 그대로 담는다. UTF-8 최대10,485,760bytes(10MiB)는 앱의 기존 import 제한을 명확히 하고 export에도 적용한 구현 정책이다. 이하의 이전 들여쓰기 파일도 계속 읽는다. 원시 Store.backup/클라우드 snapshot 계약에는 파일 제한을 추가하지 않았다.

한도를 넘으면 import는 변경/미리보기 전에, export는 다운로드 전에 안내한다. 자료를 자르거나 삭제하지 않는다. Store의 backupSchema 최대 세션/세트 검증은 계속 적용한다. 압축/분할·streaming 백업과 한도를 넘는 로컬 자료의 독립 복구는 아직 지원하지 않으므로 HAR04를 전부 done으로 바꾸지 않는다. 안전한 큰 파일 정책의 후속 작업과 실제 기기 관문이 남았다.

## 실패에서 수정으로

첫 실제 Blob roundtrip 실패는 제품 결함: pretty 출력만 한도를 넘었다. compact 직렬화/대칭 byte 검사를 추가해 고쳤다. 첫 browser update 실패는 제품 결함: 고정 하단 UpdateNotice가 운동 종료 버튼의 pointer를 막았다. Mantine 안내를 main 상단 흐름으로 옮기고 active guard를 유지해 실제 click/reload를 통과했다. [이전 화면](../../raw/design/2026-10-04-update-blocked-before.png) · [수정 화면](../../raw/design/2026-10-04-update-inline-after.png).

랜덤 session 배열 순서, 미등록 UI matcher/기존 info Alert 선택, blur 전 quota 주입은 test fixture 결함이다. 정확한 오류 text/순서/transaction 경계를 고쳤고 assertion을 약화하거나 force click/retry로 숨기지 않았다. 첫 실패 report/trace는 고유 runID로 그대로 보존한다.

## CI와 남은 관문

[GitHub 실행](https://github.com/Jeongjibsa/lightweight/actions/runs/37184261544)은 push한187c47c의 check/Chromium/WebKit 3job 모두 성공했다. 두 artifact를 실제 다운로드해 정상9과업·probe 실패1·trace ZIP CRC/화면·console·환경을 확인했다. [CI 수신 기록](../../raw/research/2026-10-04-github-ci-37184261544.json). HAR05의 외부 실행/증거 보존 관문은 완료다. 새 HAR04 코드는 local 검사 결과이며 아직 새 GitHub 결과로 표현하지 않는다.

실제 Safari/iPhone의 저장 압력/eviction·홈화면 설치·background/잠금/키보드·persist·다중 tab update는 REL02에서 확인한다. 개인 backup/토큰을 공개 CI에 올리지 않는다. 실제 Auth A/B·만료·RLS/다기기 복구는 계정 준비 후 SYNC/HAR06에서 검사한다. [남은 순서](../product/remaining-work.md).

[최종 check/빌드 크기 정정](../../raw/research/2026-10-04-storage-recovery-final-check.json). 이전 실행 원본/해시를 수정하지 않고 final1278.10KiB를 별도로 기록했다.
