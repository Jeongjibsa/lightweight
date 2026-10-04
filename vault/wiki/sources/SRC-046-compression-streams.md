---
type: "Reference"
title: "WHATWG — gzip stream 표준과 bounded 파일 복구"
description: "gzip/CRC와 stream API의 확인 범위·실제 테스트 경계를 기록한다."
tags:
  - "source"
  - "technology"
  - "backup"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T17:15:45+09:00"
sources:
  - id: "standard"
    resource: "https://compression.spec.whatwg.org/"
    title: "WHATWG Compression"
  - id: "mdn"
    resource: "https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream"
    title: "MDN"
  - id: "verification"
    resource: "../../raw/research/2026-10-04-compressed-backup-verification.json"
    title: "실행"
source_id: "SRC-046"
review_scope: "Supported formats and stream algorithms; MDN interfaces/examples; native Node/browser tests, no physical iPhone"
retrieved_at: "2026-10-04T17:15:45+09:00"
---

# WHATWG Compression Streams

[표준](https://compression.spec.whatwg.org/)의 supported formats·CompressionStream/DecompressionStream 알고리즘과 gzip CRC32/ISIZE·한 member/추가 입력 오류를 읽었다. 표준 문서의 Last Updated2026-04-20과 실제 현재 browser 구현 통과를 구분한다. [MDN CompressionStream](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream) · [DecompressionStream](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream)의 인터페이스/사용 예제도 확인했다. 실제 iPhone 지원·memory/quota를 검증한 것은 아니다.

앱은 10MiB 초과 기록을 gzip으로 보관하고 input10MiB·expanded64MiB 한도를 읽기 중 검사한다. CRC는 손상을 찾는 기능이며 파일 암호화/서명·제3자 변조 인증을 의미하지 않는다. 형식/schema·중복/owner 검증은 별도이며 완료 전 DB에 적용하지 않는다.

Node의 실제 native streams와 독립 zlib gunzip 비교, 두 browser 엔진의24,000세트 실제 download/새context restore/손상 거부를 검사했다. 원본 JSONv1을 gzip으로 감쌀 뿐 schema2 DB나 cloud snapshot 허용 크기는 변경하지 않았다. [실행 원본](../../raw/research/2026-10-04-compressed-backup-verification.json).
