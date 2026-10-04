---
type: "Playbook"
title: "운동 메모와 장비·가동범위 비교 조건"
description: "로컬 보존·비교 분리·편집/검사·서버 승인 대기를 관리한다."
tags:
  - "operations"
  - "training"
  - "data"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-05T01:38:13+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-05-023.md"
    title: "순차 요청"
  - id: "run"
    resource: "../../raw/research/2026-10-05-record-details-loop.json"
    title: "검사"
  - id: "schema"
    resource: "../sources/SRC-050-cloud-json-schema.md"
    title: "공식 기술 문서"
---

# 운동 기록 상세

기존 LOG03/04의 독립 증분이다. session.note(선택1000자), set.comparison.equipmentLabel/rangeOfMotion(선택80자씩)을 추가했다. 길이는 구현 정책이며 사용자 승인 수치/건강 판정이 아니다. 운동 메모는 진행/종료 상세에서 명시 저장한다. 종목의 ‘장비·가동범위 기록’은 전체 또는 한 세트에 적용한다. 세트별 조건이 다를 때 전체 저장이 선택한 세트를 덮는다는 안내를 표시한다.

owner·삭제·취소·편집 시작 revision을 검사하고 session/outbox를 한 transaction으로 저장한다. 완료 시각/수치/루틴 snapshot은 보존하며 실패·충돌 때 초안이 남는다. 새 세트는 직전 조건을 복사한다. 종목 교체는 조건을 초기화하고 재시작은 그날 메모를 비우며 비교 조건은 미완료 계획으로 보존한다.

record-volume-v2/record-coverage-v2: 운동 ID/name/group/equipment/loadMode/side에 장비 이름과 ROM 문자열을 추가한다. 빈/미입력은 legacy key와 같고 서로 다른 입력은 분리한다. 단위 환산은 기존 계약을 유지한다. ‘이전 값’도 같은 key만 참고한다. 같은 문자열/미입력은 실제 같은 머신/범위를 증명하지 않는다. 일별 합계는 수행 기록 합계이며 이 조건으로 나누지 않는다. 새로운 근성장·회복·최적량 주장은 없다.

app0.2.0/IndexedDB2/backup1을 유지하고 선택 필드로 기존 백업을 읽는다. 새 백업/클라이언트 snapshot parse는 필드를 보존하지만 **이전 앱이 새 필드를 보존하는 역방향/다버전 보장은 없다**. 실제 기기 간 검증 관문을 유지한다.

106개(34unit/43integration/29UI)·Node10·32browser(17Chromium/15WebKit)·신규 과업 반복6·build/types/format/artifact25가 통과했다. lint기존6경고는 남는다.320/390 가짜 PNG4개를 직접 확인했다. [원본 실행](../../raw/research/2026-10-05-record-details-loop.json).

**서버/배포 보류**: 기존 strict valid_snapshot은 restTimer/세부 분류/메모·조건을 거부한다. CLI로 생성한 migration은 새 클라이언트 schema와 일치하며 원본 migration/소유·cross-field/권한을 유지한다. drift 검사2개를 추가했다. 적용은 자동 승인 검토가 거부하여 명시적 인간 승인을 기다린다. 본 단위 main push/운영 배포는 하지 않았다. 실제 사용자 cloud 전송 성공으로 표시하지 않는다.
