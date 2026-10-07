---
type: "Source Note"
title: "Mantine Accordion 입력 보존과 타이머 접근"
description: "Mantine Accordion 입력 보존과 타이머 접근"
tags: ["training", "ux", "technology"]
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-07T21:33:11+09:00"
sources:
  - id: "capture"
    resource: "../../raw/research/2026-10-07-rest-alert-feasibility.json"
    title: "문서/설치 코드 확인"
  - id: "loop"
    resource: "../../raw/research/2026-10-07-workout-collapse-timer-loop.json"
    title: "검사"
source_id: "SRC-052"
review_scope: "Official relevant sections and installed Mantine9.6.3 API/runtime; synthetic browser only"
---

# SRC-052

[공식 Accordion 문서](https://mantine.dev/core/accordion/)의 controlled multiple·heading order·기본 button·중첩 금지·keyboard·transition 관련 본문을 확인했다. 설치된 Mantine9.6.3의 Accordion/Panel 선언과 런타임을 읽어 `keepMounted`와 `keepMountedMode="display-none"`을 명시했다. 접힌 패널에서 로컬 입력 state/effect를 유지하는 구현 선택이며 데이터 저장을 대신하지 않는다.

시각 스타일은 Mantine props/styles, 위치와 safe-area만 structural CSS다. 단일 RestTimer state/deadline을 일반 카드·floating capsule·조작창이 공유한다. IO에 passive scroll/resize 위치 확인을 보완해 아래→위로 건너뛰는 이동도 처리한다. [합성 검사](../operations/workout-collapse-timer.md)는 실제 iPhone/VoiceOver 검증으로 확대하지 않는다.
