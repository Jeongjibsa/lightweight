---
type: "Feature Specification"
title: "운동 라이브러리와 시각 설명"
description: "운동 탐색·근육 지도·동작·콘텐츠 검토의 기준."
tags:
  - "product"
  - "training"
  - "visual"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-08T00:56:29+09:00"
sources:
  - id: "triceps"
    resource: "../sources/SRC-014-overhead-triceps.md"
    title: "삼두 연구"
  - id: "responsive-local-request"
    resource: "../../raw/conversations/2026-10-03-006.md"
    title: "반응형·사용자별 설정·로컬 구현 요청"
  - id: "local-contract"
    resource: "implementation-contracts.md"
    title: "로컬 구현 계약"
  - id: "local-progress"
    resource: "implementation-progress.md"
    title: "실행 결과와 남은 작업"
  - id: "component-request"
    resource: "../../raw/conversations/2026-10-04-012.md"
    title: "컴포넌트 재점검/3D 요구"
  - id: "component-check"
    resource: "../../raw/research/2026-10-04-component-review.json"
    title: "실제 페이지별 관찰"
  - id: "publication"
    resource: "../operations/content-publication.md"
    title: "공개 계약"
  - id: "publication-check"
    resource: "../../raw/research/2026-10-04-content-publication-gate.json"
    title: "검사"
  - id: "request22"
    resource: "../../raw/conversations/2026-10-04-022.md"
    title: "카탈로그·휴식·제목·Git·Google 요청"
  - id: "request22-loop"
    resource: "../../raw/research/2026-10-04-catalog-rest-timer-loop.json"
    title: "실행/캡처"
  - id: "git-google"
    resource: "../../raw/research/2026-10-04-git-oauth-review.json"
    title: "Git 구성/Google 검토"
  - id: "unit-chg-0044"
    resource: "../../raw/conversations/2026-10-08-027.md"
    title: "SCI 우선: 검토 설명 소비/가슴 연구 검토"
---

# 운동 라이브러리와 시각 설명

## 검토 설명 공개 관문 — 2026-10-04

SCI02의 source registry→선택 공개 JSON 빌드를 추가했다. 초안/보류 제외, human 검토 선언과 payload hash·ID/full_review·한계·권리/asset 파일 hash를 검사하고 reviewer identity/초안을 공개하지 않는다. 승인 설명은0개이며 현재 종목 분류는 기록용 초안이다. 이 기계 검사는 실제 과학/권리·전문 검토를 증명하지 않는다. [계약](../operations/content-publication.md)·[실행](../../raw/research/2026-10-04-content-publication-gate.json).

78개 Vitest + Node8계약·build/types/format/artifact25 통과(lint exit0/기존 경고6). UI/추천 엔진은 변경하지 않았고 SCI02는 in_progress다. 실제 주장/시각/추천 규칙·티어/근육 매핑·offline guide 제공은 검토 후 진행한다. 사용자 본인 계정 등록 진행 중이며 비밀번호를 수집하지 않는다. 기존 main1e1fd9d CI37200956750 success 확인, 새 콘텐츠 관문 CI/배포는 이 저장 당시 별도다.


FR-01·FR-02. [기획서](prd.md). 부위 선택 → 목록 → 상세 → 루틴 추가/기록으로 이어준다.

## 분류와 콘텐츠

가슴·등·어깨·팔·하체·코어부터 분류한다. 한국어/영어/별칭 검색, 근육·장비·동작·숙련도·단측/양측 필터를 제공한다. 운동과 변형을 분리한다. 각도·그립·장비·운동 범위가 연구 결과에 영향을 주면 같은 종목으로 합치지 않는다.

| 영역 | 필드 |
|---|---|
| 기본 | ID·이름·별칭·장비·변형·부하 입력 기준 |
| 근육 | 주/보조/안정화 역할·근육 ID·매핑 근거·검토 상태 |
| 수행 | 기구 설정·시작/끝·동작 순서·흔한 오류·수정 조건 |
| 시각 | 전면/후면 지도·시작/끝 그림·짧은 영상·대체 텍스트 |
| 비교 | 대체 운동·이유·제약·조건별 티어 |
| 근거 | 주장 ID·연구·읽은 범위·검토일·미확인 사항 |

지도는 색뿐 아니라 이름·범례·패턴으로 역할을 구분한다. 확대와 앞/뒤 전환, 근육 이름으로 설명을 제공한다. 모든 사람의 유일한 정답 자세를 가정하지 않고 수행 조건을 설명한다. 근육 내 차이는 연구의 측정 위치와 결과를 연결한다. [표현 근거](../concepts/evidence-map.md).

## 초기 제작 후보

아래는 콘텐츠 후보이며 세부 근육 매핑·수행법·티어가 검토 완료된 목록은 아니다.

| 부위 | 후보 |
|---|---|
| 가슴 | 머신 체스트 프레스·덤벨 벤치 프레스·케이블 플라이 |
| 등 | 랫풀다운·케이블 로우·체스트 서포티드 로우 |
| 어깨 | 머신 숄더 프레스·레터럴 레이즈·리버스 플라이 |
| 팔 | 케이블 컬·프리처 컬·푸시다운·오버헤드 익스텐션 |
| 하체 | 스쿼트·레그 프레스·레그 익스텐션·레그 컬·루마니안 데드리프트·힙 스러스트·카프 레이즈 |
| 코어 | 케이블 크런치·플랭크 |

실제 비교 근거 예시: [오버헤드 삼두 운동 연구](../sources/SRC-014-overhead-triceps.md). 특정 팔 위치/장비 연구를 모든 변형으로 확장하지 않는다.

## 수용 기준

검색·장비 필터가 추천과 일치한다. 사용자 추가 운동과 검토된 운동을 구분한다. 텍스트만으로 대상 근육과 동작을 이해할 수 있다. 해부학·수행법·제작 권한 검토 기록이 있어야 공개한다. 변경된 매핑은 과거 기록에 소급되지 않는다.

## Related

[티어](tier-system.md) · [데이터](data-model.md) · [검토 정책](../operations/evidence-policy.md)

## CONV-0006 이후 현재 구현 경계

특정 iPhone 모델에 한정하지 않는 반응형과 각 사용자별 목표·주당 횟수·분할·시간·장비·단위·시간대 설정을 요구사항으로 추가했다. 본인의 조건은 하나의 시험 표본이다. Supabase 프로젝트가 없으므로 로컬부터 구현한다는 사용자 선택을 반영했다. [로컬 계약](implementation-contracts.md) · [실행 결과](implementation-progress.md).

로컬 프로필/기록·루틴 스냅샷·백업·사실 집계·PWA는 구현했으며 계정/RLS·서버 전송·실제 iOS·검토된 시각/설명·추천/티어·완전한 개인화·배포는 미완료다. 기존 실사용/지인 제공 관문은 유지한다. 로컬 프로필을 인증 계정으로, 개념도를 자극 범위로, 분류별 행 수를 근육 성장량으로 표시하지 않는다.

## 후순위 3D 해부학 애니메이션

CONV-0012/FR-17은 운동별 3D 해부학 모델과 관련 근육/동작 애니메이션을 요청했다. 현재 [가능성 검토](anatomy-3d-feasibility.md)만 수행했으며 구현은 P2/VIS-3D-02~03. 기존2D·설명/전문 검토를 대체하지 않고 첫 MVP 선행 조건으로 두지 않는다.

## CONV0022 구현/검토 — 2026-10-04

34종목/바벨18·큰 부위 아래 세부 분류/장비·별칭 필터와 사용자 추가 선택을 적용했다. 기본1분·즐겨찾기3~4개·완료 자동 시작·pause/resume/stop·deadline 재실행·profile/outbox/백업 보존을 구현했다. 다섯 H1 outline을 제거하고 programmatic focus는 유지했다.98개/19파일·Node8·전체30browser/최종문구6·build/types/format/artifact25, lint기존6경고. 실제 좁은 화면에서 문구 잘림을 찾아 수정했다. [계약/실행](../operations/catalog-rest-timer.md).

GitHub source=Jeongjibsa/lightweight·main·자동 배포 활성화를 읽었고 dependency 설치/Node24·승인된 production 공개 연결/빈 preview를 보완했다. 새 commit의 자동 Git 배포/원격 CI는 기록 시점 별도다. [배포 운영](../operations/pages-git-integration.md). Google OAuth는 가능하며 현재providerOFF/callback없음·credential/동일UID 연결/가입 차단·실기기 복귀가 필요하다. [검토](google-oauth-review.md). 과학 승인 콘텐츠0개/실제 운동·새 기기/나머지 G3/메일·운영·파일럿/P2 관문과 다음 운동 후 사용자 확인 일정은 유지한다.

## SCI 검토 설명 소비와 가슴 연구 패킷 — 2026-10-08

검토 설명 JSON을 운동 정보 창에서 읽고 주장 종류/한계/원문/버전을 함께 표시한다. 엄격한 형식/출처 연결·실패/재시도/종목 전환 보존과 공개 JSON의 실제 SW offline을 검증했다.122Vitest/Node10/40browser·build/types/format/artifact25 통과(기존6경고). [소비 계약/화면](../operations/reviewed-guide-consumption.md).

[가슴 조건 검토 패킷](chest-evidence-review.md)과 [SRC054](../sources/SRC-054-bench-angle-training.md)를 추가했다. 주 연구의 Methods/Results/Discussion을 에이전트가 읽었으며 장비/대상/측정 조건·비교 공백을 구분한다. 기존ACSM2026 전문 접근은 미완료로 남겼다. **실제 인간 승인 설명0개·근육 매핑/수행 시각/추천 규칙/조건 티어는 미완료**다. 합성 fixture를 실제승인으로 등록하지 않는다. 실기기/Auth·식단/3D/파일럿 관문은 유지하며 추가 논문/해부학·권리 검토와 인간 검토 결과가 다음 SCI 선행 조건이다.
