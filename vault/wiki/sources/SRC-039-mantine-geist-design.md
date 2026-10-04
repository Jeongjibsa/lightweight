---
type: "Reference"
title: "SRC-039 Mantine·Geist 전체 화면 디자인 근거"
description: "공식 기술 문서와 설치 metadata 확인 범위·웹/native 검증 경계."
tags:
  - "source"
  - "design"
  - "technology"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T13:35:43+09:00"
sources:
  - id: "verification"
    resource: "../../raw/research/2026-10-04-mantine-geist-design-verification.json"
    title: "확인 범위"
source_id: "SRC-039"
retrieved_at: "2026-10-04T13:35:43+09:00"
---

# SRC-039 Mantine·Geist 전체 화면 디자인 근거

확인일 2026-10-04. 기술 문서/설치 metadata 확인이며 운동·영양 연구 근거가 아니다. [수집/실행 원본](../../raw/research/2026-10-04-mantine-geist-design-verification.json).

| 일차 자료 | 읽은 범위 | 구현 적용/한계 |
|---|---|---|
| [Mantine theme](https://mantine.dev/theming/theme-object/) | theme tokens·component defaultProps/styles·reduced motion | dark/blue 공통 토큰·입력/카드/버튼; 디자인 품질 자동 보장 아님 |
| [Mantine NavLink](https://mantine.dev/core/nav-link/) | default anchor와 polymorphic button 예시 | 화면 이동은 href, 종목 선택은 button. href 없는 anchor를 선택 과업으로 사용하지 않음 |
| [Mantine Drawer](https://mantine.dev/core/drawer/) | bottom position·size/styles·focus 관련 설명; 설치 CSS 확인 | 내용 높이 bottom sheet·focus trap/복귀. 실제 iOS keyboard 검증 별도 |
| [Vercel Geist](https://vercel.com/font) | family·open font 소개 | Geist 요청의 공식 family 확인; native iOS font와 같다는 주장 없음 |
| [Fontsource Geist](https://fontsource.org/fonts/geist/use) | 설치/다운로드/license 소개; 설치5.3.0 metadata·exports/CSS | npm variable package를 로컬 번들·OFL license 보존. 설치 subsets는 latin/cyrillic/vietnamese 계열이며 Hangul이 나열되지 않아 운영체제 fallback 사용 |

Apple HIG tab-bars 문서는 JS shell만 반환되어 본문을 검토하지 못했다. 따라서 HIG 전체 검토·native Apple 준수 인증으로 표시하지 않는다. 44px/16px·48em·색상과 클릭 단축은 이 앱의 구현 기준이며 공식 문서가 앱 과업의 적합성을 검증했다는 뜻은 아니다. Geist의 전체 glyph cmap 검사는 하지 않았다. 한글은 iOS에서 Apple SD Gothic Neo 등 가용 시스템 글꼴로 표시한다.
