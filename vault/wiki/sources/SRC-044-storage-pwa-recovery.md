---
type: "Reference"
title: "SRC-044 저장 실패와 PWA 업데이트 검사"
description: "공식 기술 안내의 표적 읽기와 프로젝트 자체 파일 한도·오류 주입의 구분."
tags:
  - "source"
  - "technology"
  - "testing"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T16:22:01+09:00"
sources:
  - id: "execution"
    resource: "../../raw/research/2026-10-04-storage-recovery-verification.json"
    title: "자체 실행"
source_id: "SRC-044"
retrieved_at: "2026-10-04T16:22:01+09:00"
review_scope: "targeted official technical docs; not physical quota/eviction or iPhone validation"
---

# SRC-044 저장 실패와 PWA 업데이트 검사

확인일2026-10-04. 연구/건강 근거가 아닌 기술 자료다.

- [Vite PWA prompt](https://vite-pwa-org.netlify.app/guide/prompt-for-update.html): default prompt, 변경한 asset의 precache revision, onNeedRefresh와 사용자가 누르는 updateSW의 reload 흐름, 오래된 cache 정리 단락을 확인했다. 문서 표기v1.2.0과 설치v1.3.0 차이를 기록하고 실제 설치 버전으로 검사했다. 전체 문서·다중 tab 업데이트 검토 아님.
- [MDN quotas/eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria): IndexedDB 등은 browser별 quota이며 초과 write에 QuotaExceededError가 발생한다는 단락과 pressure/eviction 설명을 표적 확인했다. 모든 OS 정책/정확한 실제 quota를 검증한 것은 아니다. 앱이 정한 JSON 10MiB 한도와 browser quota는 별개다. 이 검사에서 디스크를 채우거나 eviction을 재현하지 않았다.
- [Playwright Service Workers](https://playwright.dev/docs/service-workers): Chromium 지원 경계·ready/controller 구분을 재확인했다. WebKit의 UI/IndexedDB 검사를 실제 Safari/iPhone의 SW 통과로 표시하지 않는다.

compact JSON·10MiB 대칭 한도·fault injection 위치·두 빌드 전환 서버는 프로젝트 구현 정책이다. 사용자 또는 위 자료가 구체 수치/검사 횟수를 승인했다고 기록하지 않는다. [실제 실행](../../raw/research/2026-10-04-storage-recovery-verification.json) · [검사 설계](../operations/storage-recovery-harness.md).
