# 🛠️ 한니비 클라이언트 개발 환경 완전 가이드

## 📋 목차

1. [개발 환경 개요](#개발-환경-개요)
2. [기술 스택 및 버전](#기술-스택-및-버전)
3. [프로젝트 구조](#프로젝트-구조)
4. [앱 플로우 및 네비게이션](#앱-플로우-및-네비게이션)
5. [화면 이동 방식](#화면-이동-방식)
6. [상태 관리](#상태-관리)
7. [주요 라이브러리 상세](#주요-라이브러리-상세)

---

## 🎯 개발 환경 개요

### 프로젝트 정보

- **프로젝트명**: Hanibi Client
- **플랫폼**: Android / iOS (크로스 플랫폼)
- **프레임워크**: Expo + React Native
- **언어**: TypeScript (strict mode)
- **패키지 매니저**: npm

### 개발 환경 요구사항

- **Node.js**: 18 이상
- **npm**: 8.15.0 이상
- **Expo CLI**: 최신 버전
- **Xcode**: iOS 개발 시 (macOS만)
- **Android Studio**: Android 개발 시

---

## 📦 기술 스택 및 버전

### 핵심 프레임워크

| 패키지           | 버전      | 용도                    |
| ---------------- | --------- | ----------------------- |
| **expo**         | `54.0.23` | Expo SDK 메인 패키지    |
| **react**        | `19.1.0`  | React 라이브러리        |
| **react-native** | `0.81.5`  | React Native 프레임워크 |
| **react-dom**    | `19.1.0`  | 웹 렌더링 지원          |
| **typescript**   | `~5.9.2`  | 타입 안정성             |

### 네비게이션

| 패키지                             | 버전     | 용도               |
| ---------------------------------- | -------- | ------------------ |
| **@react-navigation/native**       | `^7.1.8` | 네비게이션 코어    |
| **@react-navigation/native-stack** | `^7.6.2` | 스택 네비게이터    |
| **@react-navigation/bottom-tabs**  | `^7.7.3` | 하단 탭 네비게이터 |
| **@react-navigation/elements**     | `^2.1.1` | 네비게이션 요소    |

### 상태 관리

| 패키지                                        | 버전     | 용도           |
| --------------------------------------------- | -------- | -------------- |
| **zustand**                                   | `^5.0.8` | 전역 상태 관리 |
| **@react-native-async-storage/async-storage** | `^2.2.0` | 로컬 스토리지  |

### Expo 모듈

| 패키지                 | 버전       | 용도            |
| ---------------------- | ---------- | --------------- |
| **expo-font**          | `~14.0.9`  | 커스텀 폰트     |
| **expo-splash-screen** | `~31.0.10` | 스플래시 스크린 |
| **expo-status-bar**    | `~3.0.8`   | 상태바 제어     |
| **expo-web-browser**   | `~15.0.9`  | 웹 브라우저     |
| **@expo/vector-icons** | `^15.0.3`  | 아이콘 세트     |

> 참고: `expo-constants`, `expo-linking`은 코드에서 사용되지 않아 dependencies에서 제거되었습니다. 딥링크 또는 환경 상수 기능이 다시 필요하면 해당 시점에만 재추가하세요.

### 애니메이션

| 패키지                    | 버전      | 용도                | 실제 사용                                   |
| ------------------------- | --------- | ------------------- | ------------------------------------------- |
| **react-native Animated** | 기본 제공 | 기본 애니메이션 API | ✅ 사용 중 (HanibiCharacter2D, HanibiState) |

> 참고: `react-native-reanimated`, `react-native-worklets`는 사용되지 않아 제거했습니다. 고성능 애니메이션이 필요하면 해당 시점에만 다시 설치하세요. 자세한 내용은 [ANIMATION_LIBRARIES_USAGE.md](./ANIMATION_LIBRARIES_USAGE.md)를 참고하세요.

### UI/UX

| 패키지                             | 버전      | 용도            |
| ---------------------------------- | --------- | --------------- |
| **react-native-safe-area-context** | `~5.6.0`  | Safe Area 처리  |
| **react-native-screens**           | `~4.16.0` | 네이티브 스크린 |
| **react-native-web**               | `~0.21.0` | 웹 지원         |

### 개발 도구

| 패키지                            | 버전       | 용도                 |
| --------------------------------- | ---------- | -------------------- |
| **eslint**                        | `^8.57.0`  | 코드 품질 검사       |
| **prettier**                      | `^3.3.3`   | 코드 포맷팅          |
| **husky**                         | `^9.1.7`   | Git 훅               |
| **lint-staged**                   | `^16.2.3`  | 스테이징된 파일 린트 |
| **@commitlint/cli**               | `^20.1.0`  | 커밋 메시지 검증     |
| **jest-expo**                     | `~54.0.13` | 테스트 프레임워크    |
| **@testing-library/react-native** | `^12.9.0`  | 컴포넌트 테스트      |

---

## 🏗️ 프로젝트 구조

```
hanibi/client/
├── App.tsx                    # 앱 진입점
├── app.json                   # Expo 설정
├── package.json               # 의존성 관리
├── tsconfig.json              # TypeScript 설정
├── jest.config.js             # Jest 설정
├── .eslintrc.js               # ESLint 설정
├── .prettierrc                # Prettier 설정
│
├── src/
│   ├── assets/                # 정적 자원
│   │   ├── fonts/             # 폰트 파일
│   │   └── images/            # 이미지 파일
│   │
│   ├── components/            # 재사용 컴포넌트
│   │   ├── common/            # 공용 컴포넌트
│   │   │   ├── HanibiCharacter2D.tsx
│   │   │   ├── AppButton.tsx
│   │   │   ├── DataChart.tsx
│   │   │   └── ...
│   │   └── ui/                # UI 컴포넌트
│   │
│   ├── constants/             # 상수 정의
│   │   ├── routes.ts          # 라우트 이름
│   │   ├── Colors.ts          # 색상 상수
│   │   └── hanibiThresholds.ts
│   │
│   ├── navigation/            # 네비게이션 설정
│   │   ├── RootNavigator.tsx  # 루트 네비게이터
│   │   ├── MainTabs.tsx       # 메인 탭
│   │   ├── HomeStack.tsx      # 홈 스택
│   │   ├── OnboardingNavigator.tsx
│   │   └── types.ts           # 타입 정의
│   │
│   ├── screens/               # 화면 컴포넌트
│   │   ├── LoginScreen.tsx
│   │   ├── NotificationRequestScreen.tsx
│   │   ├── PrecautionsScreen.tsx
│   │   ├── Home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── CharacterCustomizeScreen.tsx
│   │   ├── Dashboard/
│   │   ├── Reports/
│   │   └── Settings/
│   │
│   ├── services/              # 외부 서비스
│   │   ├── api/               # API 클라이언트
│   │   ├── ble/               # 블루투스
│   │   ├── sse/               # Server-Sent Events
│   │   └── ws/                # WebSocket
│   │
│   ├── state/                 # 상태 관리
│   │   └── useAppState.ts     # Zustand 스토어
│   │
│   ├── store/                 # 추가 스토어 (예정)
│   │
│   ├── theme/                 # 테마
│   │   ├── Colors.ts
│   │   ├── spacing.ts
│   │   └── typography.ts
│   │
│   ├── types/                 # TypeScript 타입
│   │
│   └── utils/                 # 유틸리티 함수
│       ├── layout.ts
│       └── resetOnboarding.ts
│
└── docs/                      # 문서
    └── NAVIGATION_GUIDE.md
```

---

## 🔄 앱 플로우 및 네비게이션

### 전체 앱 플로우 다이어그램

```
앱 시작 (App.tsx)
    ↓
Splash Screen (expo-splash-screen)
    ↓
폰트 로드 (expo-font)
    ↓
NavigationContainer
    ↓
RootNavigator
    ├─→ [온보딩 미완료]
    │       ↓
    │   LoginScreen
    │       ↓ (카카오 로그인)
    │   NotificationRequestScreen
    │       ↓ (알림 허용/건너뛰기)
    │   PrecautionsScreen (3페이지)
    │       ↓ (완료)
    │   AsyncStorage 저장
    │       ↓
    └─→ [온보딩 완료]
            ↓
        MainTabs (Bottom Tabs)
            ├─→ HomeTab (HomeStack)
            │       ├─→ HomeScreen
            │       └─→ CharacterCustomizeScreen
            ├─→ DashboardTab
            │       └─→ DashboardScreen
            ├─→ ReportsTab
            │       └─→ ReportsScreen
            └─→ SettingsTab
                    └─→ SettingsScreen
```

### 네비게이션 구조 상세

#### 1. **App.tsx** - 최상위 진입점

```typescript
App.tsx
├── 폰트 로드 (useFonts)
├── 스플래시 스크린 관리
└── NavigationContainer
    ├── 테마: 다크/라이트 자동 전환
    └── RootNavigator
```

**역할**:

- 앱 초기화
- 폰트 및 리소스 로드
- 네비게이션 컨테이너 설정

#### 2. **RootNavigator** - 조건부 라우팅

```typescript
RootNavigator
├── AsyncStorage 확인 (@hanibi:onboarding_complete)
├── [온보딩 미완료]
│   ├── LoginScreen
│   ├── NotificationRequestScreen
│   └── PrecautionsScreen (CautionSlides)
└── [온보딩 완료]
    └── MainTabs
```

**특징**:

- ✅ **조건부 렌더링**: 온보딩 상태에 따라 다른 화면 표시
- ✅ **상태 관리**: Zustand로 `hasOnboarded` 관리
- ✅ **AsyncStorage**: 온보딩 완료 여부 영구 저장

**라우트 타입**:

```typescript
RootStackParamList {
  Login: undefined;
  NotificationRequest: undefined;
  CautionSlides: undefined;
  MainTabs: undefined;
  CameraPermission: undefined;
  CameraCapture: undefined;
  CameraPreview: { uri: string };
}
```

#### 3. **MainTabs** - 메인 앱 탭 네비게이터

```typescript
MainTabs (Bottom Tab Navigator)
├── HomeTab (HomeStack)
│   ├── HomeScreen
│   └── CharacterCustomizeScreen
├── DashboardTab
│   └── DashboardScreen
├── ReportsTab
│   └── ReportsScreen
└── SettingsTab
    └── SettingsScreen
```

**탭 구성**:

- **홈**: 한니비 캐릭터 및 메인 화면
- **대시보드**: 데이터 시각화
- **리포트**: 리포트 및 통계
- **설정**: 앱 설정

#### 4. **HomeStack** - 홈 스택 네비게이터

```typescript
HomeStack (Native Stack)
├── Home (초기 화면)
└── CharacterCustomize (캐릭터 커스터마이징)
```

**특징**:

- 홈 화면에서 캐릭터 커스터마이징으로 이동
- 뒤로가기 버튼 자동 제공

---

## 🧭 화면 이동 방식

### 1. 프로그래매틱 네비게이션

#### 기본 이동

```typescript
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// 타입 안전한 네비게이션
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

function LoginScreen({ navigation }: Props) {
  // 다음 화면으로 이동
  navigation.navigate('NotificationRequest');

  // 뒤로가기
  navigation.goBack();

  // 스택 리셋 (온보딩 완료 후)
  navigation.reset({
    index: 0,
    routes: [{ name: 'MainTabs' }],
  });
}
```

#### 파라미터 전달

```typescript
// 파라미터와 함께 이동
navigation.navigate('CameraPreview', {
  uri: 'file://...',
});

// 파라미터 받기
type PreviewProps = NativeStackScreenProps<RootStackParamList, 'CameraPreview'>;
function CameraPreviewScreen({ route }: PreviewProps) {
  const { uri } = route.params; // 타입 안전
}
```

### 2. 탭 네비게이션

```typescript
// 탭 간 이동
const tabNavigation = useNavigation<TabNavigationProp<TabParamList>>();
tabNavigation.navigate('DashboardTab');
```

### 3. 스택 네비게이션 (HomeStack)

```typescript
// HomeStack 내에서 이동
const homeNavigation = useNavigation<HomeStackNavigationProp>();
homeNavigation.navigate('CharacterCustomize');
```

### 4. 조건부 네비게이션 (온보딩)

```typescript
// RootNavigator에서 조건부 렌더링
{!hasOnboarded ? (
  <>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="NotificationRequest" component={NotificationRequestScreen} />
    <Stack.Screen name="CautionSlides" component={PrecautionsScreen} />
  </>
) : null}
<Stack.Screen name="MainTabs" component={MainTabs} />
```

### 5. 콜백 기반 네비게이션

```typescript
// PrecautionsScreen 완료 시
<PrecautionsScreen
  onComplete={() => {
    // AsyncStorage 저장
    await AsyncStorage.setItem('@hanibi:onboarding_complete', 'true');
    // 상태 업데이트
    setHasOnboarded(true);
    // MainTabs로 이동
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  }}
/>
```

---

## 📊 상태 관리

### Zustand 스토어 구조

```typescript
// src/state/useAppState.ts
type AppState = {
  // 온보딩 상태
  hasOnboarded: boolean;
  notificationsEnabled: boolean;

  // 홈 화면 상태
  hungryLevel: 'low' | 'high';
  humidityLevel: 'low' | 'high';
  smellIndex: number; // 0~100

  // 액션
  setHasOnboarded(b: boolean): void;
  setNotificationsEnabled(b: boolean): void;
  setHungryLevel(v: 'low' | 'high'): void;
  setHumidityLevel(v: 'low' | 'high'): void;
  setSmellIndex(n: number): void;
};
```

### 사용 예시

```typescript
// 컴포넌트에서 사용
import { useAppState } from '@/state/useAppState';

function MyComponent() {
  // 전체 상태 구독
  const hasOnboarded = useAppState((s) => s.hasOnboarded);
  const setHasOnboarded = useAppState((s) => s.setHasOnboarded);

  // 또는 선택적 구독 (성능 최적화)
  const hungryLevel = useAppState((s) => s.hungryLevel);

  // 상태 업데이트
  setHasOnboarded(true);
}
```

### AsyncStorage 연동

```typescript
// 온보딩 완료 저장
await AsyncStorage.setItem('@hanibi:onboarding_complete', 'true');
setHasOnboarded(true);

// 온보딩 상태 확인
const value = await AsyncStorage.getItem('@hanibi:onboarding_complete');
if (value === 'true') {
  setHasOnboarded(true);
}
```

---

## 🔧 주요 라이브러리 상세

### React Navigation

#### Native Stack Navigator

- **용도**: 스크린 간 스택 기반 이동
- **사용 위치**: RootNavigator, HomeStack
- **특징**: 네이티브 성능의 전환 애니메이션

#### Bottom Tab Navigator

- **용도**: 하단 탭 바 UI
- **사용 위치**: MainTabs
- **특징**: 탭 간 빠른 전환

### Zustand

- **용도**: 전역 상태 관리
- **장점**:
  - 간단한 API
  - TypeScript 지원
  - 성능 최적화 (선택적 구독)
- **사용 위치**: `src/state/useAppState.ts`

### Expo 모듈

#### expo-font

- 폰트 로드 및 관리
- `useFonts` 훅 사용

#### expo-splash-screen

- 스플래시 스크린 제어
- 리소스 로딩 완료까지 표시

#### expo-constants

- 앱 버전, 빌드 정보
- 디바이스 정보 접근

---

## 🎨 앱 설정 (app.json)

### 주요 설정

```json
{
  "expo": {
    "name": "client",
    "version": "1.0.0",
    "orientation": "portrait", // 세로 고정
    "userInterfaceStyle": "automatic", // 다크모드 자동
    "newArchEnabled": true, // New Architecture 활성화
    "scheme": "client", // 딥링크 스킴

    "ios": {
      "bundleIdentifier": "com.anonymous.client",
      "supportsTablet": true
    },

    "android": {
      "package": "com.anonymous.client",
      "edgeToEdgeEnabled": true
    }
  }
}
```

---

## 🚀 개발 워크플로우

### 1. 개발 서버 시작

```bash
npm start
# 또는
npx expo start
```

### 2. 플랫폼별 실행

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### 3. 코드 품질 관리

```bash
# 린트 검사
npm run lint

# 자동 수정
npm run lint:fix

# 포맷팅
npm run format:write

# 타입 체크
npm run typecheck
```

---

## 📝 요약

### 핵심 포인트

1. **네비게이션 구조**
   - RootNavigator: 조건부 온보딩/메인 분기
   - MainTabs: 하단 탭 네비게이션
   - HomeStack: 홈 화면 스택

2. **상태 관리**
   - Zustand: 전역 상태
   - AsyncStorage: 영구 저장

3. **화면 이동**
   - 프로그래매틱: `navigation.navigate()`
   - 타입 안전: TypeScript 타입 정의
   - 조건부: 온보딩 상태에 따라 분기

4. **기술 스택**
   - Expo SDK 54
   - React Native 0.81.5
   - React Navigation 7.x
   - Zustand 5.x

이 구조로 Android와 iOS를 하나의 코드베이스로 개발할 수 있습니다! 🚀
