---
type: "Reference"
title: "검증 하네스 구성과 도구별 한계"
description: "Vitest v4·fake-indexeddb·Playwright·React Testing Library 공식 안내의 표적 확인."
tags:
  - "source"
  - "technology"
  - "testing"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T00:33:00+09:00"
sources:
  - id: "vitest-v4"
    resource: "https://v4.vitest.dev/guide/projects"
    title: "Vitest v4 Test Projects"
  - id: "fake-indexeddb"
    resource: "https://github.com/dumbmatter/fakeIndexedDB"
    title: "fake-indexeddb 공식 README"
  - id: "playwright-server"
    resource: "https://playwright.dev/docs/test-webserver"
    title: "Playwright Web server"
  - id: "playwright-projects"
    resource: "https://playwright.dev/docs/test-projects"
    title: "Playwright Projects"
  - id: "playwright-traces"
    resource: "https://playwright.dev/docs/trace-viewer"
    title: "Playwright Trace viewer"
  - id: "playwright-sw"
    resource: "https://playwright.dev/docs/service-workers"
    title: "Playwright Service Workers"
  - id: "react-testing-library"
    resource: "https://testing-library.com/docs/react-testing-library/intro/"
    title: "React Testing Library"
source_id: "SRC-035"
resource: "https://v4.vitest.dev/guide/projects"
review_scope: "공식 기술 문서 표적 확인; 현행 Vitest v4와 최신 안내 차이 구분"
retrieved_at: "2026-10-04T00:33:00+09:00"
stale_after: "2027-01-04T00:00:00+09:00"
---

# 검증 하네스 구성과 도구별 한계

## 출처와 확인 범위

확인일: 2026-10-04. 일차 기술 문서의 아래 항목을 표적 확인했다. 전체 문서 검토나 새 도구 설치·새 E2E 실행을 뜻하지 않는다.

- [Vitest v4 Test Projects](https://v4.vitest.dev/guide/projects) — projects·include·name·extends·실행 선택 본문 확인. v4 구성 기준을 사용한다. 최신 사이트의 v5 기본 상속 설정을 현재 v4에 적용하지 않는다.
- [fake-indexeddb 공식 README](https://github.com/dumbmatter/fakeIndexedDB) — 메모리 구현·디스크 미보존·auto import 및 Node 사용 범위를 확인.
- [Playwright Web server](https://playwright.dev/docs/test-webserver) — webServer의 실행·준비 확인·기존 서버 재사용 설정 설명 확인.
- [Playwright Projects](https://playwright.dev/docs/test-projects) — 브라우저/모바일 viewport·의존 프로젝트·별도 설정 설명 확인.
- [Playwright Trace viewer](https://playwright.dev/docs/trace-viewer) — retain-on-failure·on-first-retry·DOM/행동/console 관찰 범위 확인.
- [Playwright Service Workers](https://playwright.dev/docs/service-workers) — 도구의 SW 지원/관측은 Chromium 중심이라는 주의 및 캐시 역할 확인. Safari 자체의 SW 미지원이라는 뜻으로 해석하지 않는다.
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) — 사용자에게 보이는 DOM·라벨/역할 기반 검사 원칙과 별도 runner 필요 확인.

## 확인한 기능과 적용 판단

- Vitest v4는 이름과 include를 지정한 projects로 서로 다른 실행 환경을 나눌 수 있다. 단위/저장소/UI 검사 분리는 이 프로젝트의 유지보수 제안이다. v4 상속은 명시적으로 설정하고 현재 lockfile 버전에서 검증한다.
- fake-indexeddb는 Node에서 IndexedDB 의존 코드를 시험하는 메모리 구현이다. close/open 성공을 실제 브라우저 프로세스 종료·디스크 보존·iOS 저장소 정책의 증거로 사용하지 않는다.
- Playwright는 테스트 서버 준비와 브라우저별 프로젝트를 구성하고 실패 trace를 보관할 수 있다. 빌드된 PWA의 독립 origin·V1/V2 업데이트 시나리오·CI 실패 보존은 앱에 별도 구현해야 한다.
- Playwright의 SW 관측 지원 제한을 고려해 Chromium PWA 검사와 WebKit 일반 UI 검사를 구분한다. 실제 iOS 설치·키보드·잠금·업데이트는 실기기 과업으로 확인한다.
- React Testing Library는 사용자에게 보이는 DOM과 라벨을 이용한 검사를 권장한다. jsdom 등에서 통과해도 레이아웃·실제 IndexedDB·SW를 검증한 것은 아니다.

이 기능들로 운동 과학이나 추천 정책의 타당성이 자동 보장되지는 않는다. 계산 기대값과 콘텐츠 검토는 독립적으로 정의한다. 현재 앱에는 Vitest/fake-indexeddb만 프로젝트 의존성으로 있으며 React Testing Library/Playwright Test 구성은 아직 없다.

[현재 하네스](../operations/testing-harness.md) · [반복 개선](../operations/loop-engineering.md) · [조사/실행 기록](../../raw/research/2026-10-04-harness-audit.json)
