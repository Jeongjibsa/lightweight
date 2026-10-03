---
type: "Reference"
title: "React·Vite·Vite PWA — 화면과 PWA 빌드"
description: "React는 신규 앱에 프레임워크 사용을 기본 권장하며 Vite 기반 직접 구성을 대안으로 설명한다. Vite에는 React/TypeScript 템플릿이 있다. Vite PWA 플러그인은 manifest와 서비스 워커 생성·등록을 지원한다."
tags:
  - "source"
  - "technology"
  - "pwa"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-03T20:17:12+09:00"
sources:
  - id: "official-1"
    resource: "https://react.dev/learn/creating-a-react-app"
    title: "React·Vite·Vite PWA — 화면과 PWA 빌드"
  - id: "official-2"
    resource: "https://vite.dev/guide/"
    title: "React·Vite·Vite PWA — 화면과 PWA 빌드"
  - id: "official-3"
    resource: "https://vite-pwa-org.netlify.app/guide/"
    title: "React·Vite·Vite PWA — 화면과 PWA 빌드"
source_id: "SRC-023"
resource: "https://react.dev/learn/creating-a-react-app"
review_scope: "각 프로젝트의 공식 앱 생성·템플릿·manifest/서비스 워커 안내 확인; 빌드·iOS 시험 미수행"
retrieved_at: "2026-10-03T20:17:12+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# React·Vite·Vite PWA — 화면과 PWA 빌드

## 출처와 확인 범위

- ID: SRC-023
- 유형: 각 프로젝트의 공식 기술·운영 문서
- 확인일: 2026-10-03
- 읽은 범위: **각 프로젝트의 공식 앱 생성·템플릿·manifest/서비스 워커 안내 확인; 빌드·iOS 시험 미수행**
- [공식 자료 1](https://react.dev/learn/creating-a-react-app) · [공식 자료 2](https://vite.dev/guide/) · [공식 자료 3](https://vite-pwa-org.netlify.app/guide/)

## 짧은 요약

React는 신규 앱에 프레임워크 사용을 기본 권장하며 Vite 기반 직접 구성을 대안으로 설명한다. Vite에는 React/TypeScript 템플릿이 있다. Vite PWA 플러그인은 manifest와 서비스 워커 생성·등록을 지원한다.

## 한계와 추가 검토

React 공식 기본 권고와 이 프로젝트의 Vite 선택 판단을 구분한다. 플러그인만으로 기록 동기화·모든 오프라인 흐름이 완성되지 않는다.

## 제품 적용 판단

운동 중 클라이언트 입력과 별도 관리형 백엔드에 집중하는 작은 PWA로 React+Vite를 추천한다. 업데이트 적용 시점은 운동 중 기록 보호를 기준으로 설계한다. 공식 기능과 앱의 구현 제안을 구분한다.

## Related

[언어·개인 데이터 저장](../product/technology-data-storage.md) · [주장 지도](../concepts/evidence-map.md) · [수집 기록](../../raw/research/2026-10-03-pwa-stack-research.json)
