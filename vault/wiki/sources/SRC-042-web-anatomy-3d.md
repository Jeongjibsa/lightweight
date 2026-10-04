---
type: "Reference"
title: "SRC-042 Web 3D 해부학 애니메이션 기술 자료"
description: "renderer·animation·asset 후보의 일차 자료와 미확인 경계."
tags:
  - "source"
  - "technology"
  - "3d"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T14:54:43+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-012.md"
    title: "검토만/후순위 요구"
source_id: "SRC-042"
retrieved_at: "2026-10-04T14:54:43+09:00"
---

# SRC-042 Web 3D 해부학 애니메이션 기술 자료

확인일2026-10-04. 공식 기술 문서/원제작자 README를 확인한 범위이며 실제 mesh·rig·fitness clip·라이선스 원본을 내려받아 검수하지 않았다. 운동 효과를 입증하는 연구 자료가 아니다.

| 일차 자료 | 읽은 범위 | 적용/한계 |
|---|---|---|
| [model-viewer](https://modelviewer.dev/) | Web 3D 소개·브라우저 지원 | iOS Safari 지원 안내는 기술 후보 선정 근거다. 사용자 기기/OS 설치·성능 통과가 아님 |
| [scenegraph](https://modelviewer.dev/examples/scenegraph/) | 재질 색상·variant API 예시 | 근육별 분리된 재질이 있어야 개별 강조를 설계할 수 있음. 실제 자산 확인 필요 |
| [Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html) | glTF2.0·animations/scene·압축 extension | GLB/clip 불러오기 후보. loader 자체가 운동 clip을 생성하지 않음 |
| [Three.js animation](https://threejs.org/manual/pages/animation-system.html) | skeletal/morph/transform/material·clip/mixer | 모델/rig/clip이 준비돼야 해당 동작을 재생할 수 있음 |
| [Z-Anatomy 원제작자 README](https://github.com/Z-Anatomy/Models-of-human-anatomy/blob/master/Readme.md) | Blender 해부학 atlas 소개·출처·CC BY-SA4.0 표기 | 참고 asset 후보이며 특정 mesh별 권리·분리·rig/clip 품질 확인 안 함. README만으로 앱 전체의 license 의무를 단정하지 않음 |

[가능성 검토](../product/anatomy-3d-feasibility.md)의 단계·renderer 선별 기준·성능 예산은 기획자 제안이며 renderer 선택/자산 사용 승인으로 기록하지 않는다.
