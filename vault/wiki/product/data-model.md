---
type: "Data Model"
title: "데이터 모델 초안"
description: "핵심 관계·버전·개인 데이터 보존 기준."
tags:
  - "product"
  - "data"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-03T16:59:22+09:00"
---

# 데이터 모델 초안

기술 스택은 미정. 아래는 [기획서](prd.md)의 논리 모델이다.

| 엔터티 | 핵심 데이터/관계 |
|---|---|
| Profile | 목표·경험·일정·장비·선호·제약·단위·시간대 |
| Muscle | 근육 ID·이름·지도 영역·해부학 검토 |
| Exercise/Variant | ID·별칭·장비·조건·부하 방식·버전 |
| ExerciseMuscleMapping | 주/보조 역할·직접/간접·근거·버전 |
| Asset | 파일·권한·저작자·대체 텍스트·검토 |
| Study/Claim | DOI/PMID·대상·결과·한계·검토 범위, 연구↔주장↔정책 |
| Routine/Version | 일정·종목·세트/반복·변경 이유 |
| Session/Set | UUID·현지 날짜·루틴/운동 버전·부하 방식·원값/단위·횟수/초·종류·좌우·RIR·상태 |
| Recommendation | 입력 스냅샷·후보·규칙/근거 버전·사용자 선택 |
| Report | 기간·집계·충분성·데이터/계산/근거 버전 |
| Food/Nutrient | 출처·기준량·조리·성분별 값/결측 |
| Meal/Day | 음식 스냅샷·양·사용자 확정·하루 완료 |
| BodyMeasurement | 시각·측정 조건·체중·선택 측정 |

계획/수행 분리. UTC 시각과 기록 당시 시간대를 보존. 중량 0/결측 구분. 세트 UUID로 재시도 중복 방지. 동기화 충돌의 수정 버전과 해결 결과를 추적한다. 구체 전략은 기술 설계에서 확정한다.

내보내기는 기록과 해석 기준을 포함하는 방향. 삭제는 활성 데이터·캐시·파생 리포트·백업 정책을 다룬다. 세부 법적 기준은 시장 확정 후 조사한다. 제품 지식은 vault, 실제 개인 건강 기록은 별도 앱 저장소로 관리한다. AI와 개발 로그에 불필요한 개인 원문을 보내지 않는다.

## Related

[기록](training-log.md) · [리포트](reports.md) · [영양](nutrition.md)
