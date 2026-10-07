---
type: "Deployment Playbook"
title: "Pages GitHub 자동 배포 운영"
description: "현재 연결된 저장소와 빌드/환경 구성 및 실제 trigger 검증."
tags:
  - "operations"
  - "deployment"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-07T21:55:19+09:00"
sources:
  - id: "docs"
    resource: "../sources/SRC-048-pages-git-integration.md"
    title: "공식 Pages Git/build"
  - id: "check"
    resource: "../../raw/research/2026-10-04-git-oauth-review.json"
    title: "현재 API 관찰"
  - id: "git-release22"
    resource: "../../raw/research/2026-10-04-catalog-rest-git-release.json"
    title: "0f6381d CI/Git build/production asset verification"
  - id: "validator-human-approval"
    resource: "../../raw/conversations/2026-10-05-024.md"
    title: "검증 함수 SQL 승인과 재개"
  - id: "record-details-git-release"
    resource: "../../raw/research/2026-10-05-record-details-git-release.json"
    title: "서버 승인 뒤 CI/Git 운영 배포"
  - id: "workout-ux-git-release"
    resource: "../../raw/research/2026-10-07-workout-ux-git-release.json"
    title: "운동 UX CI/운영 배포 확인"
---

# GitHub에서 Pages로 배포

API에서 lightweight-training의 source=github·Jeongjibsa/lightweight·production=main·자동 production 활성화를 확인했다. 사용자 직접 연결 이후의 현재 상태다. 최초 Direct Upload 생성/수동 배포 기록은 과거 이력으로 보존한다.

| 설정 | 현재 |
|---|---|
| repository | Jeongjibsa/lightweight |
| production branch | main |
| build root | 저장소 루트 |
| build command | `cd app && npm ci && npm run build && npm run pages:check` |
| output | app/dist |
| Node | 24 |
| production public connection | 기존 승인된 Supabase URL/publishable key 설정 |
| preview | branch 자동 build, Supabase URL/key 빈 값 |

처음 확인할 때 build에는 dependency 설치가 없었고 production 공개 연결 값도 없었다. 필요한 항목만 PATCH로 보완하고 재조회했다. secret/service_role, DB 비밀번호, 개인 데이터는 build 환경에 추가하지 않는다. public VITE 값은 브라우저 번들에 포함되며 권한은 Supabase Auth/RLS/허용 목록이 검사한다.

## 작업 후 확인

로컬 검사/문서 검증→작업 단위 commit/push→GitHub 검사와 Pages Git trigger의 같은 commit success→공개 자산/보안 헤더·계정 연결 표시 확인 순서다. Git 연결 설정의 true만으로 새 deployment success를 판정하지 않는다. 검증한 정적 dist만 비교하고 개인 browser 데이터를 조작하지 않는다.

검토 시점의 canonical deployment는 기존1db637d ad_hoc였다. 이번 source commit의 Git 자동 배포/원격 CI는 아래 기록 당시 아직 별도다. 후속 receipt로 실제 결과를 남긴다. 일반 배포는 Git 경로를 사용하고 수동 Wrangler는 명시적인 복구/특정 배포 작업에만 사용한다.

[공식 근거](../sources/SRC-048-pages-git-integration.md)·[관찰](../../raw/research/2026-10-04-git-oauth-review.json)·[Cloudflare 운영](cloudflare-setup.md).

## Git 자동 배포 확인 완료

0f6381d의 main push→GitHub37210829022 세 job success→Pages github:push/build/deploy success를 확인했다. production24file hash/보안 헤더가 검증한 build와 일치한다. [불변 receipt](../../raw/research/2026-10-04-catalog-rest-git-release.json). 최초 Git 연결 확인 시점의 대기 문단은 당시 이력이다. Google 검토/실기기/새 preview branch 검증은 각각 별도다.

## CONV0024 승인된 서버 변경 — 2026-10-05

인간 사용자의 명시 승인 후 준비된 `training_optional_record_fields` SQL을 같은 Supabase MCP 경로로 적용했다. 기존 함수 identity·owner·security invoker/빈 search_path·ACL, private 세 테이블의 RLS/force RLS·ACL·정책은 그대로다. 기존 형식 및 새 메모/장비·가동범위·휴식 즐겨찾기·세부 분류/별칭을 RPC 저장→조회와 idempotent retry로 확인했다. 잘못된 소유자·중복·길이/입력/시각을 포함한 **28개 서버 검사**가 통과했고 테스트 계정·기록·임시 권한은 모두 rollback했다. 실제 본인 운동 기록이나 실제 브라우저 Auth 왕복의 검증으로 확대하지 않는다.

자동 검토의 앞선 승인 대기/거부는 당시 이력이며 이 명시 승인과 적용으로 해소됐다. app0.2.0/IndexedDB2/backup1, 106 Vitest·Node10·build/types/format/artifact25(lint기존6경고)를 유지한다. 신규 서버 검증 뒤 main push/새 GitHub CI/Pages 배포 검증을 이어간다. 실제 iPhone/운동·다기기/다버전·과학 승인0개·운영복구/파일럿/P2 관문은 남는다.

[인간 승인](../conversations/2026-10-05-024.md) · [불변 서버 확인](../../raw/research/2026-10-05-cloud-validator-approved.json).

## 현재 운영 배포 — 메모·비교 조건

인간 SQL 승인 뒤 dbddbda를 main에 push했다. GitHub37250900828의 check/Chromium/WebKit 세 job이 모두 success이며 artifact를 실제 수신해 **17+15=32 browser**와 의도적 최초 실패 probe의 증거 보존을 확인했다. Pages github:push의 동일 source build/deploy가 success이고 운영 공개24file SHA256/보안 헤더가 검증한 build와 일치한다. 서버 선택 필드 RPC/부정 입력·권한28개 rollback과 기존 ACL/RLS 보존도 완료했다.

메모/장비·가동범위·휴식 즐겨찾기/세부 분류·별칭의 서버 미지원 및 이 단위의 승인/push/배포 대기는 해소됐다. 106 Vitest·Node10·build/types/format/artifact25(lint기존6경고)이다. preview DB는 비어 있으며 이번에 새 preview branch/asset 검사를 하지 않았다. 후속 문서 commit은 앱 bundle을 바꾸지 않는다.

[운영 앱](https://lightweight-training.pages.dev) · [불변 배포 증거](../../raw/research/2026-10-05-record-details-git-release.json). 실제 본인 운동/iPhone 저장·재실행·수동 전송/새 저장소 복원·다기기/다버전 Auth·과학 승인 콘텐츠0개/운영 복구·4주 파일럿/P2 관문은 남는다.

## 운동 접기/고정 휴식 운영 반영 — 2026-10-07

48c0f44를 main에 push하고 GitHub37622605794 세 job success와 **Chromium18/WebKit16=34** artifact·의도적 최초 실패 probe를 실제 수신했다. 같은 source의 Pages `github:push` build/deploy가 성공했고 운영 공개24파일 SHA256·보안 헤더가 로컬 검증 빌드와 일치한다. [불변 배포 확인](../../raw/research/2026-10-07-workout-ux-git-release.json).

108Vitest/Node10·로컬browser34/관련12반복·최종10PNG/문서 검증(기존6lint경고)을 유지한다. 새 서버/Auth/스키마/의존성을 변경하지 않았다. preview DB 환경은 비어 있고 새 preview branch 배포/asset 검증은 하지 않았다. Watch/Web Push·native AlarmKit/Live Activity는 **검토만/P2**다. 실제 운동/iPhone/Watch·다기기 Auth·SCI/운영/파일럿 관문은 남는다. 후속 문서 commit은 앱 bundle을 바꾸지 않는다.
