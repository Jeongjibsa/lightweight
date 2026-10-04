---
okf_version: "0.2"
---

# 웨이트 트레이닝 앱 — 기획과 지식 베이스

옵시디언에서 이 `vault` 폴더를 열고 시작한다. 현재 기획은 **0.8.10 브레인스토밍 초안**이다.

## 먼저 읽기

- [디자인 시스템](wiki/product/design-system.md) · [전체 화면 감사](wiki/product/design-audit.md) — 차콜·노란 강조/iOS형·전 폭 하단 메뉴·빠른 접근.

- [볼륨·추이·오늘 후보 MVP](wiki/product/volume-history-mvp.md) — 추가 요구와 단계/계산 경계.
- [작업 단위 commit](wiki/operations/commit-workflow.md) — 지속 요청과 local commit 운영.

- [현재 기술 스택](wiki/product/technology-stack.md) — 전체 Mantine/Geist/정확한 라이브러리 버전.
- [Supabase 연결/계정 준비](wiki/product/supabase-integration.md) — 현재 구현과 실제 계정 검증 절차.

- [앱 기획서](wiki/product/prd.md) — 목적·요구·흐름·MVP·확장.
- [iOS 설치·배포](wiki/product/platform-distribution.md) — PWA 채택과 설치 검토.
- [언어·개인 데이터 저장](wiki/product/technology-data-storage.md) — 기본 스택 합의와 동기화 상세 제안.
- [배포·보안 의견](wiki/product/deployment-security.md) — 호스팅·초대 계정·API/preview 접근 검증.
- [구현 작업계획](wiki/product/implementation-plan.md) — 단계·완료/제공 조건·공수 가정.
- [구현 백로그](wiki/product/implementation-backlog.md) — 작업 ID·의존성·상태·요구 추적.
- [남은 작업 우선순위](wiki/product/remaining-work.md) — 하네스부터 운동 MVP/식단까지.
- [현재 하네스와 확장](wiki/operations/testing-harness.md) — 자동 검사·실제 browser·CI의 경계.
- [개선 루프](wiki/operations/loop-engineering.md) — 실패 재현·작은 수정·회귀와 이력.
- [현재 구현과 다음 작업](wiki/product/implementation-progress.md) — 로컬 증분·검사·미완료 범위.
- [반응형·설정·보존 계약](wiki/product/implementation-contracts.md) — 프런트/기기 데이터 기준.
- [미결 사항](wiki/product/open-questions.md) — 다음 대화 질문·가정.
- [결정과 제안](wiki/decisions/decision-register.md) — 명시 요구와 제안 상태.
- [변경 이력](log.md) — 날짜별 작업.

## 제품과 근거

- [제품 상세](wiki/product/index.md) — 운동·티어·추천·기록·리포트·영양·데이터·검증.
- [출처 노트 47개](wiki/sources/index.md) — 공식 규격·기관·운동/영양 연구·iOS 기술 안내.
- [주장-근거 지도](wiki/concepts/evidence-map.md) — 적용·상충·공백.
- [보존 원본](raw/index.md) — 사용자 발언·수집 당시 기록.

## 대화와 관리

- [대화](wiki/conversations/index.md) — 요구·수정 맥락.
- [변경 기록](history/changes/index.md) — 전후·이유·영향.
- [PRD 스냅샷](history/versions/index.md) — 전체 버전 보관.
- [검증 결과](history/validation-latest.json) — 구조·링크·해시.
- [운영](wiki/operations/index.md) — LLM Wiki·OKF·근거 정책.
- [양식](templates/index.md) — 출처·변경 작성.
- [시각 자료](assets/index.md) — 추후 콘텐츠.

과학 자료는2026-10-03 초기 표적 탐색이며 일부 초록/전문 미검토 자료가 있다. 현재 PRD0.8.10·app0.2.0/schema2·Mantine/Geist/차콜·노란 강조·하단 UI. [운영 앱](https://lightweight-training.pages.dev)과 DB 연결 없는 preview를 배포했다.83개 Vitest·Node계약8개(배포3/공개5)·browser22를 통과했다. 순서 단위 e912f0c의 GitHub3job·운영/preview 공개24file 일치 배포를 확인했다. 새 공개 gate96bbb74 CI/운영·preview24file 일치 확인 완료. Auth 등록1개/허용1개·명시 승인 후 실제 Chrome 빈 프로필 전송/조회/같은 기기 적용을 확인했다. 실제 운동/새 기기·A/B/만료·로그아웃/메일은 남는다. 실제 Auth/다기기·iPhone·과학 공개/전문가·운영 복구·파일럿과 전체 운동 MVP는 남는다. [현재 남은 작업](wiki/product/remaining-work.md). 아래 링크는 누적 증분이며 당시 검사와 최신 상태를 구별한다.

- [최신 컴포넌트 재감사](wiki/product/component-review.md) — 다섯 페이지 수정 전/후·펼친 선택창·55개 검사·20폭/화면 관찰.
- [3D 해부학 애니메이션 검토](wiki/product/anatomy-3d-feasibility.md) — FR-17·P2후순위, 가능성/자산/검토·실기기 관문.

- [프로필/백업 후속 루프](raw/research/2026-10-04-profile-backup-dom-loop.json) — 최초3제품 실패·새4DOM 계약·59개 통과; 실제 Auth/자동 browser 별도.

- [자동browser 최신증분](raw/research/2026-10-04-e2e-harness-verification.json) — Chromium5/WebKit4·실제offline/파일·실패artifact; 다음HAR04.

- [저장 보존 최신증분](wiki/operations/storage-recovery-harness.md) — 백업/업데이트 제품실패 재현·수정과nativeDB검사.

- [Cloudflare 공식 연결/배포 운영](wiki/operations/cloudflare-setup.md) — skills16/MCP5 확인·main MCP OAuth 성공/계정 읽기HTTP200·cf 생략 선택; 특화 MCP/CLI 인증·HTTPS 배포 별도.

- [압축 백업 독립 복구](wiki/operations/compressed-backup.md) —66개/18browser/새6회·10MiB초과24,000세트 복구.

- [최신 기록 재사용/수정](wiki/operations/record-reuse.md) —72개/20browser/새6회·과거/시각/CAS 보존. Pages 제한 인증 성공, project/HTTPS 후속 완료는 최신 배포 문서를 참조한다.

- [최신 주간 기록 점검](wiki/operations/report-coverage.md) —78개/browser20·기간/상태/조건/입력 revision·직접 수정 진입.

- [최신 HTTPS 배포 검사](raw/research/2026-10-04-pages-deployment.json) —운영/preview·23file hash·Auth 반환 URL·계정/iPhone 관문 유지.

- [검토된 설명 공개 관문](wiki/operations/content-publication.md) —기계적 선언/내용·파일 hash·권리 gate, 실제 승인 설명0개·SCI02 in_progress.

- [최신 운영/권한 관문](raw/research/2026-10-04-release-account-gate.json).

- [실제 Auth·빈 프로필 왕복](raw/research/2026-10-04-auth-profile-roundtrip.json).

- [운동 중 순서·알림 가림 개선](wiki/operations/workout-order.md).

- [현재 배포 증거](raw/research/2026-10-04-workout-order-release.json).
