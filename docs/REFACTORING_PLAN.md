# 🔧 한니비 클라이언트 리팩토링 절차

## 📋 목차

1. [현재 상태 분석](#현재-상태-분석)
2. [리팩토링 목표](#리팩토링-목표)
3. [단계별 리팩토링 계획](#단계별-리팩토링-계획)
4. [우선순위](#우선순위)
5. [체크리스트](#체크리스트)

---

## 현재 상태 분석

### ✅ 잘 구성된 부분

1. **네비게이션 구조**
   - React Navigation 기반의 명확한 계층 구조
   - 타입 안정성을 위한 ParamList 정의
   - 조건부 라우팅 구현

2. **컴포넌트 구조**
   - `components/common/` - 공용 컴포넌트 분리
   - `components/ui/` - 저수준 UI 컴포넌트
   - 테스트 파일 구조화

3. **상태 관리**
   - Zustand를 사용한 전역 상태 관리
   - 타입 안정성 확보

4. **테마 시스템**
   - `theme/` 폴더에 색상, 간격, 타이포그래피 정의

### ⚠️ 개선이 필요한 부분

1. **네비게이션 불일치**
   - `constants/routes.ts`의 상수와 실제 사용 라우트 이름 불일치
   - `TabsNavigator.tsx`와 `MainTabs.tsx` 중복 존재
   - `OnboardingNavigator.tsx`가 실제로는 `RootNavigator.tsx`에 통합됨

2. **중복 컴포넌트**
   - `MessageBubble.tsx`가 `components/common/`과 `components/home/`에 중복 존재

3. **테마 시스템 분산**
   - `constants/DesignSystem.ts`와 `theme/` 폴더에 중복 정의
   - 일관성 없는 import 경로

4. **빈 디렉토리**
   - `src/shared/` 폴더가 비어있거나 미사용
   - `src/store/` 폴더가 비어있음 (상태는 `state/`에 있음)

5. **라우트 타입 불일치**
   - `navigation/types.ts`의 타입과 `constants/routes.ts`의 상수 불일치
   - 하드코딩된 라우트 이름 존재

6. **TODO 주석**
   - 여러 파일에 TODO 주석이 남아있음 (API 연동, 기능 구현 등)

7. **파일 구조**
   - `TabOneScreen.tsx`, `TabTwoScreen.tsx` 같은 임시 파일 존재
   - 실제 사용되는 스크린과 혼재

---

## 리팩토링 목표

### 1. 구조적 일관성

- 네비게이션 구조 통일 및 상수 기반 라우팅 완전 적용
- 중복 컴포넌트 제거 및 재사용성 향상
- 테마 시스템 통합 및 일관성 확보

### 2. 코드 품질

- 타입 안정성 강화
- 불필요한 파일 제거
- TODO 주석 정리 및 이슈화

### 3. 유지보수성

- 명확한 폴더 구조
- 일관된 import 경로
- 문서화 개선

---

## 단계별 리팩토링 계획

### Phase 1: 네비게이션 구조 통합 (우선순위: 높음)

#### 1.1 라우트 상수와 타입 일치화

- [ ] `constants/routes.ts`의 상수 정의를 실제 사용 라우트와 일치시킴
- [ ] `navigation/types.ts`의 타입을 상수 기반으로 변경
- [ ] 모든 네비게이터에서 하드코딩된 라우트 이름을 상수로 교체

**대상 파일:**

- `src/constants/routes.ts`
- `src/navigation/types.ts`
- `src/navigation/RootNavigator.tsx`
- `src/navigation/MainTabs.tsx`
- `src/navigation/HomeStack.tsx`
- `src/navigation/DashboardStack.tsx`

**예상 작업 시간:** 2-3시간

#### 1.2 중복 네비게이터 정리

- [ ] `TabsNavigator.tsx`와 `MainTabs.tsx` 중 하나로 통합
- [ ] `OnboardingNavigator.tsx`가 사용되지 않으면 제거 또는 실제 사용으로 변경
- [ ] 사용되지 않는 네비게이터 파일 제거

**대상 파일:**

- `src/navigation/TabsNavigator.tsx` (제거 검토)
- `src/navigation/MainTabs.tsx` (유지)
- `src/navigation/OnboardingNavigator.tsx` (제거 또는 통합)

**예상 작업 시간:** 1-2시간

---

### Phase 2: 컴포넌트 구조 정리 (우선순위: 중간)

#### 2.1 중복 컴포넌트 제거

- [ ] `MessageBubble.tsx` 두 개 비교 및 통합
- [ ] 공통 기능은 `components/common/`에 유지
- [ ] 도메인 특화 기능은 해당 도메인 폴더에 유지

**대상 파일:**

- `src/components/common/MessageBubble.tsx`
- `src/components/home/MessageBubble.tsx`

**예상 작업 시간:** 1시간

#### 2.2 컴포넌트 import 경로 통일

- [ ] 모든 컴포넌트 import가 `@/components/...` 경로 사용
- [ ] 상대 경로(`../`) 사용 제거

**예상 작업 시간:** 1-2시간

---

### Phase 3: 테마 시스템 통합 (우선순위: 중간)

#### 3.1 테마 시스템 통합

- [ ] `constants/DesignSystem.ts`의 내용을 `theme/` 폴더로 이동
- [ ] `DesignSystem.ts`는 `theme/`의 재export만 하도록 변경 또는 제거
- [ ] 모든 파일에서 `theme/` 경로로 통일

**대상 파일:**

- `src/constants/DesignSystem.ts` (제거 또는 재export로 변경)
- `src/theme/Colors.ts`
- `src/theme/spacing.ts`
- `src/theme/typography.ts`
- `src/components/ui/Button.tsx` (import 경로 수정)

**예상 작업 시간:** 2-3시간

#### 3.2 테마 타입 정의 추가

- [ ] 테마 타입을 명확히 정의
- [ ] 다크 모드 지원을 위한 타입 구조 준비

**예상 작업 시간:** 1시간

---

### Phase 4: 폴더 구조 정리 (우선순위: 낮음)

#### 4.1 빈 디렉토리 정리

- [ ] `src/shared/` 폴더의 용도 결정
  - 사용 예정: 문서화 및 구조 정의
  - 사용 안 함: 제거
- [ ] `src/store/` 폴더 정리
  - Zustand 스토어를 `store/`로 이동 또는 `state/` 유지 결정

**예상 작업 시간:** 1시간

#### 4.2 임시 파일 제거

- [ ] `TabOneScreen.tsx`, `TabTwoScreen.tsx` 제거 또는 실제 스크린으로 교체
- [ ] 사용되지 않는 스크린 파일 정리

**대상 파일:**

- `src/screens/TabOneScreen.tsx`
- `src/screens/TabTwoScreen.tsx`
- `src/screens/ModalScreen.tsx` (사용 여부 확인)
- `src/screens/SampleKeyboardScreen.tsx` (사용 여부 확인)

**예상 작업 시간:** 1시간

---

### Phase 5: 코드 품질 개선 (우선순위: 중간)

#### 5.1 TODO 주석 정리

- [ ] 모든 TODO 주석을 이슈로 변환 또는 제거
- [ ] 실제 구현이 필요한 TODO는 GitHub 이슈 생성
- [ ] 임시 주석은 제거

**대상 파일:**

- `src/screens/Reports/ReportsScreen.tsx` (라인 145)
- `src/screens/Dashboard/DashboardScreen.tsx` (라인 82, 170)
- `src/hooks/useCameraStatus.ts` (라인 22)
- `src/screens/NotificationRequestScreen.tsx` (라인 31)
- `src/screens/LoginScreen.tsx` (라인 22)

**예상 작업 시간:** 1-2시간

#### 5.2 타입 안정성 강화

- [ ] `any` 타입 제거
- [ ] 명시적 타입 정의 추가
- [ ] 타입 가드 함수 추가 (필요 시)

**예상 작업 시간:** 2-3시간

---

### Phase 6: 문서화 개선 (우선순위: 낮음)

#### 6.1 README 업데이트

- [ ] 프로젝트 구조 문서 업데이트
- [ ] 리팩토링 후 변경사항 반영

**예상 작업 시간:** 1시간

#### 6.2 코드 주석 개선

- [ ] 복잡한 로직에 JSDoc 주석 추가
- [ ] 컴포넌트 Props 문서화

**예상 작업 시간:** 2-3시간

---

## 우선순위

### 🔴 높음 (즉시 진행)

1. **Phase 1: 네비게이션 구조 통합**
   - 라우트 상수와 타입 일치화
   - 중복 네비게이터 정리

### 🟡 중간 (단기간 내 진행)

2. **Phase 2: 컴포넌트 구조 정리**
   - 중복 컴포넌트 제거
3. **Phase 3: 테마 시스템 통합**
   - 테마 시스템 통합
4. **Phase 5: 코드 품질 개선**
   - TODO 주석 정리

### 🟢 낮음 (여유 있을 때 진행)

5. **Phase 4: 폴더 구조 정리**
   - 빈 디렉토리 정리
   - 임시 파일 제거
6. **Phase 6: 문서화 개선**
   - README 업데이트
   - 코드 주석 개선

---

## 체크리스트

### Phase 1: 네비게이션 구조 통합

- [ ] `constants/routes.ts` 업데이트
- [ ] `navigation/types.ts`를 상수 기반으로 변경
- [ ] `RootNavigator.tsx`에서 상수 사용
- [ ] `MainTabs.tsx`에서 상수 사용
- [ ] `HomeStack.tsx`에서 상수 사용
- [ ] `DashboardStack.tsx`에서 상수 사용
- [ ] 중복 네비게이터 파일 제거
- [ ] 네비게이션 테스트

### Phase 2: 컴포넌트 구조 정리

- [ ] `MessageBubble.tsx` 중복 제거
- [ ] 모든 컴포넌트 import 경로 통일
- [ ] 컴포넌트 테스트 확인

### Phase 3: 테마 시스템 통합

- [ ] `DesignSystem.ts` 내용을 `theme/`로 이동
- [ ] 모든 파일에서 `theme/` 경로로 통일
- [ ] 테마 타입 정의 추가
- [ ] 테마 사용 테스트

### Phase 4: 폴더 구조 정리

- [ ] `shared/` 폴더 용도 결정
- [ ] `store/` 폴더 정리
- [ ] 임시 파일 제거
- [ ] 사용되지 않는 파일 제거

### Phase 5: 코드 품질 개선

- [ ] TODO 주석 이슈화 또는 제거
- [ ] `any` 타입 제거
- [ ] 타입 가드 추가 (필요 시)
- [ ] 타입 체크 통과 확인

### Phase 6: 문서화 개선

- [ ] README 업데이트
- [ ] 네비게이션 가이드 업데이트
- [ ] 코드 주석 개선

---

## 실행 가이드

### 각 Phase 시작 전

1. 현재 브랜치에서 새 브랜치 생성

   ```bash
   git checkout -b refactor/phase-{번호}-{설명}
   ```

2. 관련 테스트 실행
   ```bash
   npm test
   npm run typecheck
   ```

### 각 Phase 진행 중

1. 작은 단위로 커밋

   ```bash
   git add .
   git commit -m "refactor: [Phase X] 설명"
   ```

2. 주기적으로 테스트 실행
   ```bash
   npm test
   npm run typecheck
   npm run lint
   ```

### 각 Phase 완료 후

1. 최종 테스트 실행

   ```bash
   npm test
   npm run typecheck
   npm run lint
   npm run format
   ```

2. PR 생성 및 리뷰 요청

---

## 예상 총 작업 시간

- **Phase 1:** 3-5시간
- **Phase 2:** 2-3시간
- **Phase 3:** 3-4시간
- **Phase 4:** 2시간
- **Phase 5:** 3-5시간
- **Phase 6:** 3-4시간

**총 예상 시간:** 16-23시간

---

## 주의사항

1. **기능 변경 금지**: 리팩토링은 기능 변경 없이 코드 구조만 개선
2. **테스트 유지**: 기존 테스트가 모두 통과해야 함
3. **점진적 진행**: 한 번에 하나의 Phase씩 진행
4. **백업**: 각 Phase 시작 전 현재 상태 커밋
5. **리뷰**: 각 Phase 완료 후 PR 리뷰 받기

---

## 참고 자료

- [React Navigation 공식 문서](https://reactnavigation.org/)
- [TypeScript 리팩토링 가이드](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [프로젝트 네비게이션 가이드](./NAVIGATION_GUIDE.md)
- [공용 컴포넌트 가이드](../src/components/common/README.md)
