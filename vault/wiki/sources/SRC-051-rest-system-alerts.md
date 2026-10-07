---
type: "Source Note"
title: "Apple/WebKit 휴식 알림·AlarmKit·Live Activity"
description: "Apple/WebKit 휴식 알림·AlarmKit·Live Activity"
tags: ["training", "ux", "technology"]
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-07T21:33:11+09:00"
sources:
  - id: "capture"
    resource: "../../raw/research/2026-10-07-rest-alert-feasibility.json"
    title: "공식 기술 수집"
source_id: "SRC-051"
review_scope: "Relevant official text and video transcript sections only; no delivery/native/device validation"
---

# SRC-051

2026-10-07의 [수집 범위](../../raw/research/2026-10-07-rest-alert-feasibility.json). WebKit의 [홈 화면 Web Push](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) 알림 권한·Watch·Focus 본문, Apple의 [Watch 알림](https://support.apple.com/en-us/108369)과 [햅틱 설정](https://support.apple.com/en-us/108368) 관련 절을 확인했다. 홈 화면 PWA 푸시가 Watch로 전달될 수 있으며 수신/진동은 잠금·집중 모드·설정 등에 의존한다. 웹에서 Watch 진동 강도나 정확한 수신 시각을 보장한다고 해석하지 않는다.

Apple [WWDC26 Live Activities](https://developer.apple.com/videos/play/wwdc2026/223/) transcript의 ActivityKit·WidgetKit 확장·SwiftUI·기기 간 표시 부분과 [WWDC25 AlarmKit](https://developer.apple.com/videos/play/wwdc2025/230/)의 권한·카운트다운/Live Activity·paired Watch·수명 관리 부분을 읽었다. 영상 전체 시청·Xcode/기기 검증은 하지 않았다. 네이티브 iOS26+ AlarmKit은 타이머/Watch 알림과 countdown Live Activity의 후보다. 앱별 권한이 필요하고 알람은 무음/집중 모드를 통과할 수 있어 휴식 알림의 제품 강도를 먼저 선택해야 한다.

[Service Workers §2.1.1](https://w3c.github.io/ServiceWorker/#service-worker-lifetime)의 이벤트 기반 수명/idle·시간 한도 종료 조건을 읽었다. 브라우저가 60초 후 알림을 항상 실행한다는 계약은 제공할 수 없다. 서버 예약·취소·중복 방지는 기획자의 구현 제안이다. 운동 효과/최적 휴식 시간의 근거가 아니다.
