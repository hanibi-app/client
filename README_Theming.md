# 한니비 앱 테마 시스템 가이드

## 개요

한니비 앱은 체계적인 테마 시스템을 통해 일관된 디자인과 라이트/다크 모드 지원을 제공합니다.

## 테마 구조

### 1. 색상 팔레트 (`src/theme/tokens.ts`)

#### 브랜드 색상
- **Primary**: `#007AFF` - 메인 브랜드 색상
- **Secondary**: `#FF6B35` - 보조 브랜드 색상
- **Accent**: `#34C759` - 강조 색상

#### 중성 색상
- **Gray 0-1000**: 50부터 900까지의 회색 톤
- **Text**: Primary, Secondary, Muted, Disabled
- **Surface**: Background, Card, Border, Shadow

#### 신호 색상
- **Success**: `#34C759` - 성공 상태
- **Warning**: `#FF9500` - 경고 상태
- **Error**: `#FF3B30` - 오류 상태
- **Info**: `#5AC8FA` - 정보 상태

### 2. 세맨틱 토큰

의미론적 색상 토큰을 통해 일관된 UI를 제공합니다:

```typescript
interface SemanticTokens {
  brand: {
    primary: string;
    secondary: string;
    // ...
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    // ...
  };
  surface: {
    background: string;
    card: string;
    border: string;
    // ...
  };
  state: {
    success: string;
    warning: string;
    error: string;
    // ...
  };
}
```

### 3. 테마 변형

#### 라이트 테마 (`src/theme/light.ts`)
- 밝은 배경과 어두운 텍스트
- 높은 대비율로 가독성 최적화

#### 다크 테마 (`src/theme/dark.ts`)
- 어두운 배경과 밝은 텍스트
- 눈의 피로를 줄이는 색상 조합

## 사용법

### 1. 기본 사용법

```typescript
import { useTheme } from '@/theme';

function MyComponent() {
  const { tokens, mode, setMode } = useTheme();
  
  return (
    <View style={{ backgroundColor: tokens.surface.background }}>
      <Text style={{ color: tokens.text.primary }}>
        안녕하세요!
      </Text>
    </View>
  );
}
```

### 2. 상태별 색상 사용

```typescript
import { getStatusColors } from '@/theme/variants';

function StatusIndicator({ status }: { status: 'success' | 'warning' | 'error' }) {
  const { tokens } = useTheme();
  const colors = getStatusColors(status, tokens);
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>
        {status === 'success' ? '정상' : '주의'}
      </Text>
    </View>
  );
}
```

### 3. 동적 스타일 생성

```typescript
function ThemedComponent() {
  const { tokens } = useTheme();
  
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: tokens.surface.background,
      borderColor: tokens.surface.border,
    },
    text: {
      color: tokens.text.primary,
    },
  });
  
  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.text}>테마 적용된 텍스트</Text>
    </View>
  );
}
```

## 색상 토큰 매핑표

### 브랜드 색상
| 토큰 | 라이트 모드 | 다크 모드 | 용도 |
|------|-------------|-----------|------|
| `brand.primary` | `#007AFF` | `#0A84FF` | 메인 버튼, 링크 |
| `brand.secondary` | `#FF6B35` | `#FF8A65` | 보조 버튼, 강조 |
| `brand.accent` | `#34C759` | `#30D158` | 성공, 확인 |

### 텍스트 색상
| 토큰 | 라이트 모드 | 다크 모드 | 용도 |
|------|-------------|-----------|------|
| `text.primary` | `#000000` | `#FFFFFF` | 제목, 주요 텍스트 |
| `text.secondary` | `#666666` | `#CCCCCC` | 부제목, 설명 |
| `text.muted` | `#8E8E93` | `#8E8E93` | 보조 정보 |
| `text.disabled` | `#C7C7CC` | `#48484A` | 비활성 텍스트 |

### 표면 색상
| 토큰 | 라이트 모드 | 다크 모드 | 용도 |
|------|-------------|-----------|------|
| `surface.background` | `#F2F2F7` | `#000000` | 메인 배경 |
| `surface.card` | `#FFFFFF` | `#1C1C1E` | 카드, 모달 |
| `surface.border` | `#E5E5EA` | `#38383A` | 테두리, 구분선 |
| `surface.shadow` | `#000000` | `#000000` | 그림자 |

### 상태 색상
| 토큰 | 라이트 모드 | 다크 모드 | 용도 |
|------|-------------|-----------|------|
| `state.success` | `#34C759` | `#30D158` | 성공, 정상 |
| `state.warning` | `#FF9500` | `#FF9F0A` | 경고, 주의 |
| `state.error` | `#FF3B30` | `#FF453A` | 오류, 위험 |
| `state.info` | `#5AC8FA` | `#64D2FF` | 정보, 알림 |

## 개발 가이드라인

### 1. 색상 사용 원칙

- **원시 색상 리터럴 금지**: `#FF0000`, `rgb(255, 0, 0)` 등 직접 색상 사용 금지
- **세맨틱 토큰 사용**: `tokens.text.primary` 등 의미론적 토큰 사용
- **상태 기반 색상**: `getStatusColors()` 함수로 상태별 색상 조합 사용

### 2. 테마 전환

```typescript
import { useColorMode } from '@/theme/useColorMode';

function ThemeToggle() {
  const { mode, setMode } = useColorMode();
  
  return (
    <Button
      title={mode === 'light' ? '다크 모드' : '라이트 모드'}
      onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
    />
  );
}
```

### 3. 접근성 고려사항

- **대비율**: WCAG AA 기준 (4.5:1) 이상 유지
- **색상 의존성**: 색상만으로 정보 전달하지 않기
- **다크 모드**: 어두운 배경에서도 충분한 대비 확보

## 마이그레이션 가이드

### 1. 기존 색상 리터럴 변환

```typescript
// ❌ 잘못된 방법
const styles = StyleSheet.create({
  text: {
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
});

// ✅ 올바른 방법
function MyComponent() {
  const { tokens } = useTheme();
  
  const dynamicStyles = StyleSheet.create({
    text: {
      color: tokens.text.primary,
      backgroundColor: tokens.surface.background,
    },
  });
  
  return <Text style={dynamicStyles.text}>텍스트</Text>;
}
```

### 2. ESLint 규칙 활용

프로젝트에는 `no-raw-colors` ESLint 규칙이 설정되어 있어 원시 색상 사용을 자동으로 감지합니다.

### 3. 코드모드 스크립트

자동 변환을 위한 코드모드 스크립트가 제공됩니다:

```bash
npx ts-node scripts/codemods/replace-raw-colors.ts
```

## 성능 최적화

### 1. 스타일 메모이제이션

```typescript
import { useMemo } from 'react';

function OptimizedComponent() {
  const { tokens } = useTheme();
  
  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: tokens.surface.background,
    },
  }), [tokens.surface.background]);
  
  return <View style={styles.container} />;
}
```

### 2. 테마 변경 최적화

테마 변경 시 불필요한 리렌더링을 방지하기 위해 `React.memo`를 활용합니다.

## 문제 해결

### 1. 색상이 적용되지 않는 경우

- `ThemeProvider`로 앱이 감싸져 있는지 확인
- `useTheme` 훅이 올바르게 사용되었는지 확인
- 토큰 경로가 정확한지 확인

### 2. 다크 모드에서 색상이 보이지 않는 경우

- 다크 모드 색상 매핑이 올바른지 확인
- 대비율이 충분한지 확인
- `useColorMode` 훅이 올바르게 작동하는지 확인

### 3. 성능 이슈

- 동적 스타일 생성 최소화
- `useMemo`를 활용한 스타일 메모이제이션
- 불필요한 테마 변경 방지

## 참고 자료

- [React Native 스타일링 가이드](https://reactnative.dev/docs/style)
- [WCAG 접근성 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design 색상 시스템](https://material.io/design/color/)
