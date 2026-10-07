---
type: "Implementation Contract"
title: "운동 세부 분류·세트 휴식·제목 초점 계약"
description: "새 카탈로그/이전 기록/기본 휴식·설정 보존과 실제 UI 검증."
tags:
  - "operations"
  - "records"
  - "testing"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-07T22:26:53+09:00"
sources:
  - id: "human"
    resource: "../../raw/conversations/2026-10-04-022.md"
    title: "사용자 요구"
  - id: "loop"
    resource: "../../raw/research/2026-10-04-catalog-rest-timer-loop.json"
    title: "실행/캡처"
  - id: "workout-ux-request"
    resource: "../../raw/conversations/2026-10-07-025.md"
    title: "운동 접기/휴식 접근 요구"
  - id: "workout-ux-git-release"
    resource: "../../raw/research/2026-10-07-workout-ux-git-release.json"
    title: "운동 UX CI/운영 배포 확인"
  - id: "unit-chg-0039"
    resource: "../../raw/conversations/2026-10-07-026.md"
    title: "세 종목 추가와 순차 작업 요구"
---

# 운동 탐색과 세트 휴식

기록용 카탈로그는12→34종목이며 바벨은1→18종목이다. 기존12개 ID/배열 순서를 유지하고 스쿼트·벤치 프레스·데드리프트를 제공한다. 가슴/등/어깨/팔/하체/코어 아래 세부 분류와 장비/이름·별칭 검색을 공통 picker에 적용하여 탐색·루틴·운동 추가에서 사용한다. 큰 부위 변경은 세부 필터를 전체로 되돌린다.

어깨는 전면/측면/후면이다. 프론트·사이드·벤트오버/리어·비하인드백 케이블은 별개 ID다. 각 운동의 subgroup/aliases는 optional이고 이전 기록의 snapshot/ID/값/집계를 바꾸지 않는다. 이 분류는 탐색 태그이며 과학 검토된 자극 범위나 티어가 아니다. 새 custom 입력에도 선택 세부 분류를 제공한다.

## 휴식 계약

기본60초는 사용자 요구이고 초기60/90/120/180초 및 허용15~1800초는 편의 정책이다. 즐겨찾기3~4개를 distinct 정수로 저장하며 버튼 탭은 시간을 선택하고 즉시 시작한다. 저장된 각 세트 완료가 최신 타이머를 시작한다. 완료 저장 실패는 새로운 완료로 판정하지 않는다. 일시정지/재개/종료/재시작을 제공한다.

진행 상태는 database/owner/session으로 분리한 기기 localStorage에 source 완료 ID/시각·deadline·pause·stop을 보존한다. tick 수를 차감하지 않고 현재 시각과 deadline의 차이를 계산해 재실행/늦은 tick·복귀를 처리한다. runtime은 클라우드 전송/백업 대상이 아니다. 저장 실패는 오류를 알리고 운동 기록은 독립적으로 유지한다. 백그라운드 소리/시스템 알림은 구현하지 않았으며 실제 iPhone 잠금/복귀는 아직 not_run이다.

즐겨찾기와 선택 시간은 optional profile.restTimer이며 profile/outbox atomic 저장이다. 기존 profile 설정 편집은 이 값을 보존하고 백업/복원에 포함한다. 이전 backup1/schema2는 새 필드 없이 읽을 수 있다. 오래된 앱이 새 optional 필드를 재저장할 때 보존한다는 보장은 별도다. 운영 클라우드에서 실제 사용자의 새 운동 왕복은 미검증이다.

## 제목과 실제 UI

다섯 화면 H1의 programmatic focus/tabIndex=-1과 화면 읽기 위치 이동을 유지하며 제목에만 outline:none을 적용했다. interactive 버튼/입력의 focus 표시는 제거하지 않았다. Mantine component/theme/Geist/하단 메뉴를 유지한다.

98개(31unit/40integration/27UI)·Node8·전체 browser30(16Chromium/14WebKit)·최종 문구6개·build/types/format/artifact25 통과다. lint는 기존6경고다.320/390px actual capture를 확인해 pause/save 문구 잘림을 고쳤다. [불변 실행과9PNG](../../raw/research/2026-10-04-catalog-rest-timer-loop.json). 물리 기기 및 과학적 검토 완료가 아니다.

[요구](../conversations/2026-10-04-022.md)·[하네스](testing-harness.md)·[실사용](iphone-pilot-checklist.md).

## CONV0025 스크롤 휴식 접근

운동 항목 접기/완료 요약·원래 타이머가 위로 벗어나면 상단 캡슐/조작창을 추가했다. 기본60초·즐겨찾기3~4·단일 deadline/pause와 기존 schema를 보존한다. [구현/검사](workout-collapse-timer.md) · [시스템 알림 P2 검토](../product/rest-alert-feasibility.md).

## 운동 접기/고정 휴식 운영 반영 — 2026-10-07

48c0f44를 main에 push하고 GitHub37622605794 세 job success와 **Chromium18/WebKit16=34** artifact·의도적 최초 실패 probe를 실제 수신했다. 같은 source의 Pages `github:push` build/deploy가 성공했고 운영 공개24파일 SHA256·보안 헤더가 로컬 검증 빌드와 일치한다. [불변 배포 확인](../../raw/research/2026-10-07-workout-ux-git-release.json).

108Vitest/Node10·로컬browser34/관련12반복·최종10PNG/문서 검증(기존6lint경고)을 유지한다. 새 서버/Auth/스키마/의존성을 변경하지 않았다. preview DB 환경은 비어 있고 새 preview branch 배포/asset 검증은 하지 않았다. Watch/Web Push·native AlarmKit/Live Activity는 **검토만/P2**다. 실제 운동/iPhone/Watch·다기기 Auth·SCI/운영/파일럿 관문은 남는다. 후속 문서 commit은 앱 bundle을 바꾸지 않는다.

## CONV0026 카탈로그37개

세 종목을 뒤에 추가하고 중량 방식/기존 snapshot을 유지했다. [기록 계약과 실제 화면](catalog-expansion.md).
