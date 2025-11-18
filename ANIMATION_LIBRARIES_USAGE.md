# 🎬 애니메이션 라이브러리 사용 현황

## 📊 현재 상태

### 설치된 패키지

- ✅ `react-native Animated` (React Native 기본 API)
- ❌ `react-native-reanimated` (제거됨)
- ❌ `react-native-worklets` (제거됨)

### 실제 사용 현황

| 라이브러리                | 설치 여부    | 실제 사용           | 사용 위치             |
| ------------------------- | ------------ | ------------------- | --------------------- |
| `react-native-reanimated` | ❌ 제거됨    | —                   | —                     |
| `react-native-worklets`   | ❌ 제거됨    | —                   | —                     |
| `react-native Animated`   | ✅ 기본 제공 | ✅ **실제 사용 중** | 2개 컴포넌트에서 사용 |

---

## 🔍 상세 분석

### 1. react-native-reanimated

- 현재 dependencies에서 제거됨
- `App.tsx`의 사이드이펙트 import도 삭제함
- 필요 시 `npx expo install react-native-reanimated`로 재추가 가능

---

### 2. react-native-worklets

- 현재 dependencies에서 제거됨
- `react-native-reanimated`를 사용하지 않으므로 같이 제거
- 필요 시 `npx expo install react-native-worklets`로 재추가 가능

---

### 3. React Native 기본 Animated API (실제 사용 중)

#### 사용 위치

##### 1. `HanibiCharacter2D.tsx`

```typescript
// src/components/common/HanibiCharacter2D.tsx
import { Animated, StyleSheet, View } from 'react-native';

// 사용 예시
const rotateAnim = useRef(new Animated.Value(0)).current;
const scaleAnim = useRef(new Animated.Value(1)).current;
const translateYAnim = useRef(new Animated.Value(0)).current;

// 애니메이션 정의
const rotateAnimation = Animated.loop(
  Animated.sequence([
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }),
    // ...
  ]),
);

// 사용
<Animated.View
  style={{
    transform: [
      { rotate },
      { scale: scaleAnim },
      { translateY },
    ],
  }}
>
```

**용도**:

- 캐릭터 회전 애니메이션
- 호흡 효과 (크기 변화)
- 상하 움직임

##### 2. `HanibiState.tsx`

```typescript
// src/components/common/HanibiState.tsx
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

// 사용 예시
const progressValue = React.useRef(new Animated.Value(clamped)).current;

Animated.timing(progressValue, {
  toValue: clamped,
  duration: 240,
  useNativeDriver: false,
}).start();

const strokeDashoffset = progressValue.interpolate({
  inputRange: [0, 1],
  outputRange: [circumference, 0],
});

// SVG Circle 애니메이션
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
```

**용도**:

- 원형 프로그레스 바 애니메이션
- 값 변화 시 부드러운 전환

---

## 💡 결론 및 권장사항

### 현재 상황

1. **react-native-reanimated**: 설치되어 있지만 사용되지 않음
2. **react-native-worklets**: 설치되어 있지만 사용되지 않음
3. **React Native Animated**: 실제로 사용 중 (2개 컴포넌트)

### 권장사항

#### 옵션 1: 기본 Animated API 유지 (현재 상태)

- 추가 의존성 없이도 필요한 애니메이션을 구현 중
- 번들 크기 최소화, 빌드 속도 향상

#### 옵션 2: react-native-reanimated로 마이그레이션 (필요 시)

더 나은 성능을 원한다면 기본 Animated API를 react-native-reanimated로 마이그레이션할 수 있습니다:

```typescript
// 예시: HanibiCharacter2D.tsx 마이그레이션
import { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

const rotate = useSharedValue(0);
const scale = useSharedValue(1);
const translateY = useSharedValue(0);

useEffect(() => {
  rotate.value = withRepeat(
    withTiming(1, { duration: 3000 }),
    -1,
    true
  );
  // ...
}, []);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [
    { rotate: `${rotate.value * 20 - 10}deg` },
    { scale: scale.value },
    { translateY: translateY.value * 10 },
  ],
}));

<Animated.View style={animatedStyle}>
```

**장점**:

- 더 나은 성능 (60fps 보장)
- 더 복잡한 애니메이션 가능
- UI 스레드에서 실행

**단점**:

- 마이그레이션 작업 필요
- 학습 곡선

---

## 📝 요약

| 항목                      | 상태    | 권장사항       |
| ------------------------- | ------- | -------------- |
| `react-native-reanimated` | 제거됨  | 필요 시 재설치 |
| `react-native-worklets`   | 제거됨  | 필요 시 재설치 |
| `react-native Animated`   | 사용 중 | 현재 상태 유지 |

**현재 프로젝트는 React Native의 기본 Animated API만 사용하며, 추가 애니메이션 라이브러리는 설치되어 있지 않습니다.**
