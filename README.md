# Hanibi Client

<div align="center">
  <img src="readme-images/thumbnail.png" alt="Hanibi App Thumbnail" />
  
  <p align="center">
    <b>IoT 디바이스 관리 및 모니터링을 위한 React Native 모바일 애플리케이션</b>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?logo=react" alt="React Native" />
    <img src="https://img.shields.io/badge/Expo-~54.0-000020?logo=expo" alt="Expo" />
    <img src="https://img.shields.io/badge/TypeScript-~5.9-blue?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react" alt="React" />
  </p>
</div>

## 📋 목차

- [기술 스택](#-기술-스택)
- [주요 기능](#-주요-기능)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [개발 가이드](#-개발-가이드)

## 🛠 기술 스택

### Core
- **React Native 0.81.5** - 크로스 플랫폼 모바일 개발 프레임워크
- **Expo ~54.0** - 개발 도구 및 빌드 시스템
- **React 19.1.0** - UI 라이브러리
- **TypeScript ~5.9** - 타입 안정성 보장

### 상태 관리 & 데이터 페칭
- **Zustand 5.0.8** - 경량 상태 관리 (인증, 디바이스, 로딩 상태)
- **TanStack Query 5.90** - 서버 상태 관리 및 캐싱

### 네비게이션
- **React Navigation 7.x** - 네이티브 스택 및 바텀 탭 네비게이션

### 네트워킹 & 통신
- **Axios 1.13** - HTTP 클라이언트 (REST API)
- **Socket.io Client 4.8** - 실시간 WebSocket 통신

### UI/UX
- **React Native SVG** - 벡터 그래픽 렌더링
- **Victory Native** - 데이터 시각화 차트
- **Expo Linear Gradient** - 그라데이션 효과
- **Expo Blur** - 블러 효과

### 개발 도구
- **ESLint** - 코드 품질 검사
- **Prettier** - 코드 포맷팅
- **Husky** - Git 훅 관리
- **Commitlint** - 커밋 메시지 검증
- **Jest** - 단위 테스트

## ✨ 주요 기능

### 🔐 인증 및 온보딩
- 이메일/카카오 소셜 로그인
- 회원가입 및 프로필 설정
- 온보딩 플로우 (알림 권한, 주의사항, 캐릭터 커스터마이징)

### 📱 디바이스 관리
- **디바이스 페어링**: QR 코드 또는 수동 입력을 통한 IoT 디바이스 등록
- **실시간 모니터링**: 디바이스 연결 상태, 처리 상태 실시간 확인
- **디바이스 제어**: 원격 명령 전송 및 상태 변경
- **디바이스 상세**: 센서 데이터, 카메라 스트림, 처리 이력 조회

### 💬 채팅 기능
- 디바이스와의 양방향 채팅 인터페이스
- 빠른 명령어(Quick Commands) 지원
- 인텐트 기반 메시지 전송
- 실시간 메시지 동기화

### 📊 대시보드 및 리포트
- **센서 데이터 시각화**: 온도, 습도, 가스, 무게 등 실시간 차트
- **주간 요약**: 처리량 변화율, 통계 정보
- **건강 점수**: 디바이스 상태 기반 건강 점수 계산
- **에코 스코어**: 환경 친화도 점수 및 분석

### 🏆 랭킹 시스템
- 시간별/일별/주별/월별 랭킹 조회
- 사용자 순위 및 통계 정보

### 👤 프로필 관리
- 사용자 정보 수정
- 캐릭터 커스터마이징
- 디바이스 목록 관리

## 🚀 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS 개발: Xcode (macOS)
- Android 개발: Android Studio

### 설치 및 실행

```bash
# 저장소 클론
git clone <repository-url>
cd client

# 의존성 설치
npm install

# 개발 서버 시작
npm start

# 플랫폼별 실행
npm run ios      # iOS 시뮬레이터
npm run android  # Android 에뮬레이터
npm run web      # 웹 브라우저
```

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
EXPO_PUBLIC_HANIBI_API_BASE_URL=https://api.example.com
```

## 📁 프로젝트 구조

```
src/
├── api/              # API 클라이언트 및 타입 정의
│   ├── authApi.ts
│   ├── devicesApi.ts
│   ├── chat.ts
│   ├── reports.ts
│   └── types/
├── components/       # 재사용 가능한 컴포넌트
│   ├── common/      # 공용 컴포넌트
│   ├── ui/          # 디자인 시스템 컴포넌트
│   ├── chat/        # 채팅 관련 컴포넌트
│   ├── dashboard/   # 대시보드 컴포넌트
│   └── device/      # 디바이스 관련 컴포넌트
├── constants/        # 상수 정의
│   ├── routes.ts
│   ├── Colors.ts
│   └── DesignSystem.ts
├── features/         # 기능별 모듈화된 코드
│   ├── auth/
│   ├── devices/
│   ├── reports/
│   └── health-score/
├── hooks/            # 커스텀 훅
│   ├── useDevices.ts
│   ├── useChatSocket.ts
│   └── useDeviceCommands.ts
├── navigation/       # 네비게이션 설정
│   ├── RootNavigator.tsx
│   ├── MainTabs.tsx
│   └── types.ts
├── screens/          # 화면 컴포넌트
│   ├── Home/
│   ├── Dashboard/
│   ├── Chat/
│   └── Settings/
├── services/         # 외부 서비스 연동
│   ├── api/
│   ├── auth/
│   ├── storage/
│   ├── ws/          # WebSocket
│   └── sse/         # Server-Sent Events
├── store/            # Zustand 상태 관리
│   ├── authStore.ts
│   ├── deviceStore.ts
│   └── loadingStore.ts
├── theme/            # 테마 및 디자인 토큰
│   ├── Colors.ts
│   ├── typography.ts
│   └── spacing.ts
└── utils/            # 유틸리티 함수
```

## 🛠 개발 가이드

### 스크립트

```bash
# 개발
npm start              # Expo 개발 서버
npm run ios            # iOS 시뮬레이터
npm run android        # Android 에뮬레이터
npm run web            # 웹 브라우저

# 코드 품질
npm run lint           # ESLint 검사
npm run lint:fix        # ESLint 자동 수정
npm run format         # Prettier 검사
npm run format:write   # Prettier 자동 포맷팅
npm run typecheck      # TypeScript 타입 검사

# 테스트
npm test               # Jest 테스트 실행

# iOS 시뮬레이터 관리
npm run simulator:list # 시뮬레이터 목록
npm run simulator:reset # 시뮬레이터 리셋
```

### 커밋 컨벤션

```
<type>(#<issueNumber>): <description>
```

**타입:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `chore`: 빌드/설정 변경
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `test`: 테스트 추가/수정

**예시:**
```bash
feat(#4): add device pairing feature
fix(#5): resolve navigation bug
refactor(#6): improve API error handling
```

### 코드 스타일

- **ESLint**: 코드 품질 검사 (커밋 전 자동 실행)
- **Prettier**: 코드 포맷팅 (커밋 전 자동 실행)
- **TypeScript**: 엄격한 타입 검사

### 브랜치 전략

1. `main`: 프로덕션 브랜치
2. `develop`: 개발 브랜치
3. `feature/#이슈번호-설명`: 기능 개발 브랜치
4. `fix/#이슈번호-설명`: 버그 수정 브랜치

## 📚 문서

- [개발 가이드](./docs/DEVELOPMENT.md) - 상세 개발 가이드
- [EAS 빌드 가이드](./docs/EAS_BUILD_GUIDE.md) - 앱 빌드 가이드
- [공용 컴포넌트 가이드](./src/components/common/README.md) - 컴포넌트 사용법

## 🤝 기여하기

1. 이슈 생성 또는 기존 이슈 확인
2. `feature/#이슈번호-설명` 브랜치 생성
3. 기능 개발 및 테스트
4. 커밋 컨벤션에 따라 커밋
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
