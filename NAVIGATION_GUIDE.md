# 네비게이션 가이드

> React Native 앱의 라우팅 시스템 사용 가이드

## 📋 개요

이 가이드는 프로젝트의 네비게이션 구조와 라우팅 시스템 사용법을 설명합니다.

## 🏗 네비게이션 구조

### 계층 구조

```
RootNavigator (Stack)
├── TabsNavigator (Bottom Tabs)
│   ├── TabOne
│   └── TabTwo
├── Modal
└── SampleKeyboard
```

### 라우트 매핑

| 화면           | 라우트           | 타입  | 파라미터 |
| -------------- | ---------------- | ----- | -------- |
| Tabs           | `Tabs`           | Stack | 없음     |
| TabOne         | `TabOne`         | Tab   | 없음     |
| TabTwo         | `TabTwo`         | Tab   | 없음     |
| Modal          | `Modal`          | Stack | 없음     |
| SampleKeyboard | `SampleKeyboard` | Stack | 없음     |

## 🎯 사용법

### 기본 네비게이션

#### 화면 이동

```typescript
// 기본 화면 이동
navigation.navigate('Tabs');

// 모달 열기
navigation.navigate('Modal');

// 뒤로 가기
navigation.goBack();

// 뒤로 갈 수 있는지 확인
const canGoBack = navigation.canGoBack();
```

#### 타입 안전한 네비게이션

```typescript
import { RootStackScreenProps } from '@/types/navigation';

type ScreenProps = RootStackScreenProps<'Modal'>;

function MyScreen({ navigation }: ScreenProps) {
  // 타입 안전한 네비게이션
  navigation.navigate('Tabs'); // ✅ 올바름
  navigation.navigate('InvalidScreen'); // ❌ 타입 에러
}
```

### 딥링크 처리

#### 딥링크 URL 형식

```
hanibi://tabs                    # Tabs 화면으로 이동
hanibi://modal                   # Modal 화면으로 이동
hanibi://keyboard                # SampleKeyboard 화면으로 이동
hanibi://tabs?param1=value1      # 파라미터와 함께 이동
```

#### 딥링크 처리 예시

```typescript
import { handleDeepLink } from '@/utils/navigation';

// 딥링크 처리
const url = 'hanibi://tabs?param1=value1';
handleDeepLink(url, navigation);
```

### 라우팅 유틸리티

#### 딥링크 파싱

```typescript
import { parseDeepLink } from '@/utils/navigation';

const url = 'hanibi://tabs?param1=value1';
const result = parseDeepLink(url);
// result.screen = 'Tabs'
// result.params = { param1: 'value1' }
```

#### 라우트 검증

```typescript
import { validateRoute } from '@/utils/navigation';

const validation = validateRoute('Tabs');
if (validation.isValid) {
  // 라우트가 유효함
} else {
  console.error(validation.error);
}
```

#### 내부 링크 생성

```typescript
import { createInternalLink } from '@/utils/navigation';

const link = createInternalLink('Tabs', { param1: 'value1' });
// link = 'hanibi://tabs?param1=value1'
```

#### 외부 링크 열기

```typescript
import { openExternalLink } from '@/utils/navigation';

await openExternalLink('https://example.com');
```

## 🔧 개발 가이드

### 새로운 화면 추가

1. **타입 정의 추가**

```typescript
// src/types/navigation.ts
export type RootStackParamList = {
  // 기존 화면들...
  NewScreen: { id: string }; // 파라미터가 있는 경우
};
```

2. **네비게이터에 화면 추가**

```typescript
// src/navigation/RootNavigator.tsx
<Stack.Screen
  name="NewScreen"
  component={NewScreen}
  options={{ title: 'New Screen' }}
/>
```

3. **화면 컴포넌트 생성**

```typescript
// src/screens/NewScreen.tsx
import { RootStackScreenProps } from '@/types/navigation';

type NewScreenProps = RootStackScreenProps<'NewScreen'>;

export default function NewScreen({ navigation, route }: NewScreenProps) {
  const { id } = route.params;
  // 화면 로직...
}
```

### 딥링크 라우트 추가

1. **라우트 매핑 업데이트**

```typescript
// src/utils/navigation.ts
const routeMap: Record<string, string> = {
  tabs: 'Tabs',
  modal: 'Modal',
  keyboard: 'SampleKeyboard',
  newscreen: 'NewScreen', // 새 라우트 추가
};
```

2. **라우트 검증 규칙 추가**

```typescript
// src/utils/navigation.ts
const validRoutes = ['Tabs', 'Modal', 'SampleKeyboard', 'NewScreen'];
```

## 🧪 테스트

### 네비게이션 테스트 실행

```bash
npm test src/utils/__tests__/navigation.test.ts
```

### 테스트 커버리지

- 딥링크 파싱
- 라우트 검증
- 내부 링크 생성
- 외부 링크 처리

## 🚨 주의사항

### 타입 안전성

- 모든 네비게이션은 타입 정의를 사용해야 함
- `any` 타입 사용 금지
- 라우트 파라미터는 반드시 타입 정의

### 성능 고려사항

- 불필요한 화면 리렌더링 방지
- 네비게이션 스택 관리
- 메모리 누수 방지

### 접근성

- 화면 전환 시 접근성 라벨 제공
- 키보드 네비게이션 지원
- 스크린 리더 호환성

## 📚 참고 자료

- [React Navigation 공식 문서](https://reactnavigation.org/)
- [Expo Linking 가이드](https://docs.expo.dev/guides/linking/)
- [프로젝트 컨벤션 - Navigation](./PROJECT_CONVENTIONS.md#-navigation)
- [개발 가이드](./DEVELOPMENT.md)
