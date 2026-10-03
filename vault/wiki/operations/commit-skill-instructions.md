---
type: "Skill Creation Instructions"
title: "Conventional Commits 기반 git-commit 스킬 생성 지침"
description: "Conventional Commits 1.0.0에 맞는 메시지 작성·검토와 요청된 Git 커밋을 수행하는 스킬의 제작 지침."
tags:
  - "operations"
  - "git"
  - "skill"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-03T18:04:24+09:00"
sources:
  - id: "conventional-commits"
    resource: "https://www.conventionalcommits.org/en/v1.0.0/"
    title: "Conventional Commits 1.0.0"
version: "0.1.1"
updated_at: "2026-10-03T18:13:29+09:00"
approval_status: "proposal"
review_scope: "공식 명세의 Summary, Specification 1–16, Examples, FAQ 확인; 실제 스킬 실행 검증은 미수행."
---

# Conventional Commits 기반 git-commit 스킬 생성 지침

이 문서를 스킬 제작 에이전트에게 전달하여 `git-commit` 스킬을 생성한다. 목표는 실제 변경에 근거한 커밋 메시지 작성·검토와, 사용자가 요청한 범위의 Git 커밋 수행이다. 기준은 [Conventional Commits 1.0.0 공식 명세](https://www.conventionalcommits.org/en/v1.0.0/)다.

**사용자 명시 요구:** 공식 명세에 의거한 commit 스킬 생성용 Markdown 지침. 아래 Git 작업 절차와 표현 기본값은 이 문서가 제안하는 스킬 설계이며, 명세 자체의 요구와 구분한다. 이 문서는 생성 지침 산출물이다.

**후속 사용자 요청(2026-10-03):** “git-commit 으로 스킬을 생성해줘.” 이에 따라 스킬 이름을 `git-commit`으로 지정한다.

## 1. 생성할 스킬

최소 구성은 `git-commit/SKILL.md`다. 반복적으로 필요한 기능이 생길 때만 `scripts/`나 `references/`를 추가한다. `agents/openai.yaml`은 사용하는 제작 도구가 요구하거나 UI 메타데이터가 필요할 때 작성한다.

`SKILL.md`의 frontmatter는 다음을 기본으로 한다.

```yaml
---
name: git-commit
description: 실제 Git 변경을 읽고 Conventional Commits 1.0.0에 맞는 커밋 메시지를 작성·검토하거나, 사용자가 커밋을 요청한 경우 선택한 변경을 커밋한다. 메시지만 요청하면 메시지를 제공한다.
---
```

본문에는 아래의 명세 규칙, 변경 판단, Git 작업 절차, 결과 보고 기준을 담는다. 현재 문서의 vault용 frontmatter를 `SKILL.md`에 복사하지 않는다. 스킬 설치 위치는 제작 요청의 지정 위치와 해당 환경의 스킬 관리 규칙을 따른다.

## 2. 공식 명세에서 지켜야 할 규칙

```text
<type>[(scope)][!]: <description>

[body]

[footer(s)]
```

대괄호는 선택 요소 표기이며 실제 메시지에 넣지 않는다.

- 변경 종류를 나타내는 명사 `type`과 짧은 `description`은 필수다. `scope`와 `!`는 선택이며, 헤더 구분자는 콜론과 공백이다.
- 새 기능은 `feat`, 버그 수정은 `fix`다. 다른 type도 허용되며 고정 목록은 없다.
- `scope`는 코드베이스의 영역을 나타내는 명사를 괄호로 감싼다.
- 본문은 선택이며 헤더 다음 빈 줄에서 시작한다. 여러 문단을 허용한다.
- footer도 선택이며 앞 내용과 빈 줄로 구분한다. 형식은 `Token: value` 또는 `Token #value`다.
- footer 토큰의 공백은 `-`로 대체한다. 예외는 `BREAKING CHANGE`다. 값은 여러 줄일 수 있으며 다음 유효한 토큰·구분자에서 끝난다.
- 호환성 파괴는 콜론 직전의 `!` 또는 `BREAKING CHANGE: 설명` footer로 표시한다. 어떤 type에서도 가능하다.
- `!`만 사용하면 description이 호환성 파괴를 설명해야 한다. `!`와 footer를 함께 써도 된다.
- `BREAKING CHANGE`는 대문자여야 한다. footer 토큰 `BREAKING-CHANGE`는 같은 의미다. 그 외 구조 요소는 대소문자로 유효성을 달리 판단하지 않는다.

명세는 `fix`·`feat`·호환성 파괴를 각각 SemVer의 PATCH·MINOR·MAJOR와 연결한다. 다른 type에는 호환성 파괴가 없는 한 암묵적 버전 영향이 없다. [공식 규칙과 버전 관계](https://www.conventionalcommits.org/en/v1.0.0/#specification).

## 3. 스킬의 표현 기본값

아래는 **스킬 설계 제안**이다. 저장소가 이미 정한 메시지 언어·허용 type·scope·길이·commitlint 설정이 있으면 그 규칙을 먼저 적용한다. 저장소 규칙과 명세가 충돌하면 충돌을 설명하고 해결한다.

- type과 scope는 소문자로 통일한다. scope를 추측하기보다 변경 영역이 명확할 때만 넣는다.
- description은 변경 결과를 구체적으로 설명한다. 저장소 언어 규칙이 없으면 사용자 요청 언어를 따른다.
- 명세가 제목 50자/72자 제한, 영어, 명령형, 마침표 금지를 강제한다고 설명하지 않는다. 길이 제한은 저장소에 있을 때 적용하고, 기본적으로 제목은 짧게 쓴다.
- 본문에는 제목만으로 이해하기 어려운 이유·전후 동작·제약을 적는다. 파일 목록을 기계적으로 나열하지 않는다.
- 이슈 번호, 작성자, 검토자, 테스트 결과, 호환성 파괴를 만들지 않는다. 확인된 정보만 넣는다.
- 호환성 파괴가 복잡하면 `!`와 footer를 함께 사용하여 기존 사용자가 무엇을 바꿔야 하는지 설명한다.

type 선택의 기본 예시는 다음과 같다. `feat`·`fix` 외 목록은 이 스킬의 제안이며 저장소에서 조정할 수 있다.

| Type | 선택 기준 |
|---|---|
| `feat` | 새로운 기능이나 사용자 동작 추가 |
| `fix` | 기존 동작의 오류 수정 |
| `docs` | 문서 내용만 변경 |
| `refactor` | 기능과 의도된 동작을 유지한 구조 개선 |
| `perf` | 성능 개선 |
| `test` | 테스트 추가·수정 |
| `build` | 빌드 시스템·빌드 의존성 변경 |
| `ci` | CI 설정·스크립트 변경 |
| `style` | 코드 의미를 바꾸지 않는 포맷 변경 |
| `chore` | 위 범주에 해당하지 않는 유지보수 |
| `revert` | 기존 커밋을 되돌리는 변경을 설명하는 팀 관례 |

화면 스타일을 바꿨다는 이유로 `style`을 선택하지 않는다. 사용자 기능이나 오류에 미치는 영향으로 판단한다. 문서만 보고 기능을 설계한 변경은 `docs`이며 구현된 기능으로 표현하지 않는다. 되돌리기 처리 방식은 저장소 도구의 정책을 따른다.

## 4. 요청 모드와 변경 판단

스킬은 사용자 요청에서 다음 모드를 구분한다.

| 요청 | 수행 |
|---|---|
| “커밋 메시지를 만들어줘” | 변경을 읽고 메시지 제공 |
| “이 메시지가 규칙에 맞는지 검토해줘” | 명세·저장소 규칙 위반과 수정안 제공 |
| “이 변경을 커밋해줘” | 변경 선택·검증·메시지 작성·로컬 커밋 |

메시지를 요청한 것만으로 staging이나 커밋을 수행하지 않는다. 커밋을 요청했고 대상이 분명하면 그 요청에 따라 진행한다. 매번 별도 승인을 요구하는 절차를 만들지 않는다.

실제 diff에서 type·scope·description을 판단한다. 파일명이나 이전 대화만으로 변경을 단정하지 않는다. 메시지만 검토하는 요청에 diff가 없으면 문법 검토와 내용 정확성 검토의 범위를 구분한다.

독립된 변경 목적이 섞이면 커밋 분리를 우선 검토한다. 하나의 기능과 그 기능의 테스트·문서는 같은 커밋으로 묶을 수 있다. 분리 과정에서 사용자의 기존 staging이나 다른 작업을 임의로 변경하지 않는다.

## 5. Git 작업 절차

### 변경 확인

저장소 루트, 적용되는 `AGENTS.md`, 기여 문서, commitlint·Git hook 설정을 확인한다. 다음 읽기 명령을 필요에 맞게 사용한다.

```bash
git status --short
git diff --cached
git diff
git log -5 --format=%s
```

untracked 파일은 diff에 나타나지 않으므로 커밋 후보라면 내용을 별도로 읽는다. 신규 저장소의 첫 커밋처럼 이력이 없으면 `git log` 실패만으로 작업을 막지 않는다.

staged diff를 커밋 메시지의 기준으로 삼되, staging되어 있다는 사실만으로 요청 범위에 포함되었다고 단정하지 않는다. 선택 범위가 불명확할 때만 사용자에게 필요한 범위를 확인한다. 변경이 없으면 커밋할 내용이 없다고 보고한다.

메시지 작성 모드에서 staged 변경이 없으면 요청 대상의 unstaged diff와 untracked 파일을 분석하고, 어떤 변경을 기준으로 작성했는지 표시한다. 메시지를 만들기 위해 staging할 필요는 없다.

### 변경 선택과 검증

실제 커밋 모드에서는 요청 대상 파일이나 hunk만 staging한다. `git add .` 또는 `git add -A`로 관련 없는 작업까지 포함하지 않는다. 한 파일에 여러 작업이 섞였으면 파일 전체를 stage하기 전에 hunk 범위를 확인한다.

```bash
git add -- <선택한_경로>
git diff --cached
git diff --cached --check
```

위 경로는 예시 표기다. 실제 명령에서는 셸 인자로 안전하게 전달한다. staging 후 diff를 다시 읽고 의도한 변경만 포함되었는지 확인한다. `--check`의 공백 문제는 저장소 정책과 변경 의도에 따라 해결한다.

변경에 맞는 기존 테스트·린트·문서 검증을 저장소에서 찾아 수행한다. 이 `lightweight` 프로젝트의 vault 검증 예시는 `ruby scripts/validate_vault.rb`이며, 다른 저장소의 필수 명령으로 일반화하지 않는다. 단순 문서 변경에 코드 전체 테스트를 일률적으로 강제하지 않는다. 검사 실패는 원인을 확인하여 요청 범위에서 해결하고, 미해결 상태로 성공을 보고하지 않는다.

### 커밋과 확인

여러 줄 메시지는 임시 파일에 정확한 줄바꿈으로 저장하여 전달한다.

```bash
git commit -F <메시지_파일>
git log -1 --format='%h%n%B'
git status --short
```

사용하는 파일 쓰기 도구나 안전한 heredoc으로 메시지를 저장한다. 메시지 텍스트를 셸 명령에 직접 보간하여 백틱이나 `$()`가 실행되지 않도록 한다.

Git hook을 정상 실행한다. 실패했다고 `--no-verify`로 우회하지 않는다. hook이 파일을 수정하면 diff와 staging 범위를 재확인한 뒤 필요한 수정·검증을 거쳐 진행한다. 커밋 명령의 성공과 실제 기록된 메시지를 확인한 후 해시를 보고한다.

amend·rebase·reset·force push·원격 push는 해당 작업이 요청된 범위일 때만 수행한다. 커밋 메시지의 SemVer 의미를 설명하는 것만으로 버전 파일·태그·릴리스를 변경하지 않는다.

## 6. 메시지 예시

아래는 형식을 보여주는 가상 예시다.

```text
docs(vault): commit 스킬 생성 지침 추가
```

```text
fix(training-log): 세션 재시도 시 세트 중복 저장 방지

동일한 세트 식별자로 재시도하면 기존 기록을 반환한다.
```

```text
feat(api)!: 세션 응답의 sets 필드를 entries로 변경

BREAKING CHANGE: 클라이언트는 sets 대신 entries를 읽어야 한다.
```

footer 형식 예시:

```text
fix(parser): 빈 입력 처리 오류 수정

빈 문자열을 빈 목록으로 처리한다.

Refs: #123
Reviewed-by: Example Reviewer
```

실제 작업에서 마지막 두 footer는 해당 이슈와 검토 사실이 확인되었을 때만 사용한다.

## 7. 완료 기준

메시지 작성 모드에서는 바로 사용할 메시지를 코드 블록으로 제공하고, 필요한 경우에만 type·scope 선택 이유를 덧붙인다. 검토 모드에서는 명세 위반과 팀 관례를 구분한다. 커밋 모드에서는 실제 해시·메시지·수행한 검증·남은 변경을 간결하게 보고한다.

스킬 제작을 마칠 때 다음 상황을 판단할 수 있는지 확인한다.

- 기능 문서만 추가한 diff를 `docs`로 분류한다.
- scope가 없어도 유효하며, type 뒤 콜론과 공백이 없으면 수정한다.
- `feat(api)!: 기존 응답 필드 제거`는 footer가 없어도 유효하게 처리한다.
- 소문자 `breaking change:`를 호환성 파괴 표기로 인정하지 않고, 대문자 `BREAKING-CHANGE:`는 인정한다.
- 제목 길이·언어·허용 type 제한을 명세 요구와 저장소 정책으로 구분한다.
- 메시지만 요청하면 작업 트리와 Git 이력을 변경하지 않는다.
- 독립된 staged 변경과 untracked 파일이 섞인 상황에서 요청 범위만 선택한다.
- hook이나 커밋 실패를 성공으로 보고하지 않는다.

제작 도구의 스킬 구조 검증을 실행한다. 동작 검증이 필요하면 임시 Git 저장소를 사용하고 실제 프로젝트에 검증용 커밋을 남기지 않는다. 구조 검사와 실제 동작 검증의 결과를 구분해 보고한다.

## 출처와 검토 범위

2026-10-03에 [공식 영어판 v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)의 Summary, Specification 1–16, Examples, FAQ를 확인했다. 공식 규칙은 2절에 요약했으며, 1절과 3–7절은 이를 활용하기 위한 스킬 설계 제안이다. 원문 전체를 복제하지 않았다.

[문서 운영 목록](index.md) · [지식 관리 규칙](knowledge-workflow.md)
