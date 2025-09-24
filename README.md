# Hanibi App (React Navigation + Modern Architecture)

이 저장소는 React Navigation을 사용하는 React Native 프로젝트입니다. Expo Router에서 React Navigation으로 마이그레이션하여 더 유연하고 확장 가능한 구조로 정리했습니다.

## 🎯 주요 특징
- **React Navigation** - Native Stack Navigator 기반 라우팅
- **Zustand** - 가벼운 상태 관리
- **React Query** - 서버 상태 관리 및 캐싱
- **Axios** - HTTP 클라이언트 (토큰 인터셉터 포함)
- **TypeScript** - 엄격 모드 및 타입 안전성
- **Path Aliases** - `@/*` 절대 경로 import
- **Design System** - 일관된 디자인 토큰

## 📁 새로운 폴더 구조

```
hanibi-app/
├── 📱 src/                          # 애플리케이션 소스 코드
│   ├── api/                          # HTTP 클라이언트 계층
│   │   └── client.ts                 # Axios 인스턴스 + 인터셉터
│   ├── services/                     # 비즈니스 로직 계층
│   │   └── auth.service.ts           # 인증 관련 비즈니스 로직
│   ├── store/                        # 전역 상태 관리 (Zustand)
│   │   └── auth.store.ts             # 인증 상태 스토어
│   ├── navigation/                   # React Navigation 설정
│   │   ├── RootNavigator.tsx         # 메인 네비게이터
│   │   └── types.ts                  # 네비게이션 타입
│   ├── screens/                      # 화면 컴포넌트
│   │   ├── Auth/                     # 인증 관련 화면
│   │   ├── Onboarding/               # 온보딩 화면
│   │   ├── Home/                     # 홈 화면
│   │   ├── Dashboard/                # 대시보드 화면
│   │   ├── Item/                     # 아이템 관리 화면
│   │   └── ...                       # 기타 화면들
│   ├── components/                   # 재사용 UI 컴포넌트
│   │   ├── ThemedText.tsx            # 테마 적용 텍스트
│   │   ├── ThemedView.tsx            # 테마 적용 뷰
│   │   └── ui/                       # 기본 UI 컴포넌트
│   ├── styles/                       # 디자인 시스템
│   │   ├── colors.ts                 # 색상 토큰
│   │   ├── DesignSystem.ts           # 통합 디자인 시스템
│   │   ├── Spacing.ts                # 간격 토큰
│   │   └── Typography.ts             # 타이포그래피
│   ├── shared/                       # 공유 유틸리티
│   │   ├── hooks/                    # 공유 커스텀 훅
│   │   ├── lib/                      # 라이브러리 래퍼
│   │   └── utils/                    # 유틸리티 함수
│   ├── constants/                    # 런타임 상수
│   │   └── config.ts                 # 환경 변수 설정
│   ├── types/                        # 전역 타입 정의
│   │   └── env.d.ts                  # 환경 변수 타입
│   └── lib/                          # 전역 인프라
│       └── queryClient.ts            # React Query 설정
├── 🧪 tests/                        # 테스트 파일
│   ├── unit/                         # 단위 테스트
│   └── e2e/                          # E2E 테스트
├── 📱 app_deprecated/                # 기존 Expo Router 구조 (보존)
├── 🧩 components_deprecated/         # 기존 컴포넌트 (보존)
├── 🎛️ constants_deprecated/          # 기존 상수 (보존)
├── 🎨 assets/                       # 정적 자원
├── 📄 docs/                         # 문서
│   ├── migration-plan.md             # 마이그레이션 계획
│   └── post-migration-checklist.md  # 마이그레이션 후 체크리스트
├── App.tsx                          # 새로운 앱 엔트리포인트
├── .env.example                     # 환경 변수 예제
└── babel.config.js                  # Babel 설정 (경로 별칭 포함)
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일에서 API_BASE_URL 등 설정
```

### 3. 앱 실행
```bash
# 개발 서버 시작
npm start

# Android
npm run android

# iOS (macOS 전용)
npm run ios
```

## 🔧 개발 스크립트

```bash
# 타입 체크
npm run typecheck

# 린팅
npm run lint

# 전체 검증 (타입체크 + 린팅)
npm run validate

# 테스트
npm run test
npm run test:watch
```

## 🏗️ 아키텍처 가이드

### API vs Services 분리
- **`src/api/`** - HTTP 요청만 담당 (axios, 엔드포인트)
- **`src/services/`** - 비즈니스 로직 (요청 조합, 스토어 갱신, 에러 정책)

### 상태 관리
- **Zustand** - 클라이언트 상태 (인증, UI 상태)
- **React Query** - 서버 상태 (캐싱, 동기화, 로딩)

### 네비게이션
- **React Navigation** - 네이티브 스택 네비게이터
- **타입 안전성** - `RootStackParamList`로 화면 파라미터 타입 정의

## 📋 마이그레이션 정보

이 프로젝트는 Expo Router에서 React Navigation으로 마이그레이션되었습니다.

- **기존 구조 보존**: `*_deprecated/` 폴더에 원본 코드 보관
- **점진적 마이그레이션**: 주요 화면부터 단계적 이동
- **무손실 전환**: 모든 기능과 스타일 유지

자세한 내용은 다음 문서를 참고하세요:
- [Migration Plan](docs/migration-plan.md)
- [Post-Migration Checklist](docs/post-migration-checklist.md)

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트 (향후 추가 예정)
# npm run test:e2e
```

## 📱 플랫폼 지원

- ✅ **Android** - 완전 지원
- ✅ **iOS** - 완전 지원  
- ⚠️ **Web** - 기본 지원 (일부 네이티브 기능 제한)

## 🔐 환경 변수

```bash
# .env 파일 예제
API_BASE_URL=https://api.example.com
APP_ENV=development
DEBUG=true
```

## 📞 지원 및 문의

프로젝트 관련 문의사항이나 이슈가 있으시면:
1. GitHub Issues 생성
2. 마이그레이션 관련: `docs/migration-plan.md` 참고
3. 개발 가이드: 이 README 참고

---

**마지막 업데이트**: 마이그레이션 완료 후
**프로젝트 상태**: Production Ready