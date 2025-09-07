# Hanibi App (Expo + Expo Router)

이 저장소는 Expo Router를 사용하는 React Native/Expo 프로젝트입니다. 현재 라우팅 그룹과 `src/` 애플리케이션 계층을 분리하여 확장 가능한 구조로 정리했습니다.

## 주요 특징
- 파일 기반 라우팅(Expo Router)
- 탭 네비게이션 그룹(`(tabs)`)과 인증 플로우 그룹(`(auth)`) 분리
- 화면 라우트(`app/`)와 앱 로직(`src/`) 분리
- TypeScript + 엄격 모드(`strict: true`)
- 경로 별칭(Path Alias) 설정으로 읽기 쉬운 import 경로

---

## 폴더 구조 개요
```
project-root/
├─ app/                      # 라우트(화면) 파일 (Expo Router)
│  ├─ _layout.tsx            # 상위 레이아웃(ThemeProvider, Stack) 공통 래퍼
│  ├─ +not-found.tsx         # 404 화면
│  ├─ index.tsx              # "/" 루트(웰컴/탐색 진입)
│  ├─ (auth)/                # 인증 플로우 그룹
│  │   ├─ _layout.tsx
│  │   ├─ sign-in.tsx
│  │   └─ sign-up.tsx
│  ├─ (tabs)/                # 탭 네비게이션 그룹
│  │   ├─ _layout.tsx        # 탭 설정 (Home/Search/Settings)
│  │   ├─ home.tsx
│  │   ├─ search.tsx
│  │   └─ settings.tsx
│  ├─ item/
│  │   ├─ [id].tsx           # 동적 라우트: /item/123
│  │   └─ new.tsx            # /item/new
│  └─ modal.tsx              # 모달 라우트
│
├─ src/                      # 라우트 외 모든 앱 로직 (UI, 상태, 서비스, 유틸)
│  ├─ features/              # 기능(유스케이스) 단위: auth, nfc, chat 등
│  ├─ entities/              # 도메인 객체(User, Item 등)
│  ├─ widgets/               # 여러 기능을 합친 화면 조각(카드, 섹션 등)
│  ├─ shared/                # 완전 범용 계층
│  │   ├─ ui/                # 디자인 시스템 컴포넌트(Button, Card 등)
│  │   ├─ lib/               # axiosClient, storage, 날짜 유틸 등
│  │   ├─ hooks/             # 범용 훅(useBoolean 등)
│  │   ├─ styles/            # theme, tokens(색/타이포/spacing)
│  │   ├─ utils/             # 숫자/문자/날짜, 에러 핸들링 헬퍼
│  │   └─ config/            # env 로딩, 상수, Feature Flags
│  ├─ services/              # 외부 연동 레이어
│  │   ├─ api/               # API 클라이언트/요청 래퍼
│  │   ├─ ws/                # WebSocket 커넥터
│  │   ├─ sse/               # Server-Sent Events
│  │   ├─ ble/               # BLE 연결/특성 구독
│  │   └─ nfc/               # NFC read/write 래퍼
│  ├─ store/                 # 전역 상태(Zustand 등)
│  ├─ i18n/                  # 번역 리소스, i18n 초기화
│  └─ types/                 # 글로벌 타입(Env, API 공통 등)
│
├─ assets/                   # 이미지, 아이콘, 폰트
├─ scripts/                  # 빌드 전/후 스크립트, reset 등
├─ app.json                  # Expo 앱 설정(현재 사용)
├─ package.json
├─ tsconfig.json             # TypeScript 및 경로 별칭 설정
└─ README.md
```

---

## 라우팅 구조(요약)
- `app/_layout.tsx`: 테마(라이트/다크)와 최상위 `Stack`을 설정합니다.
  - `Stack.Screen name="(tabs)"`로 탭 그룹을 포함합니다.
  - `Stack.Screen name="+not-found"`로 404 화면을 지정합니다.
- `app/(tabs)/_layout.tsx`: 탭을 정의합니다.
  - 탭: `home`, `search`, `settings` (각각 `app/(tabs)/*.tsx`)
- `app/(auth)`: 인증 플로우 (로그인/회원가입)
- `app/item/[id].tsx`: 아이템 상세 동적 라우트
- `app/modal.tsx`: 모달 프레젠테이션 라우트

화면 컴포넌트는 추후 `src/`의 도메인/기능 코드와 분리하여 유지보수합니다.

---

## 경로 별칭(Path Aliases)
`tsconfig.json`에 다음 별칭이 설정되어 있습니다.
```
@/*            -> ./*
@app/*         -> app/*
@src/*         -> src/*
@features/*    -> src/features/*
@entities/*    -> src/entities/*
@widgets/*     -> src/widgets/*
@shared/*      -> src/shared/*
@services/*    -> src/services/*
@store/*       -> src/store/*
@i18n/*        -> src/i18n/*
@types/*       -> src/types/*
```
예)
```ts
import { Button } from '@shared/ui/Button';
import { useAuth } from '@features/auth/hooks/useAuth';
```

---

## 스크립트(패키지)
`package.json`의 유용한 스크립트:
- `npm run start`: Expo 개발 서버 시작 (플랫폼 선택 가능)
- `npm run web`: 웹 브라우저로 실행
- `npm run android`: 안드로이드(에뮬레이터/디바이스)
- `npm run ios`: iOS(시뮬레이터/디바이스)
- `npm run reset-project`: 초기 템플릿으로 리셋 스크립트
- `npm run lint`: ESLint 검사

의존성 주요 버전:
- `expo ~53.x`, `react-native 0.79.x`, `expo-router ~5.1.x`, `react 19`

---

## 시작하기
1) 의존성 설치
```bash
npm install
```

2) 실행 (웹)
```bash
npm run web
```
또는 플랫폼 선택 실행
```bash
npm run start
```

3) 라우트 개발
- 새 화면: `app/` 아래에 파일 생성 (예: `app/profile.tsx` → `/profile`)
- 그룹/중첩 레이아웃: `(group)/_layout.tsx` 사용
- 복잡한 비즈니스 로직/상태는 `src/`에 구현하고, 라우트에서는 가져다 사용

---

## 코드 가이드
- TypeScript `strict: true` 사용
- 컴포넌트/함수 이름은 의미 있게, 약어 지양
- UI는 `src/shared/ui/`에서 재사용 컴포넌트로 구성 권장
- 상태 관리(Zustand 등)는 `src/store/` 또는 기능별 slice(`src/features/*/model`)로 분리
- 네트워크/외부 연동은 `src/services/`에서 캡슐화
- 날짜/문자열/에러 유틸은 `src/shared/utils/`

---

## 자주 하는 작업
- 새 기능 추가: `src/features/<feature>`에 컴포넌트/훅/API/모델 생성 후 `app/` 라우트에 화면 연결
- 공통 스타일/토큰 추가: `src/shared/styles/`
- 환경/상수 추가: `src/shared/config/`

---

## TODO / 다음 단계 제안
- 디자인 시스템 구성요소(`src/shared/ui/`) 확장 및 토큰 정리
- `src/services/api`에 공통 API 클라이언트 추가(예: axios + 인터셉터)
- 전역 상태(store) 설계 및 기능별 slice 연결
- i18n 초기화와 리소스 추가(`src/i18n`)
- 테스트 디렉터리 구성(Jest/RTL/Detox)

---

## 라이선스
내부 프로젝트 용도(필요 시 업데이트).
