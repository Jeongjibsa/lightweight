---
type: "Implementation Contract"
title: "반응형·프로필·로컬 기록 계약"
description: "첫 구현에서 사용하는 사용자 설정·소유자·세트·백업·계산 규칙과 미래 계정 경계."
tags:
  - "product"
  - "implementation"
  - "responsive"
  - "data"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T16:22:01+09:00"
sources:
  - id: "responsive-local-request"
    resource: "../../raw/conversations/2026-10-03-006.md"
    title: "반응형·사용자별 설정·로컬 구현 요청"
  - id: "technical"
    resource: "../sources/SRC-034-responsive-local.md"
    title: "공식 구현 근거"
  - id: "cloud"
    resource: "supabase-integration.md"
    title: "원격/계정 계약"
  - id: "design-request"
    resource: "../../raw/conversations/2026-10-04-010.md"
    title: "전체 Mantine/Geist/하단 UX 요구"
  - id: "storage-request"
    resource: "../../raw/conversations/2026-10-04-014.md"
    title: "순차 요청"
  - id: "storage-run"
    resource: "../../raw/research/2026-10-04-storage-recovery-verification.json"
    title: "저장 보존 검사"
  - id: "ci-receipt"
    resource: "../../raw/research/2026-10-04-github-ci-37184261544.json"
    title: "GitHub CI 증거"
version: "0.2.1"
change_id: "CHG-0014"
---

# 반응형·프로필·로컬 기록 계약

PRD 0.4.0 / app 0.2.0 / IndexedDB schema2. [사용자 요청](../../raw/conversations/2026-10-03-006.md)을 반영한 현재 로컬 평가용 구현 계약이다. 서버 수동 snapshot/권한 초기 계약은 [Supabase 연결](supabase-integration.md)을 따른다. 자동 레코드 sync/고급 충돌 정책은 SYNC에서 남았다.

## 화면과 사용자 설정

CONV-0010에서 전 폭 하단 5개 메뉴로 변경했다. 큰 화면은 본문 폭/카드 열을 재배치하고 좌측 메뉴를 사용하지 않는다. 전체 Mantine·Geist/시스템 한글·blue-dark·빠른 접근/모바일 bottom sheet 기준은 [디자인 계약](design-system.md)을 따른다. 기종 이름으로 분기하지 않는다. 폭 320/390/440/768/1024/1440 CSS px, 가로 방향·실제 키보드·확대·safe area를 검증 범위로 둔다. 구현된 focus 표시·입력 라벨·모달·감소된 움직임 설정과 실제 접근성 시험 결과를 구별한다. [공식 참고](../sources/SRC-034-responsive-local.md).

새 프로필은 목표/횟수/분할을 미설정으로 시작한다. 사용자 조건은 다음 필드에 저장한다.

| 필드 | 계약 |
|---|---|
| 이름 | 1~40자, 공백 정리 |
| 목표 | 근육량 증대 / 근력 향상 / 규칙적 운동 / 직접 입력 |
| 주당 횟수 | 최소·최대 각각 1~7회, 최소≤최대; 같은 값이면 고정 횟수 |
| 분할 | 무분할 / 2~5분할 / 직접 입력; 주당 횟수와 독립 |
| 시간 | 선택 입력, 10~240분 |
| 장비 | 덤벨·바벨·머신·케이블·맨몸 복수 선택 |
| 단위·시간대 | kg/lb 및 유효한 IANA 시간대; 초기 단위 kg, 시간대는 현재 브라우저 |

직접 입력 목표/분할은 비어 있으면 저장하지 않는다. 설정 변경은 다음 세션 조건에 반영한다. 진행 중/과거 세션에는 시작 시 `preferencesSnapshot`과 루틴 revision/내용을 보존한다. 본인의 근육량 증대·주3~4회·무분할~3분할과 보고된 iPhone은 테스트 표본이며 앱 전역 강제값이 아니다.

## 로컬 소유자와 저장

`ownerId` UUID로 프로필·루틴·세션·outbox를 조회/수정한다. 모든 쓰기에 소유자 일치를 검사한다. 같은 브라우저의 로컬 프로필 전환은 인증이 아니다. 계정 연결 후에는 인증 user ID와 매핑/이관을 검증하며 로컬 UUID를 서버 권한 증거로 사용하지 않는다.

기존 `lightweight-v1`과 인증 UUID별 DB는 version2이며 profiles·routines·sessions·outbox를 보존하고 cloud 상태 테이블을 추가했다. 선택 로컬 프로필 ID는 localStorage에 저장한다. Supabase SDK 인증 세션도 SDK의 브라우저 저장소에 보관되므로 토큰 없는 localStorage라는 설명을 계정 모드에 적용하지 않는다. 루틴/설정/세션 쓰기와 outbox 항목 생성은 같은 IndexedDB 트랜잭션으로 수행한다. 커밋 전 완료 성공을 표시하지 않고 오류를 알린다. 실패 시 함께 롤백한다. 로컬 모드 outbox는 서버 전송하지 않는다. 로그인 계정의 manual snapshot에는 캡처 queueIds/operation/baseRevision·서버 확인/충돌 거부 계약을 추가했다. 자동 레코드 동기화/병합은 미완료다.

프로필당 진행 중 세션 하나를 재사용해 연속 시작 탭으로 세션을 복제하지 않는다. 세트는 안정 UUID를 유지해 반복 완료가 입력 행을 늘리지 않는다. 삭제는 tombstone을 보존한다. 앱은 기기 저장/오프라인과 manual upload의 서버 ACK 완료를 구분한다.

## 세트와 집계

| 항목 | 규칙 |
|---|---|
| 중량 방식 | 총 중량 / 한 손 / 머신 표시 / 맨몸 추가 / 보조량 / 시간 보존 |
| 결측 | 빈 칸은 null, 0 중량은 유효값, 미입력 RIR은 null |
| 완료 | 시간 운동은 양의 초; 그 외는 양의 정수 반복수 + 중량(맨몸 추가 중량은 생략 가능) |
| 종류·좌우 | 준비/본세트, 양쪽/왼쪽/오른쪽 저장 |
| 수정 | 완료 취소 후 수정 가능; 입력 초안 변경을 수행 완료로 처리하지 않음 |
| 종료 | 완료 행이 없으면 종료 대신 취소 안내; 일부 완료와 전체 완료 구별 |
| 주간 | 프로필 시간대로 월~일; 세션 localDate는 시작 당시 시간대 기준 보존 |
| 기록 집계 | 삭제/취소 제외, 완료 본세트 행만 집계; 완료 본세트가 있는 세션(진행 중 포함)을 운동 기록 1회로 셈 |
| 부위 요약 | 지정한 운동 분류별 행 수, 좌우 별도 행은 각각 셈; 직접/간접 근육 볼륨 계산 아님 |

가짜 표본: 계획 본세트 8 + 준비 세트 2, 완료 본세트 6 + 완료 준비 세트 2 → 계획8/완료 본세트6/운동1/기록일1. 미완료·준비 세트를 근육 수행량에 넣지 않는다. kg/lb 원값을 유지하고 비교가 필요할 때 1 lb=0.45359237 kg로 변환한다. 실제 동일 조건 추세와 골격근량 측정은 아직 미구현이다.

새 종목의 빈 3세트와 마지막 완료부터 2분 타이머는 입력 편의값이다. 검토된 운동 처방이 아니다. 타이머는 저장된 완료 시각을 기준으로 계산하며 실제 iOS 잠금/복귀는 미시험이다.

## 백업과 복원

현재 프로필의 설정·루틴·세션(삭제 표식/미완료 포함)을 `lightweight-backup` version 1 JSON으로 내보낸다. 개인 백업은 Git/vault/dist에 넣지 않는다.

내보내기는 들여쓰기 없는 JSON으로 모든 필드를 유지하며 UTF-8 10MiB 초과 시 다운로드 전에 오류를 표시한다. 잘라내기/삭제/분할은 하지 않는다. 파일 한도는 browser quota와 별개이고 클라우드 Store snapshot에는 추가하지 않았다. 기존 들여쓰기 파일도 한도 이하면 읽는다.

가져오기는 적용 전 10MiB(10,485,760bytes) 한도·JSON·버전·필드·기록 ID 중복·파일 내부 소유자 일치·최대 하나의 진행 세션을 검사한다. 루틴/운동 개수와 교체 범위를 미리 보여준다. 사용자가 복원을 선택하면 현재 로컬 프로필의 데이터만 전체 교체하고 해당 프로필 outbox를 재생성한다. 새 기기에서는 로컬 owner ID를 현재 프로필로 매핑한다. 다른 로컬 프로필과 ID 충돌 시 전부 취소한다. 오류 시 기존 자료를 보존한다.

인증 계정 JSON 이관은 명시적인 현재 owner remap/새 outbox/기존 baseRevision 보존/pending 취소로 확장했고 계약 검사를 추가했다. 클라우드 미리보기 교체는 서명·revision 재검사/최근 recovery와 원자 교체를 별도로 검증한다. 서버 자동 병합/삭제 재등장·실제 Auth UI는 SYNC-04/05에 남았다. 저장소 삭제·기기/origin 변경에 자동 복구가 없고, 별도 JSON 백업이 필요하다.

## 콘텐츠와 보안 경계

현재 catalog 12개는 기록용 이름/분류/장비/중량 표기 초안이다. 사용자 운동은 직접 입력 라벨을 둔다. 개념도는 실제 자극 범위를 뜻하지 않는다. 수행 설명·근육 지도·티어·추천 수치의 SCI 검토/공개 관문은 유지한다. UI는 데이터 문자열을 React 텍스트로 출력하고 HTML 삽입을 사용하지 않는다.

`app/dist`만 호스트에 제공한다. `.env`·개인 백업·node_modules·브라우저 시험 산출물은 추적 제외한다. CSP·nosniff·referrer·frame/permissions 헤더를 정적 호스트용으로 준비하고 로컬 preview에서 확인한다. Supabase Auth/RPC/RLS/grants·정확한 connect-src와 서버 허용 목록을 연결했다. 공개 가입 OFF는 사용자 승인 후 적용했다. 실제 로그인/복원·초대/메일·운영 헤더/실기기는 아직 검증 전이다.

## Related

[PRD](prd.md) · [실행 결과](implementation-progress.md) · [데이터 모델](data-model.md) · [작업 목록](implementation-backlog.md)

[큰 백업·저장 실패·업데이트 검증](../operations/storage-recovery-harness.md).
