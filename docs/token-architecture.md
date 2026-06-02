# PDS Hub Token Architecture

## 개요
이 문서는 PDS Hub에서 사용하는 디자인 시스템 토큰의 아키텍처와 구조를 설명합니다. 
이베이(eBay) 디자인 시스템을 참고하여 설계된 이 아키텍처는 토큰을 크게 **Core (Palette)**와 **Semantic** 두 가지 계층(Tier)으로 분리하여 관리합니다.

## 1. Core (Palette) Tokens
- **목적:** 디자인 시스템에서 사용하는 절대적인 색상 값(Hex)을 정의합니다.
- **네이밍 규칙:** `color.palette.{색상군}.{단계}`
  - 예시: `color.palette.red.500-mainMain`, `color.palette.neutral.100`
- **특징:** 디자이너와 개발자가 사전에 정의된 색상 팔레트 안에서만 작업하도록 강제하는 기본 재료입니다.

## 2. Semantic Tokens
- **목적:** Core 토큰을 가져와 특정 맥락(Context)이나 역할(Role)을 부여합니다.
- **네이밍 규칙:** `color.semantic.{요소}.{상태}`
  - 예시: `color.semantic.primary.normal`, `color.semantic.fill.surface`
- **특징 (Light/Dark 모드):** 하나의 Semantic 토큰은 Light 모드와 Dark 모드에 대해 각각 다른 Core 토큰을 참조할 수 있습니다. 이를 통해 테마 변경 시 코드 수정 없이 토큰 참조값만 변경하여 다크 모드를 완벽하게 지원할 수 있습니다.

## 3. UI 구현 (TokenManager.tsx)
- Token Manager 뷰어는 사용자 경험을 높이기 위해 Core 탭과 Semantic 탭을 분리하여 제공합니다.
- Semantic 탭에서는 하나의 토큰 이름에 대해 Light 값과 Dark 값을 동시에 테이블에서 비교하며 볼 수 있습니다.
- 컴포넌트 레지스트리 화면과 일관된 UI/UX(타이틀, 필터, 검색바)를 제공합니다.
