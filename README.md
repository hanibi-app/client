# React Native Client

> Expo + React Native + React Navigation 기반 모바일 애플리케이션

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn
- Expo CLI

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start

# 플랫폼별 실행
npm run ios      # iOS 시뮬레이터
npm run android  # Android 에뮬레이터
npm run web      # 웹 브라우저
```

## 📚 문서

- [개발 가이드](./DEVELOPMENT.md) - 커밋 컨벤션, 코드 품질 관리, 개발 워크플로우
- [프로젝트 컨벤션](./PROJECT_CONVENTIONS.md) - 전체 프로젝트 규칙 및 가이드라인
- [공용 컴포넌트 가이드](./src/components/common/README.md) - 컴포넌트 개발 가이드

## 🛠 스크립트

```bash
# 개발
npm start              # Expo 개발 서버
npm run ios            # iOS 시뮬레이터
npm run android        # Android 에뮬레이터
npm run web            # 웹 브라우저

# 테스트
npm test               # Jest 테스트 실행
npm run typecheck      # TypeScript 타입 검사

# 코드 품질
npm run lint           # ESLint 검사
npm run lint:fix        # ESLint 자동 수정
npm run format         # Prettier 검사
npm run format:write   # Prettier 자동 포맷팅
```

## 🏗 프로젝트 구조

```
src/
├── components/        # React 컴포넌트
│   ├── ui/           # 디자인 시스템
│   └── common/       # 공용 컴포넌트
├── constants/        # 상수 및 설정
├── navigation/       # 네비게이션 설정
├── screens/         # 화면 컴포넌트
├── services/        # API 및 외부 서비스
├── store/           # 상태 관리
├── theme/           # 테마 및 디자인 토큰
├── types/           # TypeScript 타입 정의
└── utils/           # 유틸리티 함수
```

## 🔧 개발 도구

### 코드 품질

- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **Husky**: Git 훅을 통한 자동 검사
- **Commitlint**: 커밋 메시지 형식 검증

### 테스트

- **Jest**: 단위 테스트
- **React Testing Library**: 컴포넌트 테스트

## 📋 커밋 컨벤션

```
<type>(#<issueNumber>): <description>
```

### 타입

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `refactor`: 코드 구조 개선
- `chore`: 설정/환경 변경
- `docs`: 문서 수정
- `perf`: 성능 개선
- `test`: 테스트 추가/수정
- `ci`: CI/CD 관련
- `build`: 빌드 관련
- `revert`: 변경사항 되돌리기

### 예시

```bash
feat(#4): add user authentication
fix(#5): resolve navigation bug
chore(#6): update dependencies
```

## 🤝 기여하기

1. 이슈 생성 또는 기존 이슈 확인
2. `feature/#이슈번호-설명` 브랜치 생성
3. 기능 개발 및 테스트
4. 커밋 컨벤션에 따라 커밋
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
