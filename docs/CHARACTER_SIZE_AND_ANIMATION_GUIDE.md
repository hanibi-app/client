# 🎨 캐릭터 크기 & 애니메이션 조정 가이드

## 📍 1. 캐릭터 크기 수정 위치

### 🔧 위치 1: LoginScreen에서 크기 조정

**파일:** `src/screens/LoginScreen.tsx`  
**줄 번호:** **18번째 줄**

```typescript
// 현재 설정 (18번째 줄)
const CHARACTER_SIZE = Math.floor(Math.min(SCREEN_WIDTH * 0.9, SCREEN_HEIGHT * 0.7));
```

#### 크기 조정 방법

**더 크게 하기:**
```typescript
// 화면 너비의 95% 또는 높이의 80% 중 작은 값
const CHARACTER_SIZE = Math.floor(Math.min(SCREEN_WIDTH * 0.95, SCREEN_HEIGHT * 0.8));

// 또는 고정 크기 (예: 450px)
const CHARACTER_SIZE = 450;
```

**작게 하기:**
```typescript
// 화면 너비의 70% 또는 높이의 50% 중 작은 값
const CHARACTER_SIZE = Math.floor(Math.min(SCREEN_WIDTH * 0.7, SCREEN_HEIGHT * 0.5));

// 또는 고정 크기 (예: 300px)
const CHARACTER_SIZE = 300;
```

**크기 범위 참고:**
- 작게: `SCREEN_WIDTH * 0.6 ~ 0.7` (약 240~280px)
- 보통: `SCREEN_WIDTH * 0.8 ~ 0.9` (약 320~360px)
- 크게: `SCREEN_WIDTH * 0.95` 또는 고정 `400~500px`

---

### 🔧 위치 2: 컴포넌트 Props에서 크기 전달

**파일:** `src/screens/LoginScreen.tsx`  
**줄 번호:** **47번째 줄**

```typescript
// 현재 설정 (47번째 줄)
<HanibiCharacter3D level="medium" animated={true} size={CHARACTER_SIZE} />
```

여기서 `size={CHARACTER_SIZE}`로 크기를 전달합니다. `CHARACTER_SIZE` 변수 값을 변경하면 자동으로 반영됩니다.

---

### 🔧 위치 3: HanibiCharacter3D 컴포넌트 기본값

**파일:** `src/components/common/HanibiCharacter3D.tsx`  
**줄 번호:** **27번째 줄**

```typescript
// 기본 크기 설정 (27번째 줄)
size = 200,  // 기본값 200px
```

이 값은 `size` prop이 전달되지 않을 때만 사용됩니다. LoginScreen에서 `size={CHARACTER_SIZE}`를 전달하므로 이 값은 무시됩니다.

---

## 🎬 2. 애니메이션 활성화/비활성화

### 애니메이션 On/Off

**파일:** `src/screens/LoginScreen.tsx`  
**줄 번호:** **47번째 줄**

```typescript
// 애니메이션 활성화
<HanibiCharacter3D level="medium" animated={true} size={CHARACTER_SIZE} />

// 애니메이션 비활성화
<HanibiCharacter3D level="medium" animated={false} size={CHARACTER_SIZE} />
```

### 애니메이션 종류

애니메이션은 다음 세 가지가 포함됩니다:

1. **회전 애니메이션**: 좌우로 부드럽게 회전
2. **호흡 효과**: 크기가 미세하게 변화
3. **상하 움직임**: 공중에 떠있는 듯한 효과

**수정 위치:** `src/components/common/HanibiCharacter3D.tsx`의 113-131번째 줄

```typescript
if (animated && character) {
  // 부드러운 회전 (123번째 줄)
  character.rotation.y = Math.sin(frame) * 0.3;  // 회전 범위 조정

  // 호흡 효과 (126번째 줄)
  const breathScale = 1 + Math.sin(frame * 2) * 0.05;  // 크기 변화량 조정

  // 위아래 움직임 (130번째 줄)
  character.position.y = Math.sin(frame * 1.5) * 0.2;  // 이동 범위 조정
}
```

### 애니메이션 속도 조정

**파일:** `src/components/common/HanibiCharacter3D.tsx`  
**줄 번호:** **119번째 줄**

```typescript
// 현재 설정
frame += 0.02; // 애니메이션 속도

// 더 빠르게
frame += 0.03; // 또는 0.04

// 더 느리게
frame += 0.01; // 또는 0.015
```

---

## 🎯 3. 빠른 수정 가이드

### 시나리오 A: "캐릭터를 더 크게"

**수정 파일:** `src/screens/LoginScreen.tsx` (18번째 줄)

```typescript
// 기존
const CHARACTER_SIZE = Math.floor(Math.min(SCREEN_WIDTH * 0.9, SCREEN_HEIGHT * 0.7));

// 수정 후
const CHARACTER_SIZE = Math.floor(Math.min(SCREEN_WIDTH * 0.95, SCREEN_HEIGHT * 0.8));
```

### 시나리오 B: "캐릭터를 작게"

**수정 파일:** `src/screens/LoginScreen.tsx` (18번째 줄)

```typescript
const CHARACTER_SIZE = Math.floor(Math.min(SCREEN_WIDTH * 0.7, SCREEN_HEIGHT * 0.5));
```

### 시나리오 C: "고정 크기로 설정"

**수정 파일:** `src/screens/LoginScreen.tsx` (18번째 줄)

```typescript
const CHARACTER_SIZE = 400; // 고정 400px
```

### 시나리오 D: "애니메이션 비활성화"

**수정 파일:** `src/screens/LoginScreen.tsx` (47번째 줄)

```typescript
<HanibiCharacter3D level="medium" animated={false} size={CHARACTER_SIZE} />
```

### 시나리오 E: "애니메이션 속도 조정"

**수정 파일:** `src/components/common/HanibiCharacter3D.tsx` (119번째 줄)

```typescript
// 빠르게
frame += 0.03;

// 느리게
frame += 0.01;
```

---

## 📝 4. 요약: 수정해야 할 위치

| 항목 | 파일 | 줄 번호 | 설명 |
|------|------|---------|------|
| **크기 조정** | `src/screens/LoginScreen.tsx` | **18** | `CHARACTER_SIZE` 변수 수정 |
| **애니메이션 On/Off** | `src/screens/LoginScreen.tsx` | **47** | `animated={true/false}` 수정 |
| **애니메이션 속도** | `src/components/common/HanibiCharacter3D.tsx` | **119** | `frame +=` 값 수정 |
| **애니메이션 범위** | `src/components/common/HanibiCharacter3D.tsx` | **123, 126, 130** | 회전/크기/이동 값 수정 |

---

## ✅ 체크리스트

애니메이션이 작동하지 않는다면:

- [ ] `animated={true}` prop이 전달되었는지 확인 (LoginScreen.tsx 47번째 줄)
- [ ] 콘솔에 "애니메이션 시작" 로그가 출력되는지 확인
- [ ] `onContextCreate` 함수가 정상적으로 실행되는지 확인
- [ ] `requestAnimationFrame`이 제대로 호출되는지 확인

크기를 조정한 후:

- [ ] 파일 저장
- [ ] Expo가 자동 리로드되는지 확인
- [ ] 앱에서 변경사항 확인
- [ ] 다른 화면 크기에서도 테스트

---

**가장 중요한 수정 위치:**
- **크기 조정**: `src/screens/LoginScreen.tsx` **18번째 줄**
- **애니메이션 활성화**: `src/screens/LoginScreen.tsx` **47번째 줄**

