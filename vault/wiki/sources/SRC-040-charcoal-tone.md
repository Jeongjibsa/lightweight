---
type: "Reference"
title: "SRC-040 Mantine UI·Monokai 톤 참고"
description: "공식 사이트에서 읽은 범위·다크 화면 관찰·앱 팔레트 선택을 구분한다."
tags:
  - "source"
  - "design"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T14:16:08+09:00"
sources:
  - id: "verification"
    resource: "../../raw/research/2026-10-04-charcoal-theme-verification.json"
    title: "읽은 범위와 관찰"
source_id: "SRC-040"
retrieved_at: "2026-10-04T14:16:08+09:00"
---

# SRC-040 Mantine UI·Monokai 톤 참고

확인일 2026-10-04. 디자인 참고 자료이며 운동·영양 연구 근거가 아니다. [불변 수집/실행 기록](../../raw/research/2026-10-04-charcoal-theme-verification.json).

| 일차 자료 | 확인 범위 | 적용과 한계 |
|---|---|---|
| [Mantine UI](https://ui.mantine.dev/) | 랜딩 소개·다크 모드 실제 화면·read-only DOM computed styles | body/dark7 `#242424`, dark8 `#1f1f1f`, dark9 `#141414`; Browse components 버튼 `#ffd43b`/글자 `#242424` 관찰. 앱은 배경 `#1f1f1f`·카드 `#242424`·노란 강조로 조정하며 사이트 전체를 복제하지 않음 |
| [Monokai Pro](https://monokai.pro/) | 공식 색감 소개와 dark/light·filter 선택 안내 | 여러 변형이 있으므로 단일 정확한 팔레트를 검토했다고 하지 않음. 따뜻한 차콜 방향의 참고이며 유료 테마 원본/자산을 복사하지 않음 |

구체 색상/radius는 사용자의 직접 지정이 아닌 구현 선택이다. 기존 Geist·Mantine·하단 UX 기준은 유지한다. 설치된 Mantine9.6.3의 `ThemeIcon` varsResolver/variant resolver를 읽어 autoContrast 적용 경로를 확인했다. 실제 주요 버튼은 노란 `#ffd43b`와 검정 `#000000`, 계산 대비 14.73:1이다. 특정 기본 버튼의 계산값이며 hover/disabled·전체 텍스트/아이콘·전체 접근성 통과로 일반화하지 않는다. [현재 디자인](../product/design-system.md).
