# 🎯 캐릭터 위치 & 크기 빠른 조정 가이드

## 📁 파일 위치
**`src/screens/LoginScreen.tsx`**

---

## 🔧 1단계: 크기 조정 (48-49번째 줄)

```typescript
const CHARACTER_SIZE = Math.floor(Math.min(SCREEN_WIDTH * 0.9, SCREEN_HEIGHT * 0.7));
```

### 빠른 조정법

**더 크게:**
```typescript
const CHARACTER_SIZE = Math.floor(Math.min(SCREEN_WIDTH * 0.95, SCREEN_HEIGHT * 0.75));
// 또는
const CHARACTER_SIZE = 450; // 고정 크기
```

**작게:**
```typescript
const CHARACTER_SIZE = Math.floor(Math.min(SCREEN_WIDTH * 0.7, SCREEN_HEIGHT * 0.5));
// 또는
const CHARACTER_SIZE = 300; // 고정 크기
```

---

## 📍 2단계: 위치 조정 (57-65번째 줄)

```typescript
characterContainer: {
  position: 'absolute',
  top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2,      // 세로 위치
  left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2,    // 가로 위치
  width: CHARACTER_SIZE,
  height: CHARACTER_SIZE,
  // ...
}
```

### 위치 값 변경법

#### 세로 위치 (top 값)

**현재: 화면 중앙**
```typescript
top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2,
```

**위로 이동** (숫자를 줄이기):
```typescript
top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2 - 50,  // 50px 위로
top: 100,  // 위에서 100px
```

**아래로 이동** (숫자를 늘리기):
```typescript
top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2 + 50,  // 50px 아래로
top: SCREEN_HEIGHT - CHARACTER_SIZE - 150,  // 하단에서 150px 위
```

#### 가로 위치 (left 값)

**현재: 화면 중앙**
```typescript
left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2,
```

**왼쪽으로 이동**:
```typescript
left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2 - 20,  // 20px 왼쪽
left: 0,  // 완전 왼쪽
```

**오른쪽으로 이동**:
```typescript
left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2 + 20,  // 20px 오른쪽
left: SCREEN_WIDTH - CHARACTER_SIZE,  // 완전 오른쪽
```

---

## 🎯 실전 예시

### 예시 1: 화면 중앙에 최대 크기
```typescript
// 48번째 줄
const CHARACTER_SIZE = Math.floor(Math.min(SCREEN_WIDTH * 0.95, SCREEN_HEIGHT * 0.75));

// 57-65번째 줄
characterContainer: {
  position: 'absolute',
  top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2,    // 중앙
  left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2,   // 중앙
  width: CHARACTER_SIZE,
  height: CHARACTER_SIZE,
  // ...
}
```

### 예시 2: 위쪽에 크게 배치
```typescript
// 크기
const CHARACTER_SIZE = Math.floor(SCREEN_WIDTH * 0.9);

// 위치
characterContainer: {
  top: 120,  // 위에서 120px
  left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2,  // 가로 중앙
  // ...
}
```

### 예시 3: 하단 중앙에 크게
```typescript
const CHARACTER_SIZE = Math.floor(SCREEN_WIDTH * 0.85);

characterContainer: {
  top: SCREEN_HEIGHT - CHARACTER_SIZE - 120,  // 하단에서 120px 위
  left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2,  // 가로 중앙
  // ...
}
```

---

## ✅ 현재 설정 확인

**현재 코드:**
- 크기: 화면 너비의 90% 또는 높이의 70% 중 작은 값
- 위치: 화면 정중앙 (top: 중앙, left: 중앙)

**수정 방법:**
1. 파일 열기: `src/screens/LoginScreen.tsx`
2. 48번째 줄에서 크기 변경
3. 62번째 줄에서 `top` 값 변경
4. 61번째 줄에서 `left` 값 변경
5. 저장 → 자동 반영

---

**문제 해결:**
- 캐릭터가 안 보이면 → 크기 값 확인
- 위치가 안 맞으면 → top, left 값 확인
- 너무 작으면 → CHARACTER_SIZE 값 증가

