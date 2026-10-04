---
type: "Platform Proposal"
title: "iOS 개인 앱의 설치·배포와 구현 방향"
description: "본인 우선·지인 제공 조건에서 PWA와 네이티브 경로를 비교하는 기획 제안."
tags:
  - "product"
  - "ios"
  - "distribution"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T22:16:02+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-03-002.md"
    title: "CONV-0002 원문"
  - id: "SRC-016"
    resource: "../sources/SRC-016-iphone-web-app.md"
    title: "Apple — iPhone 홈 화면 웹앱"
  - id: "SRC-017"
    resource: "../sources/SRC-017-apple-developer-account.md"
    title: "Apple — 개인 테스트 계정과 개발자 등록 비용"
  - id: "SRC-018"
    resource: "../sources/SRC-018-testflight.md"
    title: "Apple — TestFlight 베타 배포"
  - id: "SRC-019"
    resource: "../sources/SRC-019-ad-hoc-devices.md"
    title: "Apple — Ad Hoc 등록 기기 배포"
  - id: "SRC-020"
    resource: "../sources/SRC-020-webkit-storage.md"
    title: "WebKit — 웹 저장소와 보존 정책"
  - id: "SRC-021"
    resource: "../sources/SRC-021-healthkit.md"
    title: "Apple — HealthKit 연동 범위"
  - id: "pwa-choice"
    resource: "../../raw/conversations/2026-10-03-003.md"
    title: "PWA 선택"
  - id: "technology"
    resource: "technology-data-storage.md"
    title: "언어·저장 제안"
  - id: "stack-agreement"
    resource: "../../raw/conversations/2026-10-03-004.md"
    title: "스택 동의와 배포·보안 의견 요청"
  - id: "deployment"
    resource: "deployment-security.md"
    title: "배포·보안 추천"
  - id: "implementation-request"
    resource: "../../raw/conversations/2026-10-03-005.md"
    title: "계획 요청과 운동 우선 선택"
  - id: "implementation-plan"
    resource: "implementation-plan.md"
    title: "단계별 작업계획"
  - id: "responsive-local-request"
    resource: "../../raw/conversations/2026-10-03-006.md"
    title: "반응형·사용자별 설정·로컬 구현 요청"
  - id: "local-contract"
    resource: "implementation-contracts.md"
    title: "로컬 구현 계약"
  - id: "local-progress"
    resource: "implementation-progress.md"
    title: "실행 결과와 남은 작업"
  - id: "iphone-user-report"
    resource: "../../raw/research/2026-10-04-iphone-install-user-report.json"
    title: "실제 iPhone 설치·실행·로그인 사용자 확인"
version: "0.2.2"
approval_status: "proposal"
change_id: "CHG-0005"
---

# iOS 개인 앱의 설치·배포와 구현 방향

## 실제 iPhone 확인 — 사용자 보고, 2026-10-04

사용자가 운영 앱의 iPhone 홈 화면 설치·실행·로그인에 “홈 화면 실행·로그인 완료”라고 응답했다. [CONV0020](../conversations/2026-10-04-020.md)·[확인 범위](../../raw/research/2026-10-04-iphone-install-user-report.json). 해당 세 과업은 사용자 보고로 확인했으며 에이전트의 직접 기기 관찰·OS 재측정은 아니다. 앞선 ‘응답 대기’ 문단은 당시 이력이다.

REL02는 부분 진행이다. 실제 운동/모바일 클라우드 왕복·새 기기 복원·키보드/VoiceOver/확대/가로/잠금·오프라인/업데이트/physical quota/eviction 검사는 남는다. 설치·로그인 확인을 G3 전체 통과로 확대하지 않는다. 운영 앱은 e912f0c이며 진행 중인 루틴 복구는 아직 배포하지 않았다.


> 2026-10-03 갱신. **PWA 진행은 CONV-0003에서 사용자 선택으로 확정**했다. 이전 비교는 선택 근거로 보존한다. TypeScript·React/Vite·Dexie·Supabase 방향은 CONV-0004에서 동의했다. 배포·보안 설정은 별도 제안이다. 앱은 아직 구현하지 않았다.

## 판단과 이유

현재 범위에는 **iPhone 홈 화면에 추가하는 PWA**를 우선 추천한다. 운동 탐색·근육 그림·루틴·세트 기록·리포트·식단 입력은 웹 구현에 적합하다는 판단이다. 설치와 제공을 단순화하여 실제 헬스장에서의 기록 편의성, 근거 콘텐츠, 개인화 계산에 집중할 수 있다. 설치 방식은 운동 과학적 타당성과 별개다.

Safari에서 사이트를 열고 공유 → 홈 화면에 추가 → 웹 앱으로 열기 → 추가하면 아이콘으로 실행할 수 있다. 메뉴는 iOS 버전에 맞춰 안내한다. [Apple 설치 안내](../sources/SRC-016-iphone-web-app.md). App Store 심사·네이티브 서명 없이 링크로 제공하는 경로를 제안한다. Apple 개발자 등록비는 필요 없지만 호스팅·도메인·AI 비용은 별도다.

## 선택지 비교

| 방식 | 본인·지인 설치 | 관리 조건 | 현재 판단 |
|---|---|---|---|
| PWA | Safari에서 홈 화면 추가, 지인에게 사이트 링크 제공 | 웹 호스팅·업데이트·백업 설계 | 첫 버전 추천 |
| 네이티브 + 무료 Personal Team | Xcode로 개인 기기 시험 설치 | 무료 개인 프로비저닝이 발급 후 7일 만료; 재빌드·재설치 | 짧은 실기기 시험 후보 |
| 네이티브 + TestFlight | 초대로 무료 TestFlight에서 베타 설치 | 유료 개발자 등록; 빌드 최대 90일; 외부 그룹 첫 빌드 검토 | 네이티브 기능이 필요할 때 시험 배포 후보 |
| 네이티브 + Ad Hoc | 계정에 등록한 기기에 직접 설치 | 유료 등록·기기/서명 관리; 제품군별 연 100대 | 운영 부담 때문에 기본 경로로는 후순위 |

조건 출처: [개인 계정·비용](../sources/SRC-017-apple-developer-account.md) · [TestFlight](../sources/SRC-018-testflight.md) · [Ad Hoc](../sources/SRC-019-ad-hoc-devices.md). Developer Program 기준은 연 99 USD이고 실제 지역별 결제액은 가입 화면에서 확인한다. 지인이 개발자 등록비를 각자 부담하는 구조는 아니다. TestFlight는 베타 운영이며 장기 사용에도 새 빌드 관리가 필요하다.

## 첫 버전의 기능과 저장 구조 제안

| 영역 | 첫 방향 | 실제 검증할 점 |
|---|---|---|
| 운동 중 화면 | 한 손 조작, 큰 세트 완료 버튼, 이전 값 재사용 | 본인 iPhone에서 키보드·스크롤·입력 속도 |
| 운동 지식 | 검토된 운동 카드·2D 근육 그림·근거 링크 | 작은 화면의 이해도·콘텐츠 접근성 |
| 루틴·기록 | 기기에 먼저 저장, 계정 DB 동기화를 실사용 버전부터 추천 | 비행기 모드·중복 전송·계정별 분리·기기 변경 복구 |
| 리포트 | 계산 가능한 집계·규칙부터, 설명용 AI는 선택 | AI 접속 실패에도 기록·기본 리포트 사용 |
| 식단 | 음식 검색·즐겨찾기·직접 입력부터 확장 | 식품 DB 품질·입력 지속성 |
| 백업 | 버전이 있는 JSON 내보내기·가져오기, CSV 열람 보조 | 새 저장소에 루틴·세션·단위까지 복원 |

오프라인은 별도 구현한다. 서비스 워커로 앱 화면·필요 콘텐츠를 캐시하고 IndexedDB로 루틴·기록을 저장하는 안을 검증한다. 첫 방문의 준비 완료 여부와 온라인이 필요한 기능을 표시한다. 캐시 버전 교체·DB 스키마 변경 중에도 이전 운동 기록이 유지되어야 한다.

웹 저장소는 기본 보존이 보장되지 않으므로 외부 백업과 복원 기능을 첫 버전에 넣는다. 지속 저장 요청도 성공 여부를 확인하며 백업을 대체하지 않는다. [WebKit 정책](../sources/SRC-020-webkit-storage.md). 기기 변경·사이트 데이터 삭제 상황에서 복원 과업을 검증한다. 휴식 타이머는 화면 복귀 시 종료 시각으로 다시 계산하는 안을 검증하며 화면 잠금 중 소리/알림을 보장한다고 약속하지 않는다.

이전의 로그인 없는 로컬 프로필은 화면/입력 시험 경로로 남긴다. 이번 데이터 저장 논의에서는 **실제 기록을 쌓는 버전부터 기기 저장과 계정 DB 동기화를 함께 두는 안**을 우선 추천한다. TypeScript·React/Vite·Dexie·Supabase의 역할은 [언어·저장 제안](technology-data-storage.md)에서 확인한다. Supabase 방향에는 동의했고 로그인 방식은 미정이다. [배포·보안](deployment-security.md). 외부 AI를 호출할 경우 서비스 API 키를 앱에 넣지 않고 서버가 호출하며, 최소한의 데이터만 사용한다.

지인에게 제공할 때 각자의 기기 기록을 독립 유지하는 경로와 계정 기반 동기화 경로를 구분한다. 서버에 개인 기록을 올리면 인증·사용자별 접근 제한이 필요하다. 링크 공유만으로 초대자 전용 접근이 구현되지는 않으므로 공개 운동 정보와 개인 기록의 접근 범위를 정한다. 실제 건강 기록은 기획 vault에 넣지 않는다.

## 네이티브를 먼저 선택하거나 전환할 조건

- 건강 앱의 체중·운동 등 데이터 연동이 첫 필수 기능이 된다.
- Apple Watch에서 세트를 기록하거나 워치 운동 경험을 제공해야 한다.
- 화면 잠금 중 알림 등 요구가 PWA의 실기기 시험에서 충족되지 않는다.
- 웹 입력의 체감 속도·기록 보존 요구가 충분히 충족되지 않는다.

[HealthKit](../sources/SRC-021-healthkit.md)은 건강·피트니스 데이터 연동의 공식 프레임워크다. 위 조건은 구현 방식 재평가 기준으로 제안한다. 네이티브로 갈 때 iOS 전용 구현을 검토하고 TestFlight로 지인 시험을 시작하는 경로가 후보이며 기술 스택은 아직 결정하지 않는다. 웹 화면을 그대로 재사용할 수 있다고 가정하지 않고 운동 콘텐츠·계산 규칙·데이터 내보내기 형식부터 분리한다.

## 규모에 따른 기획 조정

첫 성공은 본인이 운동 중 계속 쓰고 기록으로 다음 운동을 결정하는 것이다. 회원 성장·가격·구독보다 기록 속도·보존·설명 신뢰성·운영비를 먼저 검증한다. 초기에는 본인의 루틴에 필요한 운동을 검토하고 사용성이 안정된 후 지인에게 시험 제공한다. 소규모 사용이어도 추천 근거·계산 품질은 그대로 검토한다.

## 미결 사항과 추적

PWA와 기본 스택은 방향을 채택했다. 보고된 iPhone 16 Pro Max·iOS 27.0.1은 반응형 대상 중 하나의 파일럿 기기다. 실제 설치/기록/복원/업데이트는 REL-02에서 검증한다. 호스트/도메인·계정/초대/SMTP·사이트 전체 접근 제한·지원 OS 하한·건강 앱/Watch·동기화/백업·운영비는 미정이다. [구현 계획](implementation-plan.md). [Q-03/Q-09/Q-11~12](open-questions.md) · [결정 기록](../decisions/decision-register.md).

[CONV-0002](../conversations/2026-10-03-002.md) · [CHG-0002](../../history/changes/CHG-0002.md) · [CONV-0003](../conversations/2026-10-03-003.md) · [CHG-0003](../../history/changes/CHG-0003.md) · [PRD](prd.md)

## CONV-0006 이후 현재 구현 경계

특정 iPhone 모델에 한정하지 않는 반응형과 각 사용자별 목표·주당 횟수·분할·시간·장비·단위·시간대 설정을 요구사항으로 추가했다. 본인의 조건은 하나의 시험 표본이다. Supabase 프로젝트가 없으므로 로컬부터 구현한다는 사용자 선택을 반영했다. [로컬 계약](implementation-contracts.md) · [실행 결과](implementation-progress.md).

로컬 프로필/기록·루틴 스냅샷·백업·사실 집계·PWA는 구현했으며 계정/RLS·서버 전송·실제 iOS·검토된 시각/설명·추천/티어·완전한 개인화·배포는 미완료다. 기존 실사용/지인 제공 관문은 유지한다. 로컬 프로필을 인증 계정으로, 개념도를 자극 범위로, 분류별 행 수를 근육 성장량으로 표시하지 않는다.
