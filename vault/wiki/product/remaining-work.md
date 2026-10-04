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
  at: "2026-10-04T10:18:25+09:00"
sources:
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
version: "0.2.0"
approval_status: "proposal"
change_id: "CHG-0008"
---

# 현재 구현에서 운동 MVP까지 남은 작업

2026-10-04 / app0.2.0. 반응형·사용자 설정·로컬 기록/백업·Mantine/글꼴·Supabase 연결 증분을 구현했다. **운동 MVP 전체와 실제 실사용 관문은 아직 완료하지 않았다.** 실제 상태는 [진행 보고](implementation-progress.md), 작업 계약은 [백로그](implementation-backlog.md)를 따른다.

## 완료한 증분

5개 반응형 화면·사용자별 목표/횟수/분할/단위/시간대, 초안12종목·직접 종목·루틴/세트/재개/기초 집계·JSON 복원·PWA 업데이트. Mantine provider/입력/모달/버튼·Spoqa WOFF2/OFL/캐시. 등록 계정 Auth·계정 UUID별 DB·수동 클라우드 snapshot/retry/ACK/CAS/교체 전 recovery. 서버 private3테이블·RLS/execute ACL/owner/허용 목록·공개 가입 차단. unit6/integration24·원격 SQL16·비로그인 HTTP401·lint/build/format 통과.

로컬 프로필은 인증이 아니며 outbox가 생겼다는 사실만으로 클라우드 완료를 표시하지 않는다. 수동 서버 전송은 ACK를 받았을 때 완료다. 자동 레코드 병합·실제 계정 전체흐름은 아직 없다. 초안 그림/분류별 행 수는 검토된 근육 가이드·추천/티어가 아니다.

## 다음 순서와 완료 조건

| 순서 | 남은 작업 | 작업 ID | 완료 조건/현재 제한 |
|---|---|---|---|
| 1 | 본인 계정 등록/허용 목록·실제 Auth/복원 | SYNC-02/05 | 사용자가 비밀번호/계정 등록, 승인 UUID 허용 후 login→전송→다른 저장소 불러오기; A/B/만료/권한회수/오프라인 확인. 서버 연결정보 부족은 해결됨 |
| 2 | 입력/오류 DOM·browser E2E·CI 실패 증거 | HAR-02/03/05 | 세트 입력즉시완료·계정분리·offline·빈DB복원·모달 초점, 결정적 기대값/새context/trace; 외부 CI 결과 |
| 3 | 실제 migration/update·저장 실패·대용량 | HAR-04, LOG-05/06 | schema1→2 계약은 통과. 브라우저 quota·진행 운동 update·큰백업 정책/경계·새기기/서버복구는 미완료 |
| 4 | 전송/편집 충돌 흐름 고도화 | SYNC-03/04/05 | manual snapshot CAS/retry는 구현. 두 변경 명시 해결·삭제 재등장·pending 취소/복구·증가한 기록 크기 정책, 필요 시 자동 레코드 sync |
| 5 | 실제 운동 입력 편의 | LOG-03~06, RESP-01 | 이전 세션 재사용·종목 대체·종료 기록 편집·부하/장비 조건·삭제 흐름과 회귀 |
| 6 | 설명 가능한 개인화 | REP-01~03 | 직접/간접·단측/단위·같은 조건 추세·N/A·수정 재계산·입력/규칙/근거 버전·다음 행동 |
| 7 | 과학 시각/운동 설명·루틴 추천·티어 | SCI-01~04, LOG-02 | 전문/해부학/권한 검토→공개 registry→조건/보류/설명→리포트 연결 |
| 8 | HTTPS 배포·실기기·운영 복구 | REL-01~03 | 제공자/도메인/preview 분리·헤더·iOS 설치/키보드/잠금/offline/update·메일/복구 확인 |
| 9 | 본인 관찰→지인 제공 | PIL-01/02 | 실제 불편/누락/해석 문제→수정→회귀, G3/G4 만족 후 계정 독립/복원 과업 |
| 후속 | 식단/영양·선택 AI 설명 | NUT-01~04, AI-01 | 운동 우선 원칙 유지; 음식DB/권한·결측/커버리지·검토 공식/재현 계산 |

계정 등록 전에도 HAR-02/03/05와 로컬 입력/계산·SCI 전문 검토는 진행할 수 있다. 개인 계정 비밀번호를 대화로 수집하지 않는다. [계정 준비 절차](supabase-integration.md)를 문서화했다. Q-15 로그인/복구/메일, Q-08/16/17 운영비/도메인/접근, Q-12 지원 iOS/실기기, Q-01 경험/장비/시간, Q-06 검토 역할은 필요한 단계에 정한다.

## CONV-0009 이후 실제 다음 묶음

HAR-02 초기 DOM·REP-04/05/06은 구현했다. 현재unit19/integration25/ui8·52개/11파일, lint/build/format·수동 CUA 리포트/후보 확인. 복원 후 설정 입력 잔류 회귀는 해결했다. 다음은 자동 browser E2E·실제 계정 준비 이후 Auth/다기기·실기기/콘텐츠/운영 관문이다. [증거](../../raw/research/2026-10-04-volume-history-verification.json). 아래 문단은 진행 순서를 보존한다.

HAR-02 DOM 과업을 먼저 추가하고 REP-04 볼륨 계산→REP-05 그래프/표→REP-06 본인 루틴/과거 수행량 후보를 진행한다. [세부 계약](volume-history-mvp.md). 실제 계정·자동 browser E2E·iPhone/근거 공개 관문은 유지한다. 권장 운동량 조정은 SCI-03B 후속이며 새로운 자동 증량을 먼저 켜지 않는다. 각 검증된 단위는 [commit 지침](../operations/commit-workflow.md)에 따라 local commit한다.

## 루프를 적용할 다음 과업

‘입력값 변경 직후 완료→reload’부터 DOM과 실제 브라우저 검사를 고정하고, 동일 과업에 저장 오류·Auth 전환/만료·응답 유실을 더한다. 이번에 모달 초점 유실은 재현→수정→브라우저 확인했지만 자동 spec에는 남기지 못했다. 이를 HAR-03 회귀로 추가한다. RISK-BACKUP-01 대용량 export/import 비대칭은 미재현 확인 후보로 유지한다. 실제 기기 결과와 과학 검토는 자동 검사의 성공과 별도로 관리한다.

연결 증분이 진행됐어도 G2~G5 전체 미통과, 외부 CI/실제 iPhone/공개 배포 미수행이다. 날짜/진척 백분율은 단정하지 않는다.

[하네스](../operations/testing-harness.md) · [루프](../operations/loop-engineering.md) · [기술 스택](technology-stack.md) · [미결](open-questions.md) · [CHG-0008](../../history/changes/CHG-0008.md)

복원 입력 루프와 최종52개 검사 범위: [실행 원본](../../raw/research/2026-10-04-settings-restore-loop.json). 실제 Auth 계정은 사용자가 직접 등록하고 비밀번호는 대화로 공유하지 않는다. HAR-03/05와 입력 편의는 계정 준비 전에도 진행 가능하다.
