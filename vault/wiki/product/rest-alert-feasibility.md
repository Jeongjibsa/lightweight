---
type: "Technical Feasibility"
title: "휴식 완료 알림·Watch·잠금화면 실시간 현황 검토"
description: "휴식 완료 알림·Watch·잠금화면 실시간 현황 검토"
tags: ["training", "ux", "technology"]
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-07T21:33:11+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-07-025.md"
    title: "명시 요구"
  - id: "source"
    resource: "../sources/SRC-051-rest-system-alerts.md"
    title: "공식 기술 검토"
version: "0.1.0"
change_id: "CHG-0037"
---

# 휴식 완료 알림과 실시간 현황

CONV0025 / FR-19 / **검토만 완료, 후순위 P2**. 사용자는 가능성 검토를 요청했다. 원격 알림 전송·권한 요청·구독 저장·네이티브 설치는 구현하지 않았다. [공식 출처/읽은 범위](../sources/SRC-051-rest-system-alerts.md).

| 경험 | 현재 PWA에서 가능한 범위 | 추가 구성과 경계 |
|---|---|---|
| 앱 내부 캡슐 | 구현: 스크롤 중 남은 시간/상태·일시정지/재개·조작창 | 앱 화면 안의 Mantine UI. 시스템 Dynamic Island/잠금화면 UI와 구별 |
| 휴식 완료 푸시·Watch 알림 | 홈 화면 PWA의 Web Push를 통해 조건부 가능 | 사용자 탭 후 알림 권한, Push subscription·server scheduler·SW push 처리 필요. 수신/진동은 OS·Watch/집중 모드·연결 설정에 의존 |
| 잠금화면 Live Activity·실제 Dynamic Island | 현재 PWA에서 직접 사용 불가 | 설치 가능한 iOS 앱·ActivityKit·SwiftUI WidgetKit extension. 서버 APNs 갱신도 네이티브 기반/토큰이 필요 |
| OS 타이머와 Watch 알람 | 네이티브 iOS/iPadOS26+ AlarmKit 후보 | 앱별 alarm 권한·WidgetKit countdown Live Activity·App Intents와 pause/resume/cancel 수명 관리. paired Watch 알람 경험도 가능, 실기기 검증 필요 |

**제안:** 우선 PWA 기록 UX를 완성하고, 잠금 상태의 정확한 로컬 타이머가 중요해질 때 기존 React 화면을 재사용하는 iOS shell/bridge + AlarmKit/Live Activity prototype을 비교한다. 외부 push만으로 1초 단위 countdown을 계속 전송하는 구조는 제안하지 않는다. 네이티브 목표가 확정되기 전 SDK/bridge 패키지·Xcode target을 설치하지 않는다. Web Push만 필요한 경우 별도 PWA 증분으로 진행할 수 있다.

푸시는 일반 알림이며 지속 countdown Live Activity가 아니다. PWA의 setInterval/setTimeout이나 서비스워커 장시간 대기로 잠금 후 완료 알림을 보장할 수 없다. 현재 타이머는 deadline을 저장하고 복귀 때 남은 시간을 재계산한다. 알림은 보내지 않는다. 서버 예약안은 인터넷/전송 지연·오래된 예약/취소 실패를 다뤄야 한다. 이 내용은 Service Worker 수명 규격에서 도출한 구현 판단이다.

## 후속 작업과 완료 관문

- PWA push 선택 시: 전용 사용자 권한 동작·subscription account/device 격리·HTTPS/server 비밀 VAPID 관리, 최소 내용의 알림, session/set generation+deadline 기반 예약·cancel/pause/resume/새 세트/종료·중복 및 TTL 검사. 현재 수동 snapshot 동기화에 매초 타이머 상태를 넣는 방식과 분리한다. 허용 목록/RLS를 넓히지 않는다. 구독 endpoint·기기 토큰은 공개 vault/Git에 보관하지 않는다.
- 네이티브 선택 시: 지원 iOS 범위·배포 방식·개발자 계정/서명·Watch/watchOS 표본을 확정하고 한 세트의 native countdown·잠금/종료·pause/resume/cancel·앱 재실행/오프라인을 시험한다. AlarmKit의 강한 알람(무음/Focus 통과 가능)과 일반 notification의 부드러운 알림을 선택형으로 설계한다. Live Activity 표시만으로 Watch 진동 완료를 선언하지 않는다.
- 실제 iPhone/paired Watch에서 foreground/locked·Watch 잠금/미착용·Focus·권한 거부/회수·네트워크 끊김·기기 재시작·기존 세트 취소/새 세트/운동 종료 후 오래된 알림 방지 관문을 통과한다. Simulator/WebKit 통과는 이 검증을 대신하지 않는다.

[현재 접기/고정 타이머 계약](../operations/workout-collapse-timer.md) · [남은 작업](remaining-work.md) · [미결](open-questions.md).
