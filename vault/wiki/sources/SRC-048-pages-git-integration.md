---
type: "Source Note"
title: "Cloudflare Pages Git integration/build"
description: "공식 기술 문서의 확인 범위와 제품 검증 한계를 기록한다."
tags:
  - "source"
  - "technology"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T23:46:05+09:00"
sources:
  - id: "capture"
    resource: "../../raw/research/2026-10-04-git-oauth-review.json"
    title: "수집과 실제 설정 관찰"
source_id: "SRC-048"
review_scope: "Official documentation sections; no live Google OAuth execution"
---

# SRC-048

Cloudflare 공식 [Git 연결](https://developers.cloudflare.com/pages/configuration/git-integration/)·[빌드](https://developers.cloudflare.com/pages/configuration/build-configuration/)·[이미지/Node](https://developers.cloudflare.com/pages/configuration/build-image/)의 관련 본문을 확인했다. Git push에 따른 production/preview 배포·빌드 명령/output/root·Node 환경 선택의 기술 근거다. 실제 계정 상태는 공식 설명과 구별하여 [API 관찰](../../raw/research/2026-10-04-git-oauth-review.json)에 보존했다.

현재 source는 GitHub이고 main 자동 배포가 켜져 있다. 이후 실제 Git trigger 성공/자산 일치는 별도 실행으로 확인한다. 문서가 특정 계정의 webhook 성공을 증명하지 않는다. [운영](../operations/pages-git-integration.md).
