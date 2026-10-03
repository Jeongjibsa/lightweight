---
type: "Reference"
title: "Vitest·Playwright·Zod — 구현 검증과 입력 계약"
description: "계산·브라우저 흐름·외부 데이터 검증 도구의 공식 기능과 적용 한계."
tags:
  - "source"
  - "implementation"
  - "testing"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-03T22:02:09+09:00"
sources:
  - id: "tool-1"
    resource: "https://vitest.dev/guide/"
    title: "검증 도구 공식 문서"
  - id: "tool-2"
    resource: "https://playwright.dev/docs/intro"
    title: "검증 도구 공식 문서"
  - id: "tool-3"
    resource: "https://zod.dev/"
    title: "검증 도구 공식 문서"
source_id: "SRC-033"
resource: "https://vitest.dev/guide/"
review_scope: "공식 소개/시작 본문 표적 확인; 설치·실행 미수행"
retrieved_at: "2026-10-03T22:02:09+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# Vitest·Playwright·Zod — 구현 검증과 입력 계약

## 출처와 확인 범위

- ID: SRC-033
- 확인일: 2026-10-03
- 읽은 범위: **각 공식 소개/시작 본문의 실행환경·기능 범위 확인**. 설치·코드 실행·전체 문서 검토는 미수행.
- [Vitest](https://vitest.dev/guide/) · [Playwright](https://playwright.dev/docs/intro) · [Zod](https://zod.dev/)

## 요약과 적용 판단

Vitest는 Vite 기반 테스트 도구다. 계산·단위·결측·충돌 처리의 작은 고정 표본을 검증하는 후보로 제안한다.

Playwright는 Chromium/WebKit/Firefox를 대상으로 웹 흐름을 시험하며 모바일 에뮬레이션을 지원한다. 설치·오프라인·기록/복원 흐름의 자동 검증에 제안한다. 에뮬레이션 결과를 실제 iPhone 홈 화면 앱의 통과로 기록하지 않는다.

Zod는 스키마를 정의해 런타임 입력을 검증한다. 사용자 입력·백업·동기화·콘텐츠/AI 응답 계약 검증 후보로 제안한다. 유효한 형식이 계산 정확성·연구 타당성·DB 접근 권한까지 보장하는 것은 아니다.

도구·Node·Vite·TypeScript의 지원 조건은 BASE-01에서 함께 확인하고 선택 버전/lockfile을 고정한다. 이 문서에서 최신 버전 번호를 확정하지 않는다. 불필요한 컴포넌트별 테스트는 만들지 않고 데이터 보존·계산·권한과 핵심 사용자 흐름에 집중한다.

## Related

[구현 계획](../product/implementation-plan.md) · [작업 목록](../product/implementation-backlog.md) · [수집 기록](../../raw/research/2026-10-03-implementation-planning-research.json)
