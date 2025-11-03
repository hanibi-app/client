# 🔧 캐릭터 크기 수정이 적용되지 않을 때 해결 방법

## 🚨 문제 원인

**GLView는 한 번 생성되면 `onContextCreate`가 다시 호출되지 않습니다.**

Three.js 캐릭터의 크기를 수정해도, GLView가 이미 초기화되어 있으면 변경사항이 반영되지 않습니다.

---

## ✅ 해결 방법

### 방법 1: 앱 완전 재시작 (가장 확실)

1. **앱 완전히 종료**
   - iOS: 앱 스와이프로 완전 종료
   - Android: 최근 앱에서 종료

2. **Expo 개발 서버 재시작**
   ```bash
   # 터미널에서 Ctrl+C로 중지
   # 그 다음 다시 시작
   npm start -- --clear
   ```

3. **시뮬레이터/에뮬레이터 재시작**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android
   ```

---

### 방법 2: Fast Refresh 강제 재시작

**Metro Bundler 캐시 클리어:**
```bash
npm start -- --clear
```

그리고 앱에서:
- **iOS**: 앱을 완전히 종료 후 다시 실행
- **Android**: 앱을 완전히 종료 후 다시 실행

---

### 방법 3: 코드에 key prop 추가 (자동 리마운트)

이미 적용되어 있지만, 추가로 확인:

**파일:** `src/components/common/HanibiCharacter3D.tsx`

```typescript
<GLView
  key={`glview-${glViewKey.current}`}  // key prop으로 강제 리마운트
  style={[...]}
  onContextCreate={onContextCreate}
  msaaSamples={0}
/>
```

**강제 리마운트가 필요하면:**
```typescript
// 컴포넌트에 state 추가
const [remountKey, setRemountKey] = useState(0);

// 필요시 리마운트
useEffect(() => {
  setRemountKey(prev => prev + 1);
}, [/* 의존성 */]);

// GLView에 적용
<GLView key={remountKey} ... />
```

---

### 방법 4: 수동 리로드

1. **개발 메뉴 열기**
   - iOS: `Cmd + D` 또는 흔들기
   - Android: `Cmd + M` 또는 흔들기

2. **"Reload" 선택**
   - 또는 `Cmd + R` (iOS)
   - 또는 `R R` (Android)

---

### 방법 5: 파일 저장 확인

1. 파일이 실제로 저장되었는지 확인
   - `Cmd + S` (Mac) / `Ctrl + S` (Windows)

2. 에디터의 자동 저장 확인
   - 일부 에디터는 자동 저장이 꺼져있을 수 있음

3. 파일 내용 확인
   ```typescript
   // 196번째 줄이 실제로 변경되었는지 확인
   const bodyGeometry = new THREE.SphereGeometry(2, 32, 32);
   //                                 ↑ 이 값이 변경되었는지
   ```

---

## 🔍 확인 방법

### 1. 콘솔 로그 확인

앱 실행 시 다음 로그들이 나오는지 확인:

```
GLView 컨텍스트 생성 시작, size: XXX
GLView 크기: XXX, XXX
Renderer 생성 완료
캐릭터 생성 완료, 색상: #90EE90
초기 렌더링 완료
애니메이션 시작, animated: true
```

**만약 이 로그들이 다시 나온다면:**
- GLView가 새로 생성된 것입니다 ✅
- 변경사항이 적용되었을 가능성이 높습니다

**만약 로그가 나오지 않는다면:**
- GLView가 재생성되지 않았습니다 ❌
- 앱을 완전히 재시작해야 합니다

---

### 2. 값 변경 확인

**196번째 줄 값:**
```typescript
// 변경 전
const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);

// 변경 후 (예: 2배)
const bodyGeometry = new THREE.SphereGeometry(2, 32, 32);
```

값이 실제로 변경되었는지 확인하세요.

---

### 3. 다른 크기 값도 확인

바디 크기를 변경했다면, 눈과 볼터치의 상대적 위치도 조정해야 합니다:

```typescript
// 196번째 줄: 바디 크기
const bodyGeometry = new THREE.SphereGeometry(2, 32, 32);  // 2배

// 218번째 줄: 눈 크기도 비례해서 조정
const eyeGeometry = new THREE.SphereGeometry(0.3, 16, 16);  // 0.15 * 2

// 223, 228번째 줄: 눈 위치도 조정
leftEye.position.set(-0.6, 0.6, 1.6);  // (-0.3, 0.3, 0.8) * 2
rightEye.position.set(0.6, 0.6, 1.6);   // (0.3, 0.3, 0.8) * 2

// 256번째 줄: 볼터치 크기도 조정
const cheekGeometry = new THREE.SphereGeometry(0.24, 16, 16);  // 0.12 * 2

// 263, 268번째 줄: 볼터치 위치도 조정
leftCheek.position.set(-1.2, 0, 1.2);   // (-0.6, 0, 0.6) * 2
rightCheek.position.set(1.2, 0, 1.2);   // (0.6, 0, 0.6) * 2
```

---

## 🎯 가장 확실한 해결 순서

1. **파일 저장 확인** (`Cmd + S`)
2. **앱 완전 종료** (스와이프로 종료)
3. **터미널에서 재시작**
   ```bash
   npm start -- --clear
   ```
4. **앱 다시 실행**
5. **변경사항 확인**

---

## 💡 예방 방법

변경사항이 즉시 반영되도록 하려면:

```typescript
// 컴포넌트에 key를 추가하여 강제 리마운트
const [forceRemount, setForceRemount] = useState(0);

useEffect(() => {
  // 크기 관련 값이 변경되면 리마운트
  setForceRemount(prev => prev + 1);
}, [/* 크기 관련 의존성 */]);
```

---

## 📝 체크리스트

- [ ] 파일이 실제로 저장되었는가?
- [ ] 196번째 줄의 값이 변경되었는가?
- [ ] 앱을 완전히 종료했는가?
- [ ] Expo 서버를 `--clear` 옵션으로 재시작했는가?
- [ ] 콘솔에 "GLView 컨텍스트 생성 시작" 로그가 다시 나오는가?
- [ ] 다른 파일을 수정해서 Fast Refresh가 작동하는지 확인했는가?

