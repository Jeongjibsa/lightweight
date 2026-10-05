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
  at: "2026-10-05T10:24:45+09:00"
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
  - id: "validator-human-approval"
    resource: "../../raw/conversations/2026-10-05-024.md"
    title: "검증 함수 SQL 승인과 재개"
  - id: "record-details-git-release"
    resource: "../../raw/research/2026-10-05-record-details-git-release.json"
    title: "서버 승인 뒤 CI/Git 운영 배포"
---

# 운동 기록 상세

기존 LOG03/04의 독립 증분이다. session.note(선택1000자), set.comparison.equipmentLabel/rangeOfMotion(선택80자씩)을 추가했다. 길이는 구현 정책이며 사용자 승인 수치/건강 판정이 아니다. 운동 메모는 진행/종료 상세에서 명시 저장한다. 종목의 ‘장비·가동범위 기록’은 전체 또는 한 세트에 적용한다. 세트별 조건이 다를 때 전체 저장이 선택한 세트를 덮는다는 안내를 표시한다.

owner·삭제·취소·편집 시작 revision을 검사하고 session/outbox를 한 transaction으로 저장한다. 완료 시각/수치/루틴 snapshot은 보존하며 실패·충돌 때 초안이 남는다. 새 세트는 직전 조건을 복사한다. 종목 교체는 조건을 초기화하고 재시작은 그날 메모를 비우며 비교 조건은 미완료 계획으로 보존한다.

record-volume-v2/record-coverage-v2: 운동 ID/name/group/equipment/loadMode/side에 장비 이름과 ROM 문자열을 추가한다. 빈/미입력은 legacy key와 같고 서로 다른 입력은 분리한다. 단위 환산은 기존 계약을 유지한다. ‘이전 값’도 같은 key만 참고한다. 같은 문자열/미입력은 실제 같은 머신/범위를 증명하지 않는다. 일별 합계는 수행 기록 합계이며 이 조건으로 나누지 않는다. 새로운 근성장·회복·최적량 주장은 없다.

app0.2.0/IndexedDB2/backup1을 유지하고 선택 필드로 기존 백업을 읽는다. 새 백업/클라이언트 snapshot parse는 필드를 보존하지만 **이전 앱이 새 필드를 보존하는 역방향/다버전 보장은 없다**. 실제 기기 간 검증 관문을 유지한다.

106개(34unit/43integration/29UI)·Node10·32browser(17Chromium/15WebKit)·신규 과업 반복6·build/types/format/artifact25가 통과했다. lint기존6경고는 남는다.320/390 가짜 PNG4개를 직접 확인했다. [원본 실행](../../raw/research/2026-10-05-record-details-loop.json).

**서버/배포 보류**: 기존 strict valid_snapshot은 restTimer/세부 분류/메모·조건을 거부한다. CLI로 생성한 migration은 새 클라이언트 schema와 일치하며 원본 migration/소유·cross-field/권한을 유지한다. drift 검사2개를 추가했다. 적용은 자동 승인 검토가 거부하여 명시적 인간 승인을 기다린다. 본 단위 main push/운영 배포는 하지 않았다. 실제 사용자 cloud 전송 성공으로 표시하지 않는다.

## CONV0024 승인된 서버 변경 — 2026-10-05

인간 사용자의 명시 승인 후 준비된 `training_optional_record_fields` SQL을 같은 Supabase MCP 경로로 적용했다. 기존 함수 identity·owner·security invoker/빈 search_path·ACL, private 세 테이블의 RLS/force RLS·ACL·정책은 그대로다. 기존 형식 및 새 메모/장비·가동범위·휴식 즐겨찾기·세부 분류/별칭을 RPC 저장→조회와 idempotent retry로 확인했다. 잘못된 소유자·중복·길이/입력/시각을 포함한 **28개 서버 검사**가 통과했고 테스트 계정·기록·임시 권한은 모두 rollback했다. 실제 본인 운동 기록이나 실제 브라우저 Auth 왕복의 검증으로 확대하지 않는다.

자동 검토의 앞선 승인 대기/거부는 당시 이력이며 이 명시 승인과 적용으로 해소됐다. app0.2.0/IndexedDB2/backup1, 106 Vitest·Node10·build/types/format/artifact25(lint기존6경고)를 유지한다. 신규 서버 검증 뒤 main push/새 GitHub CI/Pages 배포 검증을 이어간다. 실제 iPhone/운동·다기기/다버전·과학 승인0개·운영복구/파일럿/P2 관문은 남는다.

[인간 승인](../conversations/2026-10-05-024.md) · [불변 서버 확인](../../raw/research/2026-10-05-cloud-validator-approved.json).

## Migration 이력과 남은 경계

CLI로 만든 로컬 파일은 `20261004162726_training_optional_record_fields.sql`이며 적용한 SQL은 이 파일과 같다. MCP 원격 migration history는 적용 시각 `20261005010803`을 부여했다. 원본 파일을 바꾸거나 history repair를 실행하지 않았다. 향후 CLI `db push`를 쓰기 전 이 대응을 확인해야 한다. 현재 릴리스는 Git 정적 앱 배포와 이미 완료한 MCP 서버 적용을 사용한다.

Supabase advisors는 성능0개, Auth의 leaked password protection 비활성화 경고1개를 반환했다. 해당 Auth 설정은 이번 함수 승인 범위에서 바꾸지 않았다. [공식 설정/조건 안내](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## 현재 운영 배포 — 메모·비교 조건

인간 SQL 승인 뒤 dbddbda를 main에 push했다. GitHub37250900828의 check/Chromium/WebKit 세 job이 모두 success이며 artifact를 실제 수신해 **17+15=32 browser**와 의도적 최초 실패 probe의 증거 보존을 확인했다. Pages github:push의 동일 source build/deploy가 success이고 운영 공개24file SHA256/보안 헤더가 검증한 build와 일치한다. 서버 선택 필드 RPC/부정 입력·권한28개 rollback과 기존 ACL/RLS 보존도 완료했다.

메모/장비·가동범위·휴식 즐겨찾기/세부 분류·별칭의 서버 미지원 및 이 단위의 승인/push/배포 대기는 해소됐다. 106 Vitest·Node10·build/types/format/artifact25(lint기존6경고)이다. preview DB는 비어 있으며 이번에 새 preview branch/asset 검사를 하지 않았다. 후속 문서 commit은 앱 bundle을 바꾸지 않는다.

[운영 앱](https://lightweight-training.pages.dev) · [불변 배포 증거](../../raw/research/2026-10-05-record-details-git-release.json). 실제 본인 운동/iPhone 저장·재실행·수동 전송/새 저장소 복원·다기기/다버전 Auth·과학 승인 콘텐츠0개/운영 복구·4주 파일럿/P2 관문은 남는다.
