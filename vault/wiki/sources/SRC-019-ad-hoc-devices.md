---
type: "Reference"
title: "Apple — Ad Hoc 등록 기기 배포"
description: "개발자 계정에 등록한 기기에 Ad Hoc으로 직접 설치할 수 있다. 등록 한도는 멤버십 연도별 제품군당 100대다."
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
    resource: "https://developer.apple.com/help/account/devices/devices-overview/"
    title: "Apple — Ad Hoc 등록 기기 배포"
source_id: "SRC-019"
resource: "https://developer.apple.com/help/account/devices/devices-overview/"
review_scope: "등록 기기 직접 설치와 연간 기기 한도 본문 확인; 서명·설치 절차 미시험"
retrieved_at: "2026-10-03T18:27:13+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# Apple — Ad Hoc 등록 기기 배포

## 출처와 확인 범위

- ID: SRC-019
- 기관: Apple Developer
- 확인일: 2026-10-03
- 유형: 공식 기술·배포 안내
- 읽은 범위: **등록 기기 직접 설치와 연간 기기 한도 본문 확인; 서명·설치 절차 미시험**
- [공식 자료 1](https://developer.apple.com/help/account/devices/devices-overview/)

## 짧은 요약

개발자 계정에 등록한 기기에 Ad Hoc으로 직접 설치할 수 있다. 등록 한도는 멤버십 연도별 제품군당 100대다.

## 한계와 추가 검토

인증서·프로비저닝·기기 등록과 갱신을 별도로 관리해야 한다. 구체적 만료일과 설치 수단은 기술 검증 대상이다. 배포 정책은 실제 구현·공유 직전에 재확인한다.

## 제품 적용 판단

소수 기기의 통제된 시험 후보. 지인에게 간편하게 제공하는 기본 경로로는 운영 부담이 있다는 기획 판단. 공식 문서의 사실과 기획자의 선택 판단을 구분한다.

## Related

[플랫폼·설치·배포](../product/platform-distribution.md) · [주장-근거 지도](../concepts/evidence-map.md) · [수집 기록](../../raw/research/2026-10-03-ios-distribution-research.json)
