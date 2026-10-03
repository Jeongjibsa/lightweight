---
type: "Reference"
title: "WebKit — 웹 저장소와 보존 정책"
description: "웹 저장소는 기본적으로 best-effort이며 보존이 보장되지 않는다. 저장 공간 부족·할당량·미사용 등의 조건에서 삭제될 수 있다. 지속 모드 요청은 가능하지만 허용 여부는 휴리스틱에 따른다."
tags:
  - "source"
  - "platform"
  - "ios"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-03T18:28:39+09:00"
sources:
  - id: "official-1"
    resource: "https://webkit.org/blog/14403/updates-to-storage-policy/"
    title: "WebKit — 웹 저장소와 보존 정책"
source_id: "SRC-020"
resource: "https://webkit.org/blog/14403/updates-to-storage-policy/"
review_scope: "2023-08-10 공식 저장소 정책 문서의 API·삭제·지속 모드 안내 확인; 현재 기기 시험 미수행"
retrieved_at: "2026-10-03T18:27:13+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# WebKit — 웹 저장소와 보존 정책

## 출처와 확인 범위

- ID: SRC-020
- 기관: WebKit
- 확인일: 2026-10-03
- 유형: 공식 기술·배포 안내
- 읽은 범위: **2023-08-10 공식 저장소 정책 문서의 API·삭제·지속 모드 안내 확인; 현재 기기 시험 미수행**
- [공식 자료 1](https://webkit.org/blog/14403/updates-to-storage-policy/)

## 짧은 요약

웹 저장소는 기본적으로 best-effort이며 보존이 보장되지 않는다. 저장 공간 부족·할당량·미사용 등의 조건에서 삭제될 수 있다. 지속 모드 요청은 가능하지만 허용 여부는 휴리스틱에 따른다.

## 한계와 추가 검토

2023 설명을 현재 목표 iOS의 실제 동작 보장으로 읽지 않는다. 지속 모드와 홈 화면 설치도 외부 백업을 대체하지 않는다. 배포 정책은 실제 구현·공유 직전에 재확인한다.

## 제품 적용 판단

운동 기록을 즉시 로컬 저장하되 내보내기·복원을 첫 버전에 포함하는 제안. 서비스 워커·IndexedDB는 검증할 구현 후보. 공식 문서의 사실과 기획자의 선택 판단을 구분한다.

## 수집 메타데이터 정정

원 수집 기록의 발행일 표기는 [추가 확인 기록](../../raw/research/2026-10-03-ios-distribution-correction.json)으로 정정했다. 원본은 보존한다.

## Related

[플랫폼·설치·배포](../product/platform-distribution.md) · [주장-근거 지도](../concepts/evidence-map.md) · [수집 기록](../../raw/research/2026-10-03-ios-distribution-research.json)
