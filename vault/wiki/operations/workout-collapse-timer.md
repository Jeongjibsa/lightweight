---
type: "Implementation Contract"
title: "운동 항목 접기와 고정 휴식 타이머 계약"
description: "운동 항목 접기와 고정 휴식 타이머 계약"
tags: ["training", "ux", "technology"]
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-07T21:55:19+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-07-025.md"
    title: "요구"
  - id: "loop"
    resource: "../../raw/research/2026-10-07-workout-collapse-timer-loop.json"
    title: "실행"
  - id: "source"
    resource: "../sources/SRC-052-workout-accordion.md"
    title: "공식 컴포넌트"
  - id: "workout-ux-git-release"
    resource: "../../raw/research/2026-10-07-workout-ux-git-release.json"
    title: "운동 UX CI/운영 배포 확인"
version: "0.1.1"
change_id: "CHG-0038"
---

# 운동 항목 접기와 고정 휴식 타이머

CONV0025 / FR-06·18 / UI-04. Mantine multiple Accordion은 처음/새 운동을 열고, 제목·모두 접기/펼치기로 조절한다. 제목 아래 완료 수/총 세트와 부위·중량 기준은 접어도 남는다. `keepMounted/display-none`으로 SetRow 입력 초안을 유지하며 collapse state는 일시 UI state다. 미저장 값의 보존은 같은 화면에서 유지하는 계약이며 앱 종료까지 저장 성공을 대신하지 않는다. session/set/snapshot/order/endedAt·schema·outbox 저장 계약은 바꾸지 않았다.

원래 타이머 카드가 위로 벗어나면 safe-area 상단에 max340px 캡슐이 나타난다. 남은 시간·상태를 읽고44px 일시정지/재개/시작을 누르거나 시간 영역 한 번으로 조작창을 열어 즐겨찾기·종료를 사용한다. 원래 카드가 아래에만 있을 때는 표시하지 않는다. IO와 passive scroll/resize가 아래→위 직접 점프도 처리한다. 같은 RestTimer state/deadline을 공유해 이중 타이머/storage writer를 만들지 않았다. 페이지/운동 종료 때 listener/observer/interval을 해제한다.

Mantine Paper/Portal/Button/ActionIcon/Drawer/Modal을 사용하며 CSS는 위치·safe-area·scroll-padding만 담당한다. 캡슐 z110, 하단 메뉴100, modal200 아래에 위치한다. Safari pointer focus를 명시해 조작창을 닫으면 opener로 복귀한다. 네이티브 Dynamic Island/잠금화면 기능은 [P2 검토](../product/rest-alert-feasibility.md)와 구별한다.

## 실제 검사와 루프

108 Vitest(34unit/43integration/31UI)·Node10·lint/build/타입/E2E 타입/format 통과(기존 effect경고6개). 합성 UI는 접기 중 저장 실패 rollback/초안 유지와 단일 시간·observer 해제를 검사한다. Chromium18/WebKit16=34 전체와 관련2흐름×2browser×3회=12 반복을 통과했다. retries0·빈 context·Supabase 빈 override를 유지하며 최초 실패를 고유 runID/trace에 보존했다. 실제 iPhone/VoiceOver/알림·Watch·잠금/physical quota는 미수행이다. [불변 실행](../../raw/research/2026-10-07-workout-collapse-timer-loop.json).

초기 검사에서 Safari opener focus와 종료 뒤 화면을 잘못 가정한 검사, 기존 제목 click/blur 방식, 애니메이션 중 크기/스크롤 경합을 확인했다. pointer focus·Tab blur·native full-height 대기와 위치 보완을 적용했다. 스크롤 점프/좁은 뷰·시간 공유·modal focus·완료 후 타이머 제거/백업 값을 회귀에 남겼다. 과학적 휴식 시간 권장을 추가하지 않았다.

## 캡처

320/390/768px 두 browser의 캡슐 touch hit target44px·가로 overflow0을 확인하고 최종10PNG를 보존했다. 이 파일은 가짜 운동이고 실제 개인 기록이 아니다.

- [chromium-mobile workout-collapsed-390.png](../../raw/design/2026-10-07-ux37-chromium-mobile-workout-collapsed-390.png)
- [chromium-mobile workout-floating-320.png](../../raw/design/2026-10-07-ux37-chromium-mobile-workout-floating-320.png)
- [chromium-mobile workout-floating-390.png](../../raw/design/2026-10-07-ux37-chromium-mobile-workout-floating-390.png)
- [chromium-mobile workout-floating-768.png](../../raw/design/2026-10-07-ux37-chromium-mobile-workout-floating-768.png)
- [chromium-mobile workout-timer-sheet-390.png](../../raw/design/2026-10-07-ux37-chromium-mobile-workout-timer-sheet-390.png)
- [webkit-mobile workout-collapsed-390.png](../../raw/design/2026-10-07-ux37-webkit-mobile-workout-collapsed-390.png)
- [webkit-mobile workout-floating-320.png](../../raw/design/2026-10-07-ux37-webkit-mobile-workout-floating-320.png)
- [webkit-mobile workout-floating-390.png](../../raw/design/2026-10-07-ux37-webkit-mobile-workout-floating-390.png)
- [webkit-mobile workout-floating-768.png](../../raw/design/2026-10-07-ux37-webkit-mobile-workout-floating-768.png)
- [webkit-mobile workout-timer-sheet-390.png](../../raw/design/2026-10-07-ux37-webkit-mobile-workout-timer-sheet-390.png)

## 운동 접기/고정 휴식 운영 반영 — 2026-10-07

48c0f44를 main에 push하고 GitHub37622605794 세 job success와 **Chromium18/WebKit16=34** artifact·의도적 최초 실패 probe를 실제 수신했다. 같은 source의 Pages `github:push` build/deploy가 성공했고 운영 공개24파일 SHA256·보안 헤더가 로컬 검증 빌드와 일치한다. [불변 배포 확인](../../raw/research/2026-10-07-workout-ux-git-release.json).

108Vitest/Node10·로컬browser34/관련12반복·최종10PNG/문서 검증(기존6lint경고)을 유지한다. 새 서버/Auth/스키마/의존성을 변경하지 않았다. preview DB 환경은 비어 있고 새 preview branch 배포/asset 검증은 하지 않았다. Watch/Web Push·native AlarmKit/Live Activity는 **검토만/P2**다. 실제 운동/iPhone/Watch·다기기 Auth·SCI/운영/파일럿 관문은 남는다. 후속 문서 commit은 앱 bundle을 바꾸지 않는다.
