---
type: "Design Specification"
title: "Mantine·Geist 차콜 디자인 시스템"
description: "전체 화면 토큰·타이포그래피·하단 메뉴·빠른 접근·데이터 보존 계약."
tags:
  - "design"
  - "product"
  - "accessibility"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-07T21:33:11+09:00"
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
  - id: "tone-request"
    resource: "../../raw/conversations/2026-10-04-011.md"
    title: "Monokai/Mantine 톤 변경 요구"
  - id: "tone-verification"
    resource: "../../raw/research/2026-10-04-charcoal-theme-verification.json"
    title: "차콜 증분 실행"
  - id: "tone-reference"
    resource: "../sources/SRC-040-charcoal-tone.md"
    title: "공식 디자인 참고"
  - id: "component-request"
    resource: "../../raw/conversations/2026-10-04-012.md"
    title: "컴포넌트 재점검/3D 요구"
  - id: "component-check"
    resource: "../../raw/research/2026-10-04-component-review.json"
    title: "실제 페이지별 관찰"
  - id: "request22"
    resource: "../../raw/conversations/2026-10-04-022.md"
    title: "카탈로그·휴식·제목·Git·Google 요청"
  - id: "request22-loop"
    resource: "../../raw/research/2026-10-04-catalog-rest-timer-loop.json"
    title: "실행/캡처"
  - id: "git-google"
    resource: "../../raw/research/2026-10-04-git-oauth-review.json"
    title: "Git 구성/Google 검토"
  - id: "workout-ux-request"
    resource: "../../raw/conversations/2026-10-07-025.md"
    title: "운동 접기/휴식 접근 요구"
version: "0.2.0"
change_id: "CHG-0012"
---

# Mantine·Geist 차콜 디자인 시스템

CONV-0010→0012 / FR-12·16 / PRD0.7.0 / branch `codex/mantine-blue-dark`. [요구](../../raw/conversations/2026-10-04-010.md) · [감사/실행](design-audit.md) · [정확한 스택](technology-stack.md).

## CONV-0012 컴포넌트 보정

입력/선택은 Mantine filled TextInput/PasswordInput/Select·radius12px·dark6 표면, 일반 Paper는16px radius/20px padding·기본 border 없음. 필수 선택은 allowDeselect=false, 긴 기록/프로필 목록만 searchable. 내장 Accordion은 default/transparent item·control/panel 좌우16px·48px control·heading order, padding0 override 금지. 루틴 이름/설명은 Stack, 통계는 SimpleGrid/Stack으로 분리한다. Drawer의 높이/스크롤/배경은 theme에 한곳에 두어 local styles가 배경을 덮어쓰지 않게 한다. [페이지 캡처 재감사](component-review.md). 구체 토큰은 구현 판단이며 full accessibility/실기기 승인이 아니다.

## 톤과 공통 규칙

Mantine9.6.3의 `theme`·`defaultProps`·`styles` API와 layout props로 카드/버튼/입력/목록/표/내비게이션/알림/Auth·클라우드 화면을 구성한다. `forceColorScheme=dark`, 배경dark9 `#1f1f1f`, surfacedark7 `#242424`, elevateddark6 `#2e2e2e`, inputdark6 `#2e2e2e`, primaryyellow4 `#ffd43b`, 본문dark0 `#f1f1f1`, 보조dark1/2. input radius12px·paper16px·sheet24px, 작은 장식보다 입력과 실행을 먼저 배치한다. 실제 palette는 `app/src/theme.ts` 단일 기준이며 위 값은 구현 선택이다. CONV-0011에 따라 [Mantine UI 다크 화면/Monokai 참고](../sources/SRC-040-charcoal-tone.md)로 블루 톤을 대체했다. `primaryColor=yellow`/`primaryShade=4`, `autoContrast=true`; filled ThemeIcon도 variant를 명시해 어두운 전경색을 적용한다. PWA theme-color와 홈 화면 아이콘도 같은 차콜/노란 방향이다.

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

CONV-0011의 색상 증분도 자동55개·lint/build/format 통과. 오늘/리포트390px·설정320px·오늘1440px document overflow0, 주요 filled 버튼 검은 글자/노란 배경·입력·그래프 point 실제 색을 확인했다. [차콜 증거](../../raw/research/2026-10-04-charcoal-theme-verification.json) · [오늘 화면](../../raw/design/2026-10-04-charcoal-today-mobile.png). 아래25조합/기록 과업은 CONV-0010 당시 검사이며 이번에 전체를 재실행하지 않았다.

자동55개(19 unit/25 integration/11 ui), lint 경고0/build/format. 개발 browser 가짜 과업과 다섯 화면×320/375/390/768/1440px에서 document overflow0, 하단 target 최소56.79×60px. [불변 증거](../../raw/research/2026-10-04-mantine-geist-design-verification.json).

이는 반응형 PWA의 iOS 같은 사용 경험이다. Swift/native app·실제 iPhone 설치/키보드·safe area·VoiceOver·가로/200% 확대·다기기/Auth·production offline/update는 이번 검증 범위 밖이며 RESP-01/REL-02/HAR-03으로 남긴다. [남은 작업](remaining-work.md).

## CONV0022 구현/검토 — 2026-10-04

34종목/바벨18·큰 부위 아래 세부 분류/장비·별칭 필터와 사용자 추가 선택을 적용했다. 기본1분·즐겨찾기3~4개·완료 자동 시작·pause/resume/stop·deadline 재실행·profile/outbox/백업 보존을 구현했다. 다섯 H1 outline을 제거하고 programmatic focus는 유지했다.98개/19파일·Node8·전체30browser/최종문구6·build/types/format/artifact25, lint기존6경고. 실제 좁은 화면에서 문구 잘림을 찾아 수정했다. [계약/실행](../operations/catalog-rest-timer.md).

GitHub source=Jeongjibsa/lightweight·main·자동 배포 활성화를 읽었고 dependency 설치/Node24·승인된 production 공개 연결/빈 preview를 보완했다. 새 commit의 자동 Git 배포/원격 CI는 기록 시점 별도다. [배포 운영](../operations/pages-git-integration.md). Google OAuth는 가능하며 현재providerOFF/callback없음·credential/동일UID 연결/가입 차단·실기기 복귀가 필요하다. [검토](google-oauth-review.md). 과학 승인 콘텐츠0개/실제 운동·새 기기/나머지 G3/메일·운영·파일럿/P2 관문과 다음 운동 후 사용자 확인 일정은 유지한다.

## CONV0025 접기/타이머

Mantine multiple Accordion·패널 유지/완료 수 요약과 상단 safe-area 캡슐(max340px/44px controls)을 추가했다. 전체 시각 스타일은 Mantine API·위치는 CSS. 기존 아래5메뉴/sticky dock·Geist/차콜을 유지한다. [계약/실제 화면](../operations/workout-collapse-timer.md). 시스템 Live Activity는 [P2 검토](rest-alert-feasibility.md)다.
