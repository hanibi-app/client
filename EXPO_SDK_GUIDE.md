# 📱 Expo SDK 완전 가이드

## 🎯 Expo SDK란?

**Expo SDK**는 React Native 개발을 단순화하는 도구 모음입니다. 네이티브 코드 작성 없이도 카메라, 위치, 푸시 알림 등 네이티브 기능을 사용할 수 있게 해줍니다.

### 핵심 개념

1. **SDK 버전**: Expo의 모든 패키지가 함께 버전이 관리됨
2. **호환성**: 같은 SDK 버전 내의 패키지들은 서로 호환됨
3. **자동 관리**: Expo CLI가 네이티브 코드를 자동으로 생성/관리

---

## 📦 현재 프로젝트의 Expo SDK 설정

### 현재 사용 중인 버전

```json
{
  "expo": "54.0.23",           // 메인 SDK 패키지
  "expo-font": "~14.0.9",      // 커스텀 폰트
  "expo-splash-screen": "~31.0.10", // 스플래시 스크린
  "expo-status-bar": "~3.0.8", // 상태바 제어
  "expo-web-browser": "~15.0.9" // 웹 브라우저 열기
}

> 참고: `expo-constants`, `expo-linking`은 현재 코드에서 사용되지 않아 dependencies에서 제거되었습니다. 환경 상수나 딥링크 기능이 필요하면 `npx expo install expo-constants` 등으로 다시 추가하세요.
```

### 버전 표기법 이해하기

- `~54.0.12`: **틸드(~)** - 마이너 버전 업데이트 허용 (54.0.x)
- `^54.0.12`: **캐럿(^)** - 패치 버전 업데이트 허용 (54.x.x)
- `54.0.12`: **정확한 버전** - 해당 버전만 사용

**Expo에서는 `~` 사용을 권장합니다!**

---

## 🔧 Expo SDK 버전 관리 방법

### 1. 현재 SDK 버전 확인

```bash
# package.json에서 확인
cat package.json | grep '"expo"'

# 또는 Expo CLI로 확인
npx expo --version
npx expo-doctor
```

### 2. SDK 업그레이드 방법

#### ⚠️ 중요: SDK 업그레이드는 신중하게!

```bash
# 1. 현재 버전 확인
npx expo install --check

# 2. 업그레이드 가능한 패키지 확인
npx expo upgrade

# 3. SDK 업그레이드 (예: 54 → 55)
npx expo upgrade 55

# 4. 모든 expo 패키지 버전 통일
npx expo install --fix
```

### 3. 패키지 추가 시 주의사항

#### ✅ 올바른 방법 (권장)

```bash
# Expo CLI를 사용하면 자동으로 호환 버전 설치
npx expo install expo-camera
npx expo install expo-location
```

#### ❌ 잘못된 방법

```bash
# npm install을 직접 사용하면 버전 불일치 발생 가능
npm install expo-camera  # ❌ SDK 버전과 맞지 않을 수 있음
```

---

## 📋 현재 프로젝트에서 사용 중인 Expo 모듈

### 1. expo-font (폰트 관리)

**사용 위치**: `App.tsx`

```typescript
import { useFonts } from 'expo-font';

const [loaded, error] = useFonts({
  SpaceMono: require('./src/assets/fonts/SpaceMono-Regular.ttf'),
  ...FontAwesome.font,
});
```

**역할**:

- 커스텀 폰트 로드
- 폰트 로딩 상태 관리
- 에러 처리

### 2. expo-splash-screen (스플래시 스크린)

**사용 위치**: `App.tsx`

```typescript
import * as SplashScreen from 'expo-splash-screen';

// 앱 시작 시 스플래시 화면 유지
SplashScreen.preventAutoHideAsync();

// 폰트 로드 완료 후 숨기기
SplashScreen.hideAsync();
```

**역할**:

- 앱 시작 시 로딩 화면 표시
- 리소스 로딩 완료까지 화면 유지

### 3. (Optional) expo-constants (앱 상수 정보)

> 현재 프로젝트 dependencies에는 포함되어 있지 않습니다. 환경 상수나 디바이스 정보를 다뤄야 할 때만 `npx expo install expo-constants`로 추가하세요.

**사용 예시**:

```typescript
import Constants from 'expo-constants';

// 앱 버전 정보
const appVersion = Constants.expoConfig?.version;

// 디바이스 정보
const deviceName = Constants.deviceName;
const platform = Constants.platform;

// 빌드 정보
const buildNumber = Constants.expoConfig?.ios?.buildNumber;
```

**역할**:

- 앱 설정 정보 접근
- 디바이스 정보 확인
- 빌드 정보 확인

### 4. (Optional) expo-linking (딥링크 처리)

> 현재 프로젝트 dependencies에는 포함되어 있지 않습니다. 딥링크/URL 연동이 필요한 시점에만 `npx expo install expo-linking`으로 추가하세요.

**사용 예시**:

```typescript
import * as Linking from 'expo-linking';

// URL 열기
Linking.openURL('https://example.com');

// 딥링크 처리
Linking.addEventListener('url', (event) => {
  console.log('Received URL:', event.url);
});
```

**역할**:

- 외부 URL 열기
- 딥링크 처리
- 앱 간 연동

### 5. expo-web-browser (웹 브라우저)

**사용 예시**:

```typescript
import * as WebBrowser from 'expo-web-browser';

// 인앱 브라우저로 열기
await WebBrowser.openBrowserAsync('https://example.com');
```

**역할**:

- 인앱 브라우저 열기
- OAuth 인증 등에 사용

---

## 🏗️ app.json 설정 이해하기

### 현재 설정 분석

```json
{
  "expo": {
    "name": "client", // 앱 이름
    "slug": "client", // Expo 서비스에서 사용할 식별자
    "version": "1.0.0", // 앱 버전
    "orientation": "portrait", // 화면 방향 (세로 고정)
    "icon": "./src/assets/images/icon.png", // 앱 아이콘
    "scheme": "client", // 딥링크 스킴
    "userInterfaceStyle": "automatic", // 다크모드 자동 전환
    "newArchEnabled": true, // React Native New Architecture 활성화

    "ios": {
      "supportsTablet": true, // iPad 지원
      "bundleIdentifier": "com.anonymous.client" // iOS 번들 ID
    },

    "android": {
      "edgeToEdgeEnabled": true, // Edge-to-edge 디스플레이
      "package": "com.anonymous.client" // Android 패키지명
    },

    "web": {
      "bundler": "metro", // Metro 번들러 사용
      "output": "single" // 단일 HTML 파일 출력
    }
  }
}
```

### 주요 설정 설명

#### 1. `newArchEnabled: true`

- React Native의 New Architecture 활성화
- 성능 향상 및 향후 기능 지원
- **주의**: 일부 라이브러리가 아직 미지원 가능

#### 2. `userInterfaceStyle: "automatic"`

- 시스템 다크모드 설정 자동 따름
- `"light"` 또는 `"dark"`로 고정 가능

#### 3. `scheme: "client"`

- 딥링크 URL 스킴: `client://...`
- 다른 앱에서 이 앱 열기 가능

---

## 🚀 개발 워크플로우

### 1. 개발 모드 실행

```bash
# Expo 개발 서버 시작
npm start
# 또는
npx expo start

# 옵션:
npx expo start --clear        # 캐시 클리어
npx expo start --tunnel        # 터널 모드 (외부 접근)
npx expo start --localhost     # 로컬호스트만
```

### 2. 플랫폼별 실행

```bash
# iOS 시뮬레이터
npm run ios
# 또는
npx expo run:ios

# Android 에뮬레이터
npm run android
# 또는
npx expo run:android

# 웹 브라우저
npm run web
# 또는
npx expo start --web
```

### 3. 빌드 (프로덕션)

```bash
# iOS 빌드
npx eas build --platform ios

# Android 빌드
npx eas build --platform android

# 둘 다
npx eas build --platform all
```

---

## 📦 Expo 모듈 추가하기

### 예시: 카메라 기능 추가

```bash
# 1. 패키지 설치 (자동으로 호환 버전 설치됨)
npx expo install expo-camera

# 2. app.json에 권한 추가
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "앱에서 카메라를 사용하려면 권한이 필요합니다."
        }
      ]
    ]
  }
}

# 3. 코드에서 사용
import { CameraView, CameraType } from 'expo-camera';

function CameraScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>카메라 권한이 필요합니다</Text>
        <Button onPress={requestPermission} title="권한 허용" />
      </View>
    );
  }

  return (
    <CameraView style={{ flex: 1 }} type={CameraType.back} />
  );
}
```

---

## ⚠️ 주의사항 및 베스트 프랙티스

### 1. 버전 통일 필수

```bash
# 모든 expo 패키지 버전 확인
npx expo install --check

# 불일치 발견 시 자동 수정
npx expo install --fix
```

### 2. SDK 업그레이드 전 체크리스트

- [ ] 현재 프로젝트 백업
- [ ] 변경사항 커밋
- [ ] `npx expo-doctor` 실행하여 문제 확인
- [ ] 업그레이드 가이드 문서 확인
- [ ] 테스트 환경에서 먼저 테스트

### 3. 네이티브 코드 수정 시

```bash
# 네이티브 코드 수정 후 prebuild 필요
npx expo prebuild --clean

# iOS만
npx expo prebuild --platform ios --clean

# Android만
npx expo prebuild --platform android --clean
```

### 4. 캐시 문제 해결

```bash
# Metro 번들러 캐시 클리어
npx expo start --clear

# Watchman 캐시 클리어 (macOS)
watchman watch-del-all

# Node modules 재설치
rm -rf node_modules
npm install
```

---

## 🔍 유용한 명령어 모음

```bash
# Expo CLI 버전 확인
npx expo --version

# 프로젝트 상태 진단
npx expo-doctor

# 설치된 패키지 버전 확인
npx expo install --check

# 업그레이드 가능한 패키지 확인
npx expo upgrade

# 특정 SDK 버전으로 업그레이드
npx expo upgrade 55

# 모든 expo 패키지 버전 통일
npx expo install --fix

# 네이티브 코드 재생성
npx expo prebuild --clean

# 빌드 정보 확인
npx expo config
```

---

## 📚 추가 리소스

- [Expo 공식 문서](https://docs.expo.dev/)
- [Expo SDK 54 릴리즈 노트](https://expo.dev/changelog/)
- [Expo 패키지 목록](https://docs.expo.dev/versions/latest/)
- [Expo 업그레이드 가이드](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)

---

## 💡 현재 프로젝트 권장사항

### 1. 정기적인 버전 체크

```bash
# 주 1회 실행 권장
npx expo install --check
```

### 2. 새로운 패키지 추가 시

```bash
# 항상 expo install 사용
npx expo install <package-name>
```

### 3. SDK 업그레이드 시기

- 새로운 기능이 필요할 때
- 보안 패치가 있을 때
- 주요 버전 릴리즈 후 안정화된 시점

### 4. 현재 SDK 54 사용 이유

- 안정적인 버전
- React Native 0.81.4와 호환
- New Architecture 지원
- 필요한 모든 기능 제공

---

## 🎯 요약

1. **Expo SDK는 버전이 통일된 패키지 모음**
2. **`npx expo install`을 사용하여 패키지 추가**
3. **`npx expo install --check`로 정기적으로 버전 확인**
4. **SDK 업그레이드는 신중하게 진행**
5. **app.json에서 앱 설정 관리**

현재 프로젝트는 **Expo SDK 54**를 사용하며, 모든 패키지가 호환되도록 관리되고 있습니다! 🚀
