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
  at: "2026-10-04T23:46:05+09:00"
sources:
  - id: "docs"
    resource: "../sources/SRC-048-pages-git-integration.md"
    title: "공식 Pages Git/build"
  - id: "check"
    resource: "../../raw/research/2026-10-04-git-oauth-review.json"
    title: "현재 API 관찰"
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
