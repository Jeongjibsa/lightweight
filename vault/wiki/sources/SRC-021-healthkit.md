---
type: "Reference"
title: "Apple — HealthKit 연동 범위"
description: "HealthKit은 iPhone과 Apple Watch의 건강·피트니스 데이터 저장소를 제공하는 프레임워크다."
tags:
  - "source"
  - "platform"
  - "ios"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-03T18:27:13+09:00"
sources:
  - id: "official-1"
    resource: "https://developer.apple.com/documentation/healthkit"
    title: "Apple — HealthKit 연동 범위"
source_id: "SRC-021"
resource: "https://developer.apple.com/documentation/healthkit"
review_scope: "공식 검색 결과·문서 소개 확인; JS 문서의 전체 API·권한 구현은 미검토"
retrieved_at: "2026-10-03T18:27:13+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# Apple — HealthKit 연동 범위

## 출처와 확인 범위

- ID: SRC-021
- 기관: Apple Developer
- 확인일: 2026-10-03
- 유형: 공식 기술·배포 안내
- 읽은 범위: **공식 검색 결과·문서 소개 확인; JS 문서의 전체 API·권한 구현은 미검토**
- [공식 자료 1](https://developer.apple.com/documentation/healthkit)

## 짧은 요약

HealthKit은 iPhone과 Apple Watch의 건강·피트니스 데이터 저장소를 제공하는 프레임워크다.

## 한계와 추가 검토

세부 권한·지원 기능·Watch 앱 설계는 후속 기술 검토가 필요하다. 사용자에게 이 기능이 필요하다고 가정하지 않는다. 배포 정책은 실제 구현·공유 직전에 재확인한다.

## 제품 적용 판단

건강 앱 데이터 연동이나 Watch에서 세트 기록이 핵심 요구가 되면 네이티브 앱부터 재평가한다는 기획 판단. 공식 문서의 사실과 기획자의 선택 판단을 구분한다.

## Related

[플랫폼·설치·배포](../product/platform-distribution.md) · [주장-근거 지도](../concepts/evidence-map.md) · [수집 기록](../../raw/research/2026-10-03-ios-distribution-research.json)
