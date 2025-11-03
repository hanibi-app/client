# 🎯 캐릭터 크기 & 위치 조정 가이드

## 📍 파일 위치

**`src/screens/LoginScreen.tsx`** 파일에서 캐릭터 크기와 위치를 조정합니다.

---

## 🔧 1. 캐릭터 크기 조정

### 현재 설정 (48번째 줄)

```typescript
const CHARACTER_SIZE = Math.min(SCREEN_WIDTH * 0.95, SCREEN_HEIGHT * 0.6, 500);
```

### 조정 방법

#### 방법 1: 화면 비율로 조정 (추천)

```typescript
// 화면 너비의 90%로 설정
const CHARACTER_SIZE = SCREEN_WIDTH * 0.9;

// 화면 너비의 100%로 설정 (가장 크게)
const CHARACTER_SIZE = SCREEN_WIDTH * 1.0;

// 화면 높이의 50%로 설정
const CHARACTER_SIZE = SCREEN_HEIGHT * 0.5;
```

#### 방법 2: 고정 픽셀 값으로 설정

```typescript
// 고정 크기 (예: 350px)
const CHARACTER_SIZE = 350;

// 또는 더 크게
const CHARACTER_SIZE = 450;
```

#### 방법 3: 최대값 제한과 함께

```typescript
// 화면 너비의 95% 또는 최대 500px 중 작은 값
const CHARACTER_SIZE = Math.min(SCREEN_WIDTH * 0.95, 500);

// 화면 높이의 60% 또는 최대 400px
const CHARACTER_SIZE = Math.min(SCREEN_HEIGHT * 0.6, 400);
```

### 📐 크기 참고값

| 비율/값 | 설명 | 예시 (iPhone 기준) |
|---------|------|-------------------|
| `SCREEN_WIDTH * 0.7` | 작게 | ~280px |
| `SCREEN_WIDTH * 0.8` | 보통 | ~320px |
| `SCREEN_WIDTH * 0.9` | 크게 | ~360px |
| `SCREEN_WIDTH * 0.95` | 매우 크게 | ~380px |
| `SCREEN_HEIGHT * 0.5` | 높이의 절반 | ~400px |
| `SCREEN_HEIGHT * 0.6` | 높이의 60% | ~480px |

---

## 📍 2. 캐릭터 위치 조정

### 현재 설정 (57-64번째 줄)

```typescript
characterContainer: {
  alignItems: 'center',
  height: CHARACTER_SIZE,
  justifyContent: 'center',
  left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2,    // 가로 중앙
  position: 'absolute',                          // 절대 위치
  top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2,     // 세로 중앙
  width: CHARACTER_SIZE,
},
```

### 위치 조정 옵션

#### A. 세로 위치 조정 (상하 이동)

**현재: 화면 중앙**
```typescript
top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2,
```

**조정 예시:**

```typescript
// 위로 이동 (화면 상단에서 100px 아래)
top: 100,

// 중앙보다 위로
top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2 - 50,  // 50px 위로

// 중앙보다 아래로
top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2 + 50,  // 50px 아래로

// 화면 하단에 가깝게
top: SCREEN_HEIGHT - CHARACTER_SIZE - 150,  // 하단에서 150px 위
```

#### B. 가로 위치 조정 (좌우 이동)

**현재: 화면 중앙**
```typescript
left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2,
```

**조정 예시:**

```typescript
// 왼쪽 정렬
left: 0,

// 오른쪽 정렬
left: SCREEN_WIDTH - CHARACTER_SIZE,

// 중앙에서 왼쪽으로
left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2 - 20,  // 20px 왼쪽

// 중앙에서 오른쪽으로
left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2 + 20,  // 20px 오른쪽
```

#### C. Flexbox 방식으로 변경

절대 위치 대신 Flexbox를 사용할 수도 있습니다:

```typescript
characterContainer: {
  alignItems: 'center',
  flex: 1,
  justifyContent: 'center',  // 세로 중앙
  width: CHARACTER_SIZE,
  height: CHARACTER_SIZE,
  // position: 'absolute' 제거
  // top, left 제거
},
```

---

## 🎨 3. 실제 조정 예시

### 예시 1: 화면 상단에 크게 배치

```typescript
const CHARACTER_SIZE = SCREEN_WIDTH * 0.85;  // 크기

characterContainer: {
  alignItems: 'center',
  height: CHARACTER_SIZE,
  justifyContent: 'center',
  left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2,
  position: 'absolute',
  top: 120,  // 상단에서 120px 아래
  width: CHARACTER_SIZE,
},
```

### 예시 2: 화면 하단에 크게 배치

```typescript
const CHARACTER_SIZE = SCREEN_WIDTH * 0.9;

characterContainer: {
  alignItems: 'center',
  height: CHARACTER_SIZE,
  justifyContent: 'center',
  left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2,
  position: 'absolute',
  top: SCREEN_HEIGHT - CHARACTER_SIZE - 100,  // 하단에서 100px 위
  width: CHARACTER_SIZE,
},
```

### 예시 3: 중앙 정렬 + 약간 위로

```typescript
const CHARACTER_SIZE = SCREEN_HEIGHT * 0.5;

characterContainer: {
  alignItems: 'center',
  height: CHARACTER_SIZE,
  justifyContent: 'center',
  left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2,
  position: 'absolute',
  top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2 - 80,  // 중앙에서 80px 위
  width: CHARACTER_SIZE,
},
```

---

## 📝 4. 빠른 참조: 현재 코드 구조

### 핵심 수정 부분

**파일:** `src/screens/LoginScreen.tsx`

```typescript
// 1️⃣ 크기 정의 (46-48줄)
const CHARACTER_SIZE = Math.min(SCREEN_WIDTH * 0.95, SCREEN_HEIGHT * 0.6, 500);

// 2️⃣ 컴포넌트 사용 (29-31줄)
<View style={styles.characterContainer}>
  <HanibiCharacter3D level="medium" animated={true} size={CHARACTER_SIZE} />
</View>

// 3️⃣ 위치 스타일 (57-64줄)
characterContainer: {
  position: 'absolute',
  top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2,     // 세로 위치
  left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2,    // 가로 위치
  width: CHARACTER_SIZE,                        // 너비
  height: CHARACTER_SIZE,                        // 높이
  // ...
},
```

---

## 🔍 5. 단계별 조정 방법

### Step 1: 크기 먼저 정하기

```typescript
// 원하는 크기로 변경
const CHARACTER_SIZE = 400;  // 예: 400px로 고정
```

### Step 2: 위치 조정하기

```typescript
characterContainer: {
  // ... 기존 스타일 ...
  
  // 세로 위치
  top: 200,  // 위에서 200px
  
  // 가로 위치  
  left: 50,  // 왼쪽에서 50px
},
```

### Step 3: 실시간 확인

1. 파일 저장 (`Cmd + S` 또는 `Ctrl + S`)
2. Expo가 자동으로 리로드
3. 앱에서 변경 사항 확인
4. 필요시 다시 조정

---

## 💡 6. 유용한 팁

### Tip 1: 중앙 정렬 공식

```typescript
// 가로 중앙
left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2

// 세로 중앙
top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2
```

### Tip 2: 반응형 크기

```typescript
// 작은 화면에서도 적절한 크기 유지
const CHARACTER_SIZE = Math.min(
  SCREEN_WIDTH * 0.9,    // 너비의 90%
  SCREEN_HEIGHT * 0.6,   // 높이의 60%
  450                    // 최대 450px
);
```

### Tip 3: Safe Area 고려

상태 표시줄이나 노치를 고려하려면:

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2 - insets.top,  // 상단 여백 고려
```

### Tip 4: 디바이스별 조정

```typescript
// iPhone SE처럼 작은 화면
if (SCREEN_HEIGHT < 700) {
  CHARACTER_SIZE = SCREEN_WIDTH * 0.8;
}
// iPad처럼 큰 화면
else if (SCREEN_WIDTH > 800) {
  CHARACTER_SIZE = 500;
}
```

---

## 🎯 7. 일반적인 조정 시나리오

### 시나리오 A: "캐릭터를 더 크게"

```typescript
// 크기 증가
const CHARACTER_SIZE = Math.min(SCREEN_WIDTH * 0.98, SCREEN_HEIGHT * 0.7, 600);
```

### 시나리오 B: "캐릭터를 위로 올리기"

```typescript
// top 값을 줄이기
top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2 - 100,  // 100px 위로
```

### 시나리오 C: "캐릭터를 아래로 내리기"

```typescript
// top 값을 늘리기
top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2 + 100,  // 100px 아래로
```

### 시나리오 D: "캐릭터를 작게, 위쪽에 배치"

```typescript
const CHARACTER_SIZE = SCREEN_WIDTH * 0.6;  // 작게

characterContainer: {
  // ...
  top: 150,  // 위쪽
  left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2,  // 중앙
  // ...
},
```

---

## 📐 8. 좌표 시스템 이해

### React Native 좌표 시스템

```
(0, 0) ──────────────── (SCREEN_WIDTH, 0)
  │                           │
  │                           │
  │      화면 중앙              │
  │      (width/2,            │
  │       height/2)           │
  │                           │
  │                           │
(0, SCREEN_HEIGHT) ───── (SCREEN_WIDTH, SCREEN_HEIGHT)
```

### position: 'absolute' 기준점

- `top`: 상단에서 얼마나 떨어져 있는지
- `left`: 왼쪽에서 얼마나 떨어져 있는지
- `bottom`: 하단에서 얼마나 떨어져 있는지
- `right`: 오른쪽에서 얼마나 떨어져 있는지

### 중앙 정렬 계산

```typescript
// 가로 중앙
left = (전체 너비 - 요소 너비) / 2
     = (SCREEN_WIDTH - CHARACTER_SIZE) / 2

// 세로 중앙
top = (전체 높이 - 요소 높이) / 2
    = (SCREEN_HEIGHT - CHARACTER_SIZE) / 2
```

---

## ✅ 9. 체크리스트

조정 후 확인할 사항:

- [ ] 캐릭터가 화면 밖으로 나가지 않는가?
- [ ] 제목과 겹치지 않는가?
- [ ] 버튼과 겹치지 않는가?
- [ ] 다양한 디바이스 크기에서도 잘 보이는가?
- [ ] 애니메이션이 정상 작동하는가?

---

## 🚀 빠른 시작 예제

### 완전 커스터마이즈 예제

```typescript
// LoginScreen.tsx

// 1. 크기 설정
const CHARACTER_SIZE = 380;  // 원하는 크기

// 2. 위치 스타일
const styles = StyleSheet.create({
  characterContainer: {
    alignItems: 'center',
    height: CHARACTER_SIZE,
    justifyContent: 'center',
    
    // 위치 조정 (원하는 값으로 변경)
    left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2,           // 가로 중앙
    position: 'absolute',
    top: 200,                                             // 위에서 200px
    width: CHARACTER_SIZE,
  },
});
```

**위치 값만 바꾸면 됩니다:**
- `top: 200` → 위에서 200px
- `top: 300` → 위에서 300px
- `top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2` → 세로 중앙

---

이제 `LoginScreen.tsx` 파일을 열고 위 가이드를 참고해서 원하는 크기와 위치로 조정하세요! 🎨

