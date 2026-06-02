# Troubleshooting

## 2026-06-02 실데이터 교체 후 반영 안되는 문제

### 문제
components.json을 9개로 교체했으나
브라우저에서 기존 5개 목 데이터가 계속 보임
localStorage.clear() 실행해도 변화 없음

### 원인
useComponents.ts가 localStorage 데이터를
components.json보다 우선으로 읽는 구조
JSON 파일 교체해도 localStorage에 기존 데이터가 남아있으면
새 데이터가 무시됨

### 해결
localStorage 데이터 수와 JSON 데이터 수가 다르면
localStorage를 무시하고 JSON으로 강제 초기화하는 로직 추가

### 재발 방지
데이터 구조 변경 시 버전 키를 localStorage에 함께 저장하고
버전이 다르면 자동 초기화하는 방식 고려

---

## 2026-06-02 Tailwind v4 PostCSS 설정 오류

### 문제
@tailwind base/components/utilities 구문 에러 발생
브라우저 흰 화면

### 원인
Tailwind v4는 postcss 플러그인이 분리됨
@tailwindcss/postcss 별도 설치 필요

### 해결
npm install -D @tailwindcss/postcss
postcss.config.js를 @tailwindcss/postcss 방식으로 변경
index.css를 @import 'tailwindcss' 단일 구문으로 변경

### 재발 방지
Vite + Tailwind v4 조합 시 반드시 @tailwindcss/postcss 설치 확인

---

## 2026-06-02 TypeScript import type 에러

### 문제
ComponentItem interface import 시 런타임 에러
SyntaxError: does not provide an export named 'ComponentItem'

### 원인
Vite(esbuild)는 interface를 runtime value로 인식 못함
import { ComponentItem } 방식은 빌드 후 JS에서 누락됨

### 해결
import { useComponents, type ComponentItem } 으로 변경
type 키워드 명시 필수

### 재발 방지
interface/type import 시 항상 import type 또는 inline type 사용
