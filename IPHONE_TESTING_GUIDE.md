# 📱 아이폰에서 Expo 앱 테스트하기

## 방법 1: Expo Go 앱 사용 (가장 간단) ⭐

### 1단계: Expo Go 앱 설치

1. 아이폰에서 **App Store** 열기
2. **"Expo Go"** 검색 후 설치

### 2단계: 개발 서버 시작

터미널에서 프로젝트 폴더로 이동 후:

```bash
npm start
```

또는

```bash
npx expo start
```

### 3단계: 아이폰에서 연결

#### 옵션 A: QR 코드 스캔 (같은 Wi-Fi 네트워크)

1. 개발 서버가 시작되면 **QR 코드**가 터미널에 표시됨
2. 아이폰에서 **Expo Go 앱** 열기
3. **"Scan QR Code"** 선택
4. QR 코드 스캔

#### 옵션 B: 터널 모드 (다른 네트워크)

```bash
npx expo start --tunnel
```

- 터널 모드로 시작하면 다른 네트워크에서도 연결 가능
- QR 코드를 스캔하여 연결

#### 옵션 C: 수동 입력

1. 터미널에 표시된 URL 확인 (예: `exp://192.168.0.1:8081`)
2. Expo Go 앱에서 **"Enter URL manually"** 선택
3. URL 입력

### 4단계: 앱 실행

- 연결이 성공하면 앱이 자동으로 로드됨
- 코드를 수정하면 **자동으로 새로고침**됨 (Hot Reload)

---

## 방법 2: Development Build (네이티브 모듈 사용 시)

일부 네이티브 모듈은 Expo Go에서 작동하지 않을 수 있습니다. 이 경우 Development Build을 사용해야 합니다.

### 1단계: EAS CLI 설치

```bash
npm install -g eas-cli
```

### 2단계: EAS 계정 로그인

```bash
eas login
```

### 3단계: Development Build 생성

```bash
eas build --profile development --platform ios
```

### 4단계: 빌드 완료 후

- 빌드가 완료되면 다운로드 링크가 제공됨
- 아이폰에서 링크를 열어 앱 설치
- 또는 TestFlight을 통해 배포 가능

---

## 🔧 문제 해결

### 같은 Wi-Fi에 연결되어 있는지 확인

- 맥북과 아이폰이 **같은 Wi-Fi 네트워크**에 연결되어 있어야 함

### 방화벽 확인

- 맥북의 방화벽이 포트를 차단하지 않는지 확인

### 터널 모드 사용

- 같은 네트워크가 아니거나 연결이 안 될 때:

```bash
npx expo start --tunnel
```

### 포트 확인

- 기본 포트는 `8081`
- 다른 앱이 사용 중이면 자동으로 다른 포트 사용

### 캐시 클리어

```bash
npx expo start --clear
```

---

## 💡 팁

1. **Hot Reload**: 코드를 저장하면 자동으로 앱이 새로고침됨
2. **Shake Gesture**: 아이폰을 흔들면 개발자 메뉴가 열림
3. **개발자 메뉴**:
   - Reload: 앱 새로고침
   - Debug Remote JS: 디버깅 모드
   - Show Performance Monitor: 성능 모니터

---

## 📝 빠른 참조

```bash
# 개발 서버 시작 (일반)
npm start

# 개발 서버 시작 (터널 모드)
npx expo start --tunnel

# 개발 서버 시작 (캐시 클리어)
npx expo start --clear

# iOS 시뮬레이터에서 실행
npm run ios
```
