---
type: "Playbook"
title: "작업 단위 local commit 운영"
description: "사용자 지속 요청에 따른 git-commit skill 적용·단위/검증/개인 데이터 제외·hash 확인."
tags:
  - "operations"
  - "git"
  - "commit"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T02:15:39+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-009.md"
    title: "지속 요청"
version: "0.1.0"
---

# 작업 단위 local commit 운영

CONV-0009에서 현재/앞으로 작업 단위 commit을 요청했다. `AGENTS.md`에 지속 지침을 추가했다. 사용 skill은 `/Users/jisung/.codex/skills/git-commit/SKILL.md`이며 사용자 제공 내용과 실제 파일을 읽었다. [요청](../../raw/conversations/2026-10-04-009.md). Conventional Commits 명세와 저장소 운영 정책을 구분한다.

1. 의미 있는 단위의 목표·관련 파일/검사/문서를 묶는다. 독립 계획·harness 기반·새 기능은 분리한다.
2. status·staged/unstaged diff·untracked와 저장소 규칙을 읽는다. 기존 사용자 staging/다른 변경을 보존한다.
3. 해당 파일/hunk만 staging하고 staged diff·whitespace·비밀/개인 자료 제외를 확인한다. Markdown 의도된 두 공백 줄바꿈은 허용한다.
4. 변경에 맞는 검사와 vault validation을 수행한다. 통과/실패/미지원 범위를 구분한다. hook은 우회하지 않는다.
5. 메시지를 임시 파일에 저장하고 local commit한다. `<type>[(scope)]: description`, 한국어 서술/기술 용어 영어 원문, 확인된 이유·검증만 넣는다.
6. 실제 hash/message·status를 확인하고 진행 기록에 남긴다. 검증 실패 변경을 정상 완료 commit으로 숨기지 않는다.

현재 누적 구현/PRD0.4.0 baseline은 `9cccb4f`로 commit했다. 과거 분리되지 않았던 변경을 과거 상태가 있었던 것처럼 쪼개지 않았다. 새 작업부터 목적별로 분리한다. commit 이후 그 hash를 문서에 기록하는 후속 문서 변경은 다음 관련 단위에 포함할 수 있다. 자신의 commit hash를 같은 commit에 넣는 순환을 만들지 않는다.

지속 승인은 local commit이다. remote push·amend/rebase/reset/force push·새 외부 배포는 별도 명시 요청 범위를 따른다. `.env`·서버 secret·개인 운동/JSON backup·브라우저 token·임시 screenshot/trace는 commit하지 않는다.

[Conventional Commits 공식 명세](https://www.conventionalcommits.org/en/v1.0.0/) · [기존 skill 제작 지침](commit-skill-instructions.md) · [루프](loop-engineering.md)
