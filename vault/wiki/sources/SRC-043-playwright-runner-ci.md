---
type: "Reference"
title: "SRC-043 Playwright runner·CI와 엔진 경계"
description: "공식 실행 환경·서비스 워커·실패 증거/CI 보존 안내의 확인 범위."
tags:
  - "source"
  - "testing"
  - "technology"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T15:44:32+09:00"
sources:
  - id: "execution"
    resource: "../../raw/research/2026-10-04-e2e-harness-verification.json"
    title: "실제 실행"
source_id: "SRC-043"
retrieved_at: "2026-10-04T15:44:32+09:00"
review_scope: "official targeted documentation and local runner; no Linux CI or actual iPhone"
---

# SRC-043 Playwright runner·CI와 엔진 경계

확인일2026-10-04. 설치 @playwright/test1.63.0과 lockfile 고정, npm 공식 metadata의 Node>=20을 확인했다. 공식 문서 아래 항목을 표적 확인했으며 문서 전체/실제 iPhone 검토로 표시하지 않는다.

- [webServer](https://playwright.dev/docs/test-webserver): build/preview process, cwd/env/baseURL, 서버 재사용과 종료 설정. 전용4188·reuseExistingServer:false는 이 프로젝트의 구현 선택이다.
- [configuration](https://playwright.dev/docs/test-configuration): projects/retries/reporters. retries0·고유 실행ID는 최초 실패 보존을 위한 운영 선택이다.
- [Service Workers](https://playwright.dev/docs/service-workers): 지원은 Chromium 경계, ready/activation과 page control을 구분한다. 실제 SW 준비와 controller 확인 후 offline reload를 실행했다. WebKit에서는 SW를 차단하고 UI/IndexedDB만 검사한다.
- [CI](https://playwright.dev/docs/ci-intro): npm ci·브라우저/OS 의존성 설치·테스트·report 보존. 이 프로젝트의 Linux/Node24 GitHub 실행은 아직 확인하지 않았다.
- [GitHub artifact](https://docs.github.com/en/actions/tutorials/store-and-share-data): upload-artifact와 retention-days 설정, 보관 상한은 repo/org/enterprise 정책에 따름. 7일·엔진별 이름·실패 후 always upload는 구현 정책이다. public repo artifact를 비공개 보관소로 표현하지 않는다.
- [npm metadata](https://registry.npmjs.org/@playwright/test/1.63.0): package/engine 범위 확인. 새 런타임 라이브러리나 제품 기능 변경은 없다.

로컬 macOS arm64/Node25.8.1, Chromium153.0.8010.12/WebKit26.6에서 실행했다. desktop WebKit은 실제 Safari/iOS의 설치·키보드·잠금·저장 정책 통과를 뜻하지 않는다. [실행 증거](../../raw/research/2026-10-04-e2e-harness-verification.json)와 [하네스](../operations/testing-harness.md)에 검사 범위를 기록했다.
