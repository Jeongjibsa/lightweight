---
type: "Design Specification"
title: "Mantine·Geist 블루/다크 디자인 시스템"
description: "전체 화면 토큰·타이포그래피·하단 메뉴·빠른 접근·데이터 보존 계약."
tags:
  - "design"
  - "product"
  - "accessibility"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T13:35:43+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-010.md"
    title: "요구"
  - id: "technical"
    resource: "../sources/SRC-039-mantine-geist-design.md"
    title: "공식 기술 자료"
  - id: "verification"
    resource: "../../raw/research/2026-10-04-mantine-geist-design-verification.json"
    title: "실행"
version: "0.1.0"
change_id: "CHG-0010"
---

# Mantine·Geist 블루/다크 디자인 시스템

CONV-0010 / FR-12·16 / PRD0.6.0 / branch `codex/mantine-blue-dark`. [요구](../../raw/conversations/2026-10-04-010.md) · [감사/실행](design-audit.md) · [정확한 스택](technology-stack.md).

## 톤과 공통 규칙

Mantine9.6.3의 `theme`·`defaultProps`·`styles` API와 layout props로 카드/버튼/입력/목록/표/내비게이션/알림/Auth·클라우드 화면을 구성한다. `forceColorScheme=dark`, 배경dark9 `#080f1b`, surfacedark7 `#111a2b`, primaryblue7 `#1b61d3`, 강조blue4 `#6aa4ff`, 본문dark0 `#eef2fa`, 보조dark1/2. radius16/24px, 작은 장식보다 입력과 실행을 먼저 배치한다. 실제 palette는 `app/src/theme.ts` 단일 기준이며 위 값은 구현 선택이다.

글꼴은 `@fontsource-variable/geist5.3.0`, 제목650·일반 본문400/500·동작600. 숫자 tabular-nums. 영어/숫자는 Geist Variable, 한글은 `Apple SD Gothic Neo`, `Noto Sans KR`, sans-serif 순의 시스템 fallback이며 Noto 폰트를 별도 다운로드하지 않는다. 글꼴 assets는 같은 origin에서 번들/캐시하고 OFL license를 보존한다.

공통 CSS는 document/safe-area·하단 고정 위치·sticky dock·skip link·알림 위치·SVG 데이터 그래프의 기하에 사용한다. 일반 UI 컴포넌트의 시각 스타일은 Mantine으로 관리한다. Lucide 아이콘과 실제 데이터 SVG는 해당 역할을 유지한다. 종전 CSS 그림/과도한 소개 영역/UnstyledButton 기반 custom button을 제거했다.

## 탐색과 빠른 기록

- 오늘 / 운동 탐색 / 나의 루틴 / 리포트 / 설정, **모든 폭에서 하단 다섯 탭**. href·아이콘·텍스트·단일 aria-current. 큰 화면도 사이드 메뉴로 전환하지 않는다. 본문 최대1080px, 메뉴 최대650px, 카드 열은 반응형 재배치한다.
- 오늘의 첫 동작은 자유 운동 시작/진행 운동 재개. 본인 루틴을 바로 시작하는 행과 기록 요약을 가까이 배치한다. 설정이 없어도 직접 기록 가능하다.
- 운동 목록은 **행 선택 한 번으로 추가**, 정보 아이콘으로 상세를 따로 연다. 기존 상세→추가의 두 동작을 줄인다. 새 루틴은 선택 목록을 처음부터 열고 종목을 연속 선택한다.
- 운동 중 중량/횟수/완료가 기본 행에 있다. 준비/본세트·좌우·RIR은 Accordion에서 선택한다. 운동 추가/마치기는 하단 탭 위 sticky dock으로 유지한다. 종료·취소·복원 등 데이터 영향 동작의 확인은 보존한다.
- 모바일(≤48em)의 상세/확인은 Mantine bottom Drawer, 내용만큼의 높이·최대90dvh·body scroll. 큰 화면은 Mantine Modal. focus trap·Escape·닫은 뒤 opener 복귀.

## 접근성과 보존

주요 버튼/입력44px 이상, 하단 탭 높이60px, 숫자 입력16px, inputMode/실제 label·오류·aria-pressed 유지. 아이콘만 있는 동작은 aria-label, 선택 상태는 색 외 텍스트/현재 위치로 표현한다. skip link·제목 focus/페이지 상단 복귀·reduced motion·표 대안/내부 가로 스크롤을 제공한다. 완료 입력값도 읽을 수 있는 색상을 사용한다. 이 구현 규칙만으로 전체 WCAG/VoiceOver 통과를 선언하지 않는다.

schema2/owner/계정 DB·트랜잭션/outbox·세트 완료·백업/복원·RPC/RLS·볼륨/후보 계산은 유지한다. ProfileForm의 payload key와 미저장 초안/복원 계약을 보존한다. 리뷰 전 운동 주장은 공개하지 않으며 검토되지 않은 개념 그림을 자극 지도처럼 표시하지 않는다.

## 확인과 잔여

자동55개(19 unit/25 integration/11 ui), lint 경고0/build/format. 개발 browser 가짜 과업과 다섯 화면×320/375/390/768/1440px에서 document overflow0, 하단 target 최소56.79×60px. [불변 증거](../../raw/research/2026-10-04-mantine-geist-design-verification.json).

이는 반응형 PWA의 iOS 같은 사용 경험이다. Swift/native app·실제 iPhone 설치/키보드·safe area·VoiceOver·가로/200% 확대·다기기/Auth·production offline/update는 이번 검증 범위 밖이며 RESP-01/REL-02/HAR-03으로 남긴다. [남은 작업](remaining-work.md).
