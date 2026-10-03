---
type: "Playbook"
title: "LLM Wiki와 OKF 운영 규칙"
description: "원본·지식·기획·이력을 지속 관리하는 프로젝트 절차."
tags:
  - "knowledge"
  - "operations"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-03T17:03:18+09:00"
sources:
  - id: "wiki"
    resource: "../sources/SRC-001-llm-wiki.md"
    title: "LLM Wiki"
  - id: "okf"
    resource: "../sources/SRC-002-okf.md"
    title: "OKF"
---

# LLM Wiki와 OKF 운영 규칙

[Karpathy](../sources/SRC-001-llm-wiki.md)의 원본 보존과 점진 지식 축적을 참고하고 [공식 OKF v0.2](../sources/SRC-002-okf.md)를 적용한다. 아래 상세 ID/버전/절차는 프로젝트 규칙이다.

```text
vault/                      # 옵시디언 vault이자 OKF 번들
  index.md                  # 시작점
  log.md                    # 날짜별 작업 이력
  raw/conversations/        # 사용자 원문, 변경하지 않음
  raw/research/             # 수집 당시 JSON
  wiki/product/             # 현재 PRD와 상세
  wiki/sources/             # 출처 노트
  wiki/concepts/            # 주장/근거/상충
  wiki/decisions/           # 결정·제안
  wiki/conversations/       # 대화 요약
  wiki/operations/          # 운영
  history/changes/          # 변경 전후·이유
  history/versions/         # 변경 후 PRD 전체 보관
  templates/                # 양식
  assets/                   # 추후 시각 자료
  .obsidian/                # 기본 링크 설정
```

## 옵시디언과 메타데이터

‘Open folder as vault’로 `vault`를 열고 [index](../../index.md)에서 시작한다. 표준 Markdown 링크·속성·백링크·그래프를 사용하고 플러그인은 요구하지 않는다. 내부 링크는 문서 기준 상대 경로. 보존 문서의 링크가 자동 수정되지 않도록 링크 자동 갱신을 껐다. 원본·스냅샷 경로는 유지하고 문서 이동이 필요하면 영향 링크를 직접 확인한다.

index는 목록, log는 최신 날짜부터의 기록. 루트 index에 `okf_version: "0.2"`. 일반 MD는 type·title·description·tags·status·generated.by/at, 출처는 sources의 id/resource/title을 유지한다. 생성 시각은 실제 편집 시각과 UTC 오프셋, 발언/출판 시각과 구별한다. draft를 기본으로 하며 실제 검증 없이 verified나 사람 검토를 넣지 않는다. version·approval_status·review_scope는 확장 필드다.

## 대화 후 업데이트

1. PRD·미결·결정·log를 읽는다.
2. 새 요구/수정이 담긴 사용자 발언을 raw에 새 파일로 보존한다.
3. CONV에 명시 요구·제안·미결을 정리한다.
4. 새 사실은 조사하여 SRC와 근거 지도를 갱신한다.
5. 현재 PRD와 영향 상세/결정/질문을 수정한다.
6. CHG에 이전/새 버전·변경 전후·이유·출처·영향·검증을 기록한다.
7. 변경 후 PRD를 새 버전 스냅샷으로 보관한다.
8. index/log를 갱신하고 구조·링크·해시를 검사한다.
9. 새 원본/CHG/스냅샷 해시만 immutable-manifest에 추가한다. 기존 해시 변경으로 훼손을 숨기지 않는다.

결론이 바뀌지 않은 질문은 관련 대화만 기록 가능. 수정은 PATCH, 기능/범위 변화 MINOR, 큰 방향 전환 MAJOR의 문서 버전 관례. 구현 버전과 독립이다.

raw는 원문과 자체 작성 수집 기록이다. 논문 전문이 없는 상태를 감추지 않는다. 전문/그림 추가 시 권한/출처를 관리한다. 과거 기록 정정은 새 파일로 연결한다. PRD만 전체 스냅샷하고 상세의 변경 전후는 CHG에 기록한다. 상세의 완전 복원까지 필요하면 버전 관리 도입을 논의한다. 새 Git 저장소는 이번에 만들지 않았다.

루트에서 `ruby scripts/validate_vault.rb`: frontmatter·시각·링크·출처·버전·원본 해시 검사, 결과는 history/validation-latest.json. 자체 구조 검사이며 연구 타당성/모든 OKF 의미 규칙의 인증은 아니다.

연구 재검토는 수동 계획. 주기적 자동화나 다른 도구의 문서 변경을 감지하는 서비스는 생성하지 않았다. 다음 대화의 문서 갱신은 루트 AGENTS.md에 지침으로 남긴다.

## Related

[근거 정책](evidence-policy.md) · [결정](../decisions/decision-register.md) · [양식](../../templates/index.md)
