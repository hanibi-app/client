# 한니비 앱 디자인 시스템 가이드

## 개요

한니비 앱의 디자인 시스템은 일관되고 아름다운 사용자 인터페이스를 구축하기 위한 체계적인 가이드라인입니다. 이 시스템은 컬러, 타이포그래피, 스페이싱, 그림자 등의 디자인 토큰을 정의하고, 개발자들이 쉽게 사용할 수 있도록 구성되어 있습니다.

## 🎨 컬러 시스템

### 기본 컬러 팔레트

```typescript
import { ColorPalette, Colors } from '../constants/DesignSystem';

// 브랜드 컬러
const primaryColor = ColorPalette.primary.lightGreen;    // #90C695
const secondaryColor = ColorPalette.primary.lightBlue;   // #A8D8EA
const accentColor = ColorPalette.primary.mint;           // #7BC8A4

// 중성 컬러
const backgroundColor = ColorPalette.neutral.cream;       // #FFF8F0
const textColor = ColorPalette.neutral.darkGray;         // #2D3436
```

### 라이트/다크 모드

```typescript
import { Colors } from '../constants/DesignSystem';

// 라이트 모드
const lightBackground = Colors.light.background;
const lightText = Colors.light.text;

// 다크 모드
const darkBackground = Colors.dark.background;
const darkText = Colors.dark.text;
```

### 컬러 유틸리티

```typescript
import { ColorUtils } from '../constants/DesignSystem';

// 투명도 조절
const transparentColor = ColorUtils.withOpacity('#90C695', 0.5);

// 밝기 조절
const lighterColor = ColorUtils.lighten('#90C695', 20);
const darkerColor = ColorUtils.darken('#90C695', 20);
```

## 📝 타이포그래피 시스템

### 폰트 스타일

```typescript
import { Typography, FontSize, FontWeight } from '../constants/DesignSystem';

// 헤딩 스타일
const titleStyle = Typography.h1;        // 32px, Bold
const sectionTitleStyle = Typography.h2; // 24px, Semibold
const cardTitleStyle = Typography.h3;    // 20px, Medium

// 본문 스타일
const importantTextStyle = Typography.bodyLarge;  // 18px, Medium
const regularTextStyle = Typography.bodyRegular;  // 16px, Regular
const smallTextStyle = Typography.bodySmall;      // 14px, Regular

// 특수 스타일
const buttonTextStyle = Typography.button;        // 16px, Semibold
const labelStyle = Typography.label;              // 14px, Medium
```

### 폰트 크기와 굵기

```typescript
import { FontSize, FontWeight } from '../constants/DesignSystem';

// 폰트 크기
const largeText = FontSize.bodyLarge;    // 18
const regularText = FontSize.bodyRegular; // 16
const smallText = FontSize.bodySmall;     // 14

// 폰트 굵기
const thinText = FontWeight.thin;        // 100
const regularText = FontWeight.regular;  // 400
const boldText = FontWeight.bold;        // 700
```

## 📏 스페이싱 시스템

### 기본 스페이싱

```typescript
import { Spacing, ComponentSpacing } from '../constants/DesignSystem';

// 기본 간격
const smallGap = Spacing.sm;    // 8px
const mediumGap = Spacing.md;   // 12px
const largeGap = Spacing.lg;    // 16px
const extraLargeGap = Spacing.xl; // 24px

// 컴포넌트별 스페이싱
const cardPadding = ComponentSpacing.card.padding;      // 16px
const buttonPadding = ComponentSpacing.button.padding;  // 24px horizontal, 12px vertical
```

### 레이아웃 스페이싱

```typescript
import { LayoutSpacing } from '../constants/DesignSystem';

// 화면 여백
const screenPadding = LayoutSpacing.screen.padding; // 16px

// 그리드 간격
const gridGap = LayoutSpacing.grid.gap; // 16px
```

## 🌟 그림자 시스템

### 기본 그림자

```typescript
import { Shadows, ComponentShadows } from '../constants/DesignSystem';

// 그림자 레벨
const smallShadow = Shadows.sm;    // 작은 그림자
const mediumShadow = Shadows.md;   // 중간 그림자
const largeShadow = Shadows.lg;    // 큰 그림자

// 컴포넌트별 그림자
const cardShadow = ComponentShadows.card.default;     // 카드 기본 그림자
const buttonShadow = ComponentShadows.button.default; // 버튼 기본 그림자
```

### 특수 그림자 효과

```typescript
import { SpecialShadows } from '../constants/DesignSystem';

// 글래스모피즘 효과
const glassmorphismStyle = SpecialShadows.glassmorphism;

// 네온 효과
const neonStyle = SpecialShadows.neon;

// 컬러 그림자
const primaryColoredShadow = SpecialShadows.colored.primary;
```

## 🧩 컴포넌트 사용법

### Button 컴포넌트

```typescript
import { Button } from '../components/ui/Button';

// 기본 사용법
<Button 
  title="버튼" 
  onPress={() => console.log('버튼 클릭')} 
/>

// 변형과 크기
<Button 
  title="보조 버튼" 
  variant="secondary" 
  size="large" 
  onPress={() => {}} 
/>

// 전체 너비와 로딩 상태
<Button 
  title="전체 너비 버튼" 
  fullWidth 
  loading 
  onPress={() => {}} 
/>
```

### 스타일 커스터마이징

```typescript
import { Button } from '../components/ui/Button';

<Button 
  title="커스텀 스타일" 
  onPress={() => {}} 
  style={{
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
  }}
  textStyle={{
    color: '#FFFFFF',
    fontSize: 18,
  }}
/>
```

## 🎯 모범 사례

### 1. 일관성 유지

```typescript
// ✅ 좋은 예: 디자인 시스템 사용
import { Colors, Typography, Spacing } from '../constants/DesignSystem';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    padding: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
});

// ❌ 나쁜 예: 하드코딩된 값
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8F0',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 12,
  },
});
```

### 2. 반응형 디자인

```typescript
import { DesignSystemUtils } from '../constants/DesignSystem';

const responsivePadding = DesignSystemUtils.responsive({
  mobile: Spacing.md,
  tablet: Spacing.lg,
  desktop: Spacing.xl,
}, 'mobile');
```

### 3. 접근성 고려

```typescript
import { DesignSystem } from '../constants/DesignSystem';

// 최소 터치 영역 보장
const buttonStyle = {
  minHeight: DesignSystem.accessibility.minTouchTarget,
  minWidth: DesignSystem.accessibility.minTouchTarget,
};

// 최소 텍스트 크기 보장
const textStyle = {
  fontSize: Math.max(16, FontSize.bodySmall),
};
```

## 🔧 유틸리티 함수

### 스타일 병합

```typescript
import { DesignSystemUtils } from '../constants/DesignSystem';

const mergedStyle = DesignSystemUtils.mergeStyles(
  baseStyle,
  conditionalStyle,
  overrideStyle
);
```

### 조건부 스타일

```typescript
import { DesignSystemUtils } from '../constants/DesignSystem';

const buttonStyle = DesignSystemUtils.conditionalStyle(
  isPressed,
  pressedStyle,
  defaultStyle
);
```

## 📱 플랫폼별 고려사항

### iOS vs Android

```typescript
import { Platform } from 'react-native';
import { Shadows } from '../constants/DesignSystem';

// 플랫폼별 그림자 자동 적용
const cardStyle = {
  ...Shadows.md, // iOS: shadowColor, shadowOffset 등, Android: elevation
};
```

### 폰트 패밀리

```typescript
import { FontFamily } from '../constants/DesignSystem';

// 플랫폼별 폰트 자동 선택
const textStyle = {
  fontFamily: FontFamily.regular, // iOS: System, Android: Roboto
};
```

## 🚀 확장 방법

### 새로운 컬러 추가

```typescript
// constants/Colors.ts
export const ColorPalette = {
  // ... 기존 컬러
  custom: {
    newColor: '#FF6B6B',
  },
};
```

### 새로운 컴포넌트 스타일 추가

```typescript
// constants/DesignSystem.ts
export const DesignSystem = {
  // ... 기존 설정
  components: {
    // ... 기존 컴포넌트
    newComponent: {
      variants: {
        default: { /* 스타일 */ },
        special: { /* 스타일 */ },
      },
    },
  },
};
```

## 📚 추가 리소스

- [React Native 스타일링 가이드](https://reactnative.dev/docs/style)
- [Material Design 가이드라인](https://material.io/design)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Material Design](https://material.io/design)

## 🤝 기여하기

디자인 시스템을 개선하거나 새로운 기능을 추가하고 싶다면:

1. 이슈를 생성하여 제안사항을 논의
2. 브랜치를 생성하여 개발
3. 풀 리퀘스트를 통해 코드 리뷰 요청
4. 테스트 및 문서화 완료 후 머지

---

**버전**: 1.0.0  
**최종 업데이트**: 2024년 12월  
**담당자**: 한니비 개발팀

