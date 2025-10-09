# 프로젝트 컨벤션

> Expo + React Native + React Navigation 기반 프로젝트의 전체 코드 품질, 협업 효율, 유지보수를 위한 컨벤션 모음

## 🧩 Git Workflow

### 브랜치 규칙

- **main**: 안정적, 릴리스용
- **feature/**: 새로운 기능 (`feature/#이슈번호-설명`)
- **fix/**: 버그 수정 (`fix/#이슈번호-설명`)
- **chore/**: 환경, 설정 변경 (`chore/#이슈번호-설명`)
- **docs/**: 문서 변경 (`docs/#이슈번호-설명`)

### 커밋 컨벤션

- **형식**: `<type>(#<issueNumber>): <명령형 요약>`
- **타입**: `feat`, `fix`, `refactor`, `chore`, `docs`, `perf`, `test`, `ci`, `build`, `revert`
- **예시**: `feat(#33): add refresh token flow`

### Pull Request 규칙

- PR 제목은 **squash commit** 제목과 동일
- **PR은 작게 (<400라인)** 유지
- 템플릿 섹션: What & Why, How, Screenshots, Risks/Migration

## 🗂 Source Layout

### 폴더 구조

```
src/
├── components/
│   ├── ui/           # 디자인 시스템 (atoms, molecules)
│   └── common/       # 공용 컴포넌트
├── constants/        # 색상, 상수, enum, 라우트명
├── navigation/       # 네비게이터 (Root, Tabs)
├── screens/         # 화면 단위 컴포넌트
├── services/         # API 클라이언트, SDK 연동
├── store/           # 상태관리
├── theme/           # 테마 토큰/프로바이더
├── types/           # 공용 타입
└── utils/           # 순수 함수, 헬퍼
```

### 의존성 흐름 규칙

```
constants/types/utils → services/store → components → screens → navigation
```

## 🧱 Naming Rules

| 항목            | 규칙                  | 예시                               |
| --------------- | --------------------- | ---------------------------------- |
| 컴포넌트/스크린 | PascalCase            | `Button.tsx`, `HomeScreen.tsx`     |
| 훅/유틸         | camelCase             | `useAuth.ts`, `formatDate.ts`      |
| 플랫폼별 파일   | 접미사 사용           | `File.ios.tsx`, `File.android.tsx` |
| Barrel export   | 선택적, 순환참조 방지 | `index.ts` 가능                    |

## 🧭 Imports & Aliases

### 경로 설정

- 경로 alias: `@/*` → `./src/*`
- 임포트 순서:
  1. 서드파티
  2. `@/constants`, `@/types`, `@/utils`
  3. `@/services`, `@/store`
  4. `@/components`
  5. 상대 경로

### Export 규칙

- `utils`, `hooks` → **named export**
- `screens`, `components` → **default export** 허용

## 💡 Components

### 기본 규칙

- 함수형 컴포넌트 + 타입 지정 필수
- 로컬 state 최소화
- 스타일: **StyleSheet** 또는 Themed.tsx
- 접근성 고려: `role`, `accessibilityLabel` 지정
- 주석은 **비직관적 로직**에만 작성

## 🪝 Hooks

### 규칙

- 파일명: `useXxx.ts`
- 렌더 내 부수효과 금지 (`useEffect`/`useCallback` 활용)
- `any` 지양 → 제네릭 / 유니언 타입 활용

## 🧭 Navigation

### 구조

- `App.tsx` → `NavigationContainer`
- **RootNavigator**: Native Stack
- **TabsNavigator**: Bottom Tabs
- 액션 버튼: `options={({ navigation }) => ({ headerRight: ... })}`
- `src/navigation` 안에 route param type 정의

## 🧩 Data / Services / Store

### 규칙

- 네트워크 로직은 **services**에 집중
- DTO → UI 모델로 매핑
- Store는 직렬화 가능해야 함
- 파생 데이터는 selector로 관리
- 비동기 로직은 thunk/saga

## 🎨 Styling & Theme

### 테마 토큰

- 색상: `src/theme/Colors.ts`
- 여백, 폰트 등은 **토큰 기반**
- 필요 시 `src/theme` 확장

## 🖼 Assets

### 구조

- 이미지: `src/assets/images`
- 폰트: `src/assets/fonts`
- import 시: `@/assets/...`
- `App.tsx` 내 폰트 로드는 `require('./src/assets/fonts/...')` (Expo alias 문제 방지)

### 주의사항

- **아이콘/스플래시 수정 시 `app.json` 업데이트 필수**

## 🚨 Errors & Logging

### 원칙

> "문제는 조용히 덮지 말고, 즉시 알려주고, 로그로 남기고, 명확히 다뤄라."

### 규칙

- 초기화 오류 시 **fail fast**
- 예상치 못한 오류: `console.error`
- 도메인 로직은 명시적 에러 반환

## ⚙️ Lint & Types

### TypeScript

- **strict mode** 사용
- `any`는 불가피한 경우만
- 조기 반환(early return), 얕은 중첩, 명확한 변수명

### ESLint & Prettier

- **Husky**를 통한 자동 검사
- 커밋 전 자동 린트/포맷팅
- 커밋 메시지 형식 검증

## ✅ PR Checklist

- [ ] 커밋/브랜치 명 컨벤션 준수
- [ ] 불필요한 포매팅 수정 없음
- [ ] `console.log` 제거
- [ ] 타입 및 린트 통과
- [ ] UI 변경 시 스크린샷 첨부
- [ ] 테스트 코드 반영
- [ ] `app.json` 및 assets 업데이트 완료
