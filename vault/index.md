---
okf_version: "0.2"
---

# 웨이트 트레이닝 앱 — 기획과 지식 베이스

옵시디언에서 이 `vault` 폴더를 열고 시작한다. 현재 기획은 **0.6.1 브레인스토밍 초안**이다.

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
- [출처 노트 39개](wiki/sources/index.md) — 공식 규격·기관·운동/영양 연구·iOS 기술 안내.
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

과학 자료는 **2026-10-03 초기 표적 탐색**, 하네스 기술/코드 확인은 **2026-10-04**다. 일부 연구는 초록만 확인했고 공개 전 전문 검토가 남았다. app0.2.0/schema2에 전체 Mantine/Geist 차콜·노란 강조·하단 UI를 적용했다. 최신unit19/integration25/ui11·55개를 통과했다. CONV-0010의 수동25폭/화면 조합과 CONV-0011의 색상/320·390·1440px 관찰을 구분한다. 기존 Auth/계정 DB·manual snapshot·SQL16·비로그인HTTP 이력을 보존한다. 실제 Auth·자동 browser E2E/외부 CI·iPhone/배포·콘텐츠 전문 검토·자동 문서 감지는 남았다.
