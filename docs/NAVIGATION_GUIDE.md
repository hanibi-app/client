# 🧭 한니비 앱 네비게이션 가이드

## 📊 현재 라우팅 구조 (상세 분석)

### 전체 구조도

```
App.tsx
└── NavigationContainer (React Navigation 루트)
    └── RootNavigator (Native Stack Navigator)
        ├── OnboardingNavigator (온보딩 완료 전)
        │   ├── LoginScreen
        │   └── NotificationRequestScreen
        └── TabsNavigator (온보딩 완료 후)
            ├── TabOneScreen
            └── TabTwoScreen
        └── ModalScreen (모달)
```

### 1. **App.tsx** - 최상위 네비게이션 컨테이너

```typescript
NavigationContainer
├── 테마: 다크/라이트 모드 자동 전환
└── RootNavigator 래핑
```

**역할:**
- React Navigation의 최상위 컨테이너
- 전체 앱의 네비게이션 상태 관리
- 테마 적용 (다크/라이트 모드)

---

### 2. **RootNavigator.tsx** - 조건부 라우팅 (메인 라우터)

**라우트 타입:**
```typescript
RootStackParamList {
  Onboarding: undefined;
  Tabs: undefined;
  Modal: undefined;
}
```

**특징:**
- ✅ **조건부 렌더링**: AsyncStorage로 온보딩 완료 여부 확인
- ✅ **동적 네비게이션**: 온보딩 상태에 따라 다른 Navigator 렌더링
- ✅ **Native Stack Navigator**: 네이티브 성능의 스택 전환 애니메이션
- ✅ **상수 기반 라우팅**: `ROOT_ROUTES` 상수 사용

**플로우:**
```
앱 시작
  ↓
AsyncStorage 확인 (@hanibi:onboarding_complete)
  ↓
false? → OnboardingNavigator (로그인 + 알림 요청)
  ↓
true?  → TabsNavigator (메인 앱)
         + ModalScreen (모달 접근 가능)
```

**구현 코드:**
```typescript
// 조건부 스크린 렌더링
{!isOnboardingComplete ? (
  <Stack.Screen name={ROOT_ROUTES.ONBOARDING}>
    <OnboardingNavigator onComplete={completeOnboarding} />
  </Stack.Screen>
) : (
  <>
    <Stack.Screen name={ROOT_ROUTES.TABS} component={TabsNavigator} />
    <Stack.Screen name={ROOT_ROUTES.MODAL} component={ModalScreen} />
  </>
)}
```

---

### 3. **OnboardingNavigator.tsx** - 온보딩 플로우

**라우트 타입:**
```typescript
OnboardingStackParamList {
  Login: undefined;
  NotificationRequest: undefined;
}
```

**특징:**
- ✅ **순차적 플로우**: Login → NotificationRequest
- ✅ **초기 라우트**: `initialRouteName={ONBOARDING_ROUTES.LOGIN}`
- ✅ **헤더 숨김**: `headerShown: false`
- ✅ **상수 기반**: `ONBOARDING_ROUTES` 상수 사용

**이동 방식:**
```typescript
// 프로그래매틱 이동
navigation.navigate(ONBOARDING_ROUTES.NOTIFICATION_REQUEST);

// 완료 시 콜백
onComplete?.(); // → RootNavigator로 상태 전달 → TabsNavigator로 이동
```

**스크린 구조:**
```typescript
<Stack.Navigator initialRouteName={ONBOARDING_ROUTES.LOGIN}>
  <Stack.Screen name={ONBOARDING_ROUTES.LOGIN}>
    <LoginScreen onKakaoLogin={handleKakaoLogin} />
  </Stack.Screen>
  <Stack.Screen name={ONBOARDING_ROUTES.NOTIFICATION_REQUEST}>
    <NotificationRequestScreen 
      onEnableNotifications={handleEnableNotifications}
      onSkip={handleSkip}
    />
  </Stack.Screen>
</Stack.Navigator>
```

---

### 4. **TabsNavigator.tsx** - 메인 앱 탭

**라우트 타입:**
```typescript
TabsParamList {
  TabOne: undefined;
  TabTwo: undefined;
}
```

**특징:**
- ✅ **Bottom Tab Navigator**: 하단 탭 바 UI 제공
- ✅ **아이콘**: FontAwesome 아이콘 사용
- ✅ **헤더 표시**: `headerShown: true`
- ✅ **모달 연결**: TabOne에서 Modal로 이동 가능
- ✅ **상수 기반**: `TAB_ROUTES` 상수 사용

**탭 구성:**
- TabOne: 3D 한니비 캐릭터 데모 화면 (헤더 우측에 모달 버튼)
- TabTwo: 일반 탭 화면

**모달 접근:**
```typescript
// TabOne 헤더에서 모달 열기
navigation.navigate(ROOT_ROUTES.MODAL);
```

---

## 🔄 상수 기반 라우팅 시스템

### **라우트 상수 정의** (`src/constants/routes.ts`)

모든 라우트 이름을 중앙에서 관리하여 타입 안정성과 유지보수성을 보장합니다.

```typescript
// Root Navigator Routes
export const ROOT_ROUTES = {
  ONBOARDING: 'Onboarding',
  TABS: 'Tabs',
  MODAL: 'Modal',
} as const;

// Onboarding Navigator Routes
export const ONBOARDING_ROUTES = {
  LOGIN: 'Login',
  NOTIFICATION_REQUEST: 'NotificationRequest',
} as const;

// Tabs Navigator Routes
export const TAB_ROUTES = {
  TAB_ONE: 'TabOne',
  TAB_TWO: 'TabTwo',
} as const;

// 통합 라우트 (타입 체크용)
export const ROUTES = {
  ...ROOT_ROUTES,
  ...ONBOARDING_ROUTES,
  ...TAB_ROUTES,
} as const;
```

### 사용 방법

**1. 네비게이터에서 스크린 이름 지정:**
```typescript
import { ROOT_ROUTES } from '@/constants/routes';

<Stack.Screen name={ROOT_ROUTES.ONBOARDING} component={OnboardingNavigator} />
```

**2. 네비게이션 호출:**
```typescript
import { ONBOARDING_ROUTES } from '@/constants/routes';

navigation.navigate(ONBOARDING_ROUTES.NOTIFICATION_REQUEST);
```

**3. 타입 정의:**
```typescript
import { ROOT_ROUTES } from '@/constants/routes';

export type RootStackParamList = {
  [ROOT_ROUTES.ONBOARDING]: undefined;
  [ROOT_ROUTES.TABS]: undefined;
  [ROOT_ROUTES.MODAL]: undefined;
};
```

### 상수 기반 라우팅의 장점

✅ **타입 안정성**: 컴파일 타임에 오타 감지  
✅ **중앙 관리**: 한 곳에서 모든 라우트 이름 관리  
✅ **리팩토링 용이**: 이름 변경 시 한 곳만 수정  
✅ **자동완성**: IDE에서 자동완성 지원  
✅ **문서화**: 라우트 구조가 코드로 명확히 드러남  

---

## 🛠 React Navigation 구현 방식

### 현재 사용 중인 Navigator 타입

#### 1. **Native Stack Navigator** (`@react-navigation/native-stack`)

**사용 위치:**
- `RootNavigator`
- `OnboardingNavigator`

**특징:**
- ✅ 네이티브 성능 (네이티브 스택 사용)
- ✅ 부드러운 전환 애니메이션
- ✅ iOS/Android 네이티브 제스처 지원 (뒤로가기, 스와이프)
- ✅ 네이티브 헤더 활용 가능

**코드 예시:**
```typescript
const Stack = createNativeStackNavigator<RootStackParamList>();

<Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name={ROOT_ROUTES.TABS} component={TabsNavigator} />
</Stack.Navigator>
```

#### 2. **Bottom Tab Navigator** (`@react-navigation/bottom-tabs`)

**사용 위치:**
- `TabsNavigator`

**특징:**
- ✅ 하단 탭 UI 자동 제공
- ✅ 탭 간 빠른 전환 (스택 유지)
- ✅ 아이콘 및 배지 커스터마이징
- ✅ 탭별 독립적인 네비게이션 스택

**코드 예시:**
```typescript
const Tab = createBottomTabNavigator<TabsParamList>();

<Tab.Navigator>
  <Tab.Screen 
    name={TAB_ROUTES.TAB_ONE}
    component={TabOneScreen}
    options={{ tabBarIcon: ({ color }) => <Icon /> }}
  />
</Tab.Navigator>
```

---

## 📋 현재 구현 상태 상세 분석

### ✅ 구현 완료된 기능

1. **조건부 라우팅**
   - AsyncStorage로 온보딩 상태 관리
   - 조건에 따른 동적 Navigator 렌더링
   - 상태 변경 시 자동 화면 전환

2. **중첩 네비게이터**
   - RootNavigator → OnboardingNavigator
   - RootNavigator → TabsNavigator
   - 깔끔한 계층 구조

3. **상수 기반 라우팅**
   - 모든 라우트 이름을 상수로 관리
   - 타입 안정성 보장
   - 중앙 집중식 관리

4. **Props 전달**
   - `render` prop으로 콜백 함수 전달
   - 화면 간 상태 공유

5. **타입 안정성**
   - TypeScript로 모든 라우트 타입 정의
   - ParamList 타입으로 타입 체크

### 📝 현재 코드 구조 요약

```
src/
├── constants/
│   └── routes.ts              # ✅ 라우트 상수 정의 (중앙 관리)
├── navigation/
│   ├── RootNavigator.tsx      # ✅ 메인 라우터 (조건부 렌더링)
│   ├── OnboardingNavigator.tsx # ✅ 온보딩 플로우
│   └── TabsNavigator.tsx      # ✅ 메인 앱 탭
└── screens/
    ├── LoginScreen.tsx
    ├── NotificationRequestScreen.tsx
    ├── TabOneScreen.tsx
    ├── TabTwoScreen.tsx
    └── ModalScreen.tsx
```

---

## 🔧 React Navigation의 다른 Navigator 타입 (참고)

### Stack Navigator 변형

```typescript
// 1. Native Stack (현재 사용) ✅
createNativeStackNavigator() // 네이티브 성능

// 2. JS Stack
createStackNavigator() // 더 유연하지만 성능 낮음
```

### Tab Navigator 변형

```typescript
// 1. Bottom Tab (현재 사용) ✅
createBottomTabNavigator()

// 2. Material Top Tab
createMaterialTopTabNavigator() // 상단 탭

// 3. Material Bottom Tab
createMaterialBottomTabNavigator() // Material Design 탭
```

### Drawer Navigator

```typescript
createDrawerNavigator() // 사이드 메뉴
```

---

## 💡 React Navigation 선택 이유

### 1. **Expo 완벽 지원**
   - Expo SDK와 완벽 호환
   - 추가 네이티브 설정 불필요
   - Managed Workflow에서 바로 사용 가능

### 2. **유연한 구조**
   - 조건부 라우팅 구현 용이 (온보딩 상태)
   - 중첩 네비게이터 구조 지원
   - Props 전달이 간편

### 3. **타입 안정성**
   - TypeScript로 모든 라우트 타입 정의
   - 컴파일 타임 에러 체크
   - 상수 기반으로 추가 안정성 확보

### 4. **성능**
   - Native Stack Navigator로 네이티브 성능
   - 부드러운 애니메이션
   - 최적화된 메모리 관리

### 5. **커뮤니티**
   - 널리 사용되는 표준 라이브러리
   - 풍부한 문서와 예제
   - 활발한 커뮤니티 지원

---

## 🚀 향후 개선 가능 사항

### 1. **Deep Linking 설정**

```typescript
// App.tsx에 Linking 설정 추가
const linking = {
  prefixes: ['hanibi://', 'https://hanibi.app'],
  config: {
    screens: {
      [ROOT_ROUTES.ONBOARDING]: {
        screens: {
          [ONBOARDING_ROUTES.LOGIN]: 'login',
          [ONBOARDING_ROUTES.NOTIFICATION_REQUEST]: 'notification',
        },
      },
      [ROOT_ROUTES.TABS]: {
        screens: {
          [TAB_ROUTES.TAB_ONE]: 'home',
          [TAB_ROUTES.TAB_TWO]: 'settings',
        },
      },
    },
  },
};

<NavigationContainer linking={linking}>
  <RootNavigator />
</NavigationContainer>
```

### 2. **타입 안정성 강화**

```typescript
// OnboardingNavigator에서 any 제거
import { NavigationProp } from '@react-navigation/native';

type OnboardingNavigationProp = NavigationProp<OnboardingStackParamList>;

const navigation = useNavigation<OnboardingNavigationProp>();
```

### 3. **라우트 가드 추가**

```typescript
// 인증 상태 확인 후 라우팅
const [isAuthenticated, setIsAuthenticated] = useState(false);

useEffect(() => {
  checkAuthStatus().then(setIsAuthenticated);
}, []);
```

### 4. **라우트 히스토리 관리**

```typescript
// 특정 화면으로 리셋
navigation.reset({
  index: 0,
  routes: [{ name: ROOT_ROUTES.TABS }],
});
```

---

## 📖 추가 자료

- [React Navigation 공식 문서](https://reactnavigation.org/)
- [React Navigation 타입스크립트 가이드](https://reactnavigation.org/docs/typescript)
- [React Navigation Deep Linking](https://reactnavigation.org/docs/deep-linking)

---

## ✅ 요약

**현재 프로젝트는 React Navigation을 사용하며:**

- ✅ **Native Stack + Bottom Tabs** 구조
- ✅ **상수 기반 라우팅**으로 타입 안정성 확보
- ✅ **조건부 네비게이션** (온보딩 상태 기반)
- ✅ **중첩 네비게이터** 구조
- ✅ **TypeScript 완벽 지원**

**모든 라우트 이름은 `src/constants/routes.ts`에서 중앙 관리됩니다!** 🎯
