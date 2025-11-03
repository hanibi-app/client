# 🎯 캐릭터 원래 사이즈(3D 모델 크기) 수정 가이드

## 📍 수정 위치

**파일:** `src/components/common/HanibiCharacter3D.tsx`

---

## 🔧 방법 1: 바디 크기 수정 (가장 직접적)

**줄 번호:** **196번째 줄**

```typescript
// 현재 설정
const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);
//                                 ↑
//                          반지름 1 (기본 크기)

// 더 크게 하려면
const bodyGeometry = new THREE.SphereGeometry(1.5, 32, 32);  // 1.5배
const bodyGeometry = new THREE.SphereGeometry(2, 32, 32);     // 2배

// 작게 하려면
const bodyGeometry = new THREE.SphereGeometry(0.8, 32, 32);  // 0.8배
const bodyGeometry = new THREE.SphereGeometry(0.5, 32, 32); // 0.5배
```

**참고값:**
- `1.0` = 기본 크기
- `1.5` = 1.5배 크게
- `2.0` = 2배 크게
- `0.5` = 절반 크기

---

## 🔧 방법 2: 카메라 거리 조정 (화면에 보이는 크기)

**줄 번호:** **78번째 줄**

```typescript
// 현재 설정
camera.position.z = 5;
//                  ↑
//           카메라와의 거리

// 더 크게 보이게 (카메라를 가까이)
camera.position.z = 3;  // 더 가까이 = 더 크게 보임
camera.position.z = 2;  // 매우 가까이

// 작게 보이게 (카메라를 멀리)
camera.position.z = 7;  // 더 멀리 = 더 작게 보임
camera.position.z = 10; // 매우 멀리
```

**참고값:**
- `2-3` = 매우 크게 보임
- `5` = 기본 거리 (현재 설정)
- `7-10` = 작게 보임

---

## 🔧 방법 3: 전체 캐릭터 스케일 조정

**줄 번호:** **95번째 줄** (캐릭터 생성 후)

```typescript
// 한니비 캐릭터 만들기 (물방울 모양)
const character = createHanibiCharacter(color);
character.scale.set(1.5, 1.5, 1.5);  // 1.5배 크기
// 또는
character.scale.set(2, 2, 2);  // 2배 크기
scene.add(character);
```

---

## 📊 크기 조정 방법 비교

| 방법 | 줄 번호 | 효과 | 추천도 |
|------|---------|------|--------|
| **바디 크기** | 196 | 모델 자체 크기 변경 | ⭐⭐⭐ 추천 |
| **카메라 거리** | 78 | 화면에 보이는 크기만 변경 | ⭐⭐ |
| **전체 스케일** | 95 | 모든 부분 동일 비율 확대/축소 | ⭐⭐⭐ |

---

## 🎯 실전 예시

### 예시 1: 캐릭터를 1.5배 크게 만들기

**수정 위치:** `src/components/common/HanibiCharacter3D.tsx` **196번째 줄**

```typescript
// 변경 전
const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);

// 변경 후
const bodyGeometry = new THREE.SphereGeometry(1.5, 32, 32);
```

### 예시 2: 캐릭터를 절반 크기로 만들기

**수정 위치:** `src/components/common/HanibiCharacter3D.tsx` **196번째 줄**

```typescript
const bodyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
```

### 예시 3: 카메라를 가까이해서 크게 보이게

**수정 위치:** `src/components/common/HanibiCharacter3D.tsx` **78번째 줄**

```typescript
// 변경 전
camera.position.z = 5;

// 변경 후
camera.position.z = 3;  // 더 크게 보임
```

---

## ⚠️ 주의사항

### 눈, 볼 등의 크기도 조정 필요

바디 크기를 변경하면 **눈, 볼터치 등의 상대적 크기도 조정**해야 자연스럽습니다:

- **196번째 줄**: 바디 크기 (SphereGeometry 첫 번째 값)
- **218번째 줄**: 눈 크기 (0.15)
- **232번째 줄**: 눈 하이라이트 크기 (0.06)
- **256번째 줄**: 볼터치 크기 (0.12)
- **223, 228번째 줄**: 눈 위치 (-0.3, 0.3, 0.8)
- **263, 268번째 줄**: 볼터치 위치 (-0.6, 0, 0.6)

**예시:** 바디를 1.5배로 키우면:
```typescript
// 바디
const bodyGeometry = new THREE.SphereGeometry(1.5, 32, 32);

// 눈도 비례해서
const eyeGeometry = new THREE.SphereGeometry(0.15 * 1.5, 16, 16);  // 0.225

// 볼터치도
const cheekGeometry = new THREE.SphereGeometry(0.12 * 1.5, 16, 16);  // 0.18

// 위치도 조정
leftEye.position.set(-0.3 * 1.5, 0.3 * 1.5, 0.8 * 1.5);  // (-0.45, 0.45, 1.2)
```

---

## ✅ 가장 쉬운 방법 (추천)

**단순히 화면에 보이는 크기만 조정하려면:**

1. **카메라 거리 조정** (78번째 줄) - 가장 간단
   ```typescript
   camera.position.z = 3;  // 가까이 = 크게
   ```

2. **전체 스케일 조정** (95번째 줄) - 비율 유지
   ```typescript
   character.scale.set(1.5, 1.5, 1.5);
   ```

---

## 📝 요약: 수정 위치

| 수정 내용 | 파일 | 줄 번호 |
|-----------|------|---------|
| **바디 원래 크기** | `HanibiCharacter3D.tsx` | **196** |
| **카메라 거리** | `HanibiCharacter3D.tsx` | **78** |
| **전체 스케일** | `HanibiCharacter3D.tsx` | **95** |

**가장 권장하는 방법:** **196번째 줄**에서 바디 크기 직접 수정

