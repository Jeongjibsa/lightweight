---
type: "Reference"
title: "DOM 과업 검사의 공식 도구와 환경"
description: "Testing Library/user-event·Vitest v4 jsdom 환경과 설치/검증 범위."
tags:
  - "source"
  - "testing"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T02:20:54+09:00"
sources:
  - id: "rtl"
    resource: "https://testing-library.com/docs/react-testing-library/intro/"
    title: "공식 소개"
  - id: "env"
    resource: "https://v4.vitest.dev/guide/environment"
    title: "v4 환경"
source_id: "SRC-038"
resource: "https://testing-library.com/docs/react-testing-library/intro/"
review_scope: "공식 소개/환경 관련 본문·실제 package engine 확인"
retrieved_at: "2026-10-04T02:20:54+09:00"
---

# DOM 과업 검사의 공식 도구와 환경

SRC-038. 확인일2026-10-04. [React Testing Library 소개](https://testing-library.com/docs/react-testing-library/intro/)의 설치/DOM 역할·사용자 과업 검사를 읽었다. [user-event 소개](https://testing-library.com/docs/user-event/intro)와 [Vitest v4 환경](https://v4.vitest.dev/guide/environment)을 확인했다. 최신 Vitest v5 문서와 현재 v4를 구분한다.

설치한 dev 도구: @testing-library/react16.3.3·dom10.4.2·user-event14.6.7, jsdom27.4.0. registry/current package engine을 확인했다. jsdom30.1.1은 Node24.15 이상 등이 필요해 현재24.14.1과 호환되는27.4.0으로 맞췄다. 별도 Node fork에서 experimental webstorage를 끄고 jsdom 환경을 사용한다.

HAR-02는 실제 WorkoutView·Mantine·Store/Dexie를 DOM에 연결해 라벨/버튼·오류/기록 보존 결과를 검사한다. fake IndexedDB와 jsdom은 실제 브라우저 layout/서비스워커·quota/iOS 검증을 대체하지 않는다. [실제 결과](../../raw/research/2026-10-04-dom-harness-verification.json).
