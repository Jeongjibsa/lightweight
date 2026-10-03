---
type: "Reference"
title: "반응형·로컬 저장·PWA 업데이트의 구현 근거"
description: "W3C Reflow와 Dexie/PWA 공식 기능을 실제 검사와 구분해 기록."
tags:
  - "source"
  - "implementation"
  - "responsive"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-03T23:24:52+09:00"
sources:
  - id: "official-1"
    resource: "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html"
    title: "공식 기술 문서"
  - id: "official-2"
    resource: "https://dexie.org/docs/Dexie/Dexie.transaction()"
    title: "공식 기술 문서"
  - id: "official-3"
    resource: "https://vite-pwa-org.netlify.app/guide/"
    title: "공식 기술 문서"
source_id: "SRC-034"
resource: "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html"
review_scope: "Reflow·트랜잭션·manifest/SW/업데이트 공식 본문 표적 확인"
retrieved_at: "2026-10-03T23:24:52+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# 반응형·로컬 저장·PWA 업데이트의 구현 근거

- ID: SRC-034
- 확인일: 2026-10-03
- 범위: 공식 본문의 아래 항목을 표적 확인. 전체 접근성 인증·운영 보안 감사는 수행하지 않았다.

[W3C Reflow 설명](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)은 일반 세로 콘텐츠를 320 CSS px에서도 정보/기능 손실과 양방향 스크롤 없이 제공하는 기준과 2차원 자료의 예외를 설명한다. 이 앱은 화면 재배치와 320px부터의 시험 기준으로 참고한다. 폭만 확인해서 WCAG 적합성을 선언하지 않는다.

[Dexie transaction](https://dexie.org/docs/Dexie/Dexie.transaction())의 반환 Promise는 커밋 시 완료되고 실패 시 거부된다. 트랜잭션 안에서 관련 없는 외부 비동기 작업으로 수명을 늘리지 않도록 한다. 앱에서는 기기 기록과 변경 항목을 같은 트랜잭션에 저장하며 실제 롤백은 별도 계약 테스트로 확인했다.

[Vite PWA 안내](https://vite-pwa-org.netlify.app/guide/)는 manifest/서비스 워커 생성·등록과 업데이트 흐름을 제공한다. 앱은 업데이트 안내를 표시하고 진행 중 운동이 있을 때 적용을 막는다. 이 동작의 로컬 Chromium 시험과 실제 iOS 시험은 구별한다.

[실행 결과](../product/implementation-progress.md)는 논문 근거가 아닌 코드 검증 증거다. React/Vite 선택의 기존 근거는 [SRC-023](SRC-023-react-vite-pwa.md), 입력/검증 도구는 [SRC-033](SRC-033-development-verification.md)을 유지한다.

## Related

[수집 기록](../../raw/research/2026-10-03-responsive-local-research.json) · [구현 계약](../product/implementation-contracts.md)
