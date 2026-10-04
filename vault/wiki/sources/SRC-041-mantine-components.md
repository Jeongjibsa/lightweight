---
type: "Reference"
title: "SRC-041 Mantine Select·Accordion 재점검"
description: "공식 예시/문서의 실제 확인 범위와 적용 판단."
tags:
  - "source"
  - "design"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T14:54:43+09:00"
sources:
  - id: "verification"
    resource: "../../raw/research/2026-10-04-component-review.json"
    title: "실행/관찰"
source_id: "SRC-041"
retrieved_at: "2026-10-04T14:54:43+09:00"
---

# SRC-041 Mantine Select·Accordion 재점검

2026-10-04 공식 문서를 읽고 Mantine UI FAQ simple 다크 화면을390×844로 캡처/확인했다. 설치 버전 Mantine9.6.3, 별도 renderer/디자인 시스템은 추가하지 않았다.

- [Mantine UI](https://ui.mantine.dev/)·[FAQ simple](https://ui.mantine.dev/component/faq-simple/): 실제 control/content 좌우16px. FAQ는 separated 예시이며 모든 중첩 카드에 테두리를 두라는 규칙이 아니다.
- [Select](https://mantine.dev/core/select/): controlled 선택·searchable·allowDeselect·Combobox/portal/position 안내를 읽었다. native popup 대신 Mantine 선택 목록으로 통일하고 필수 선택을 다시 눌러 해제하지 않도록 했다.
- [Accordion](https://mantine.dev/core/accordion/): default/contained/filled variant·heading order와 keyboard 안내를 확인했다. 앱 내부 접기는 default 형태, transparent item과 기본 수평 간격을 사용한다.

앱의 filled 표면·radius·44px 목표·Drawer 높이는 구현 선택이다. 공식 UI 전체 복제나 전체 접근성 인증을 의미하지 않는다. [실행 원본](../../raw/research/2026-10-04-component-review.json)·[감사](../product/component-review.md).
