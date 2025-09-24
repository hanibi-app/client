# React Native CLI 프로젝트 관리 가이드

## 🎯 개요

이 프로젝트는 Expo에서 React Native CLI로 완전히 전환되었습니다. 이제 네이티브 모듈을 자유롭게 사용할 수 있으며, 더 세밀한 네이티브 설정이 가능합니다.

## 📦 의존성 설치

```bash
# 의존성 설치
npm install

# iOS 의존성 설치 (macOS 전용)
cd ios && pod install && cd ..

# Android 의존성 확인
cd android && ./gradlew clean && cd ..
```

## 🚀 프로젝트 실행

### 개발 서버 시작
```bash
# Metro bundler 시작
npm start

# 또는 캐시 클리어하며 시작
npm start -- --reset-cache
```

### 앱 실행
```bash
# Android 실행
npm run android

# iOS 실행 (macOS 전용)
npm run ios

# 특정 디바이스에서 실행
npm run ios -- --simulator="iPhone 15 Pro"
npm run android -- --deviceId=emulator-5554
```

## 🛠️ 개발 도구

### 코드 품질 검사
```bash
# TypeScript 타입 체크
npm run typecheck

# ESLint 검사
npm run lint

# 전체 검증 (타입체크 + 린팅)
npm run validate
```

### 테스트
```bash
# 단위 테스트 실행
npm test

# 테스트 watch 모드
npm run test:watch
```

### 캐시 정리
```bash
# React Native 캐시 정리
npm run clean

# Android 캐시 정리
npm run clean:android

# iOS 캐시 정리
npm run clean:ios

# Metro bundler 캐시 정리
npx react-native start --reset-cache
```

## 🏗️ 빌드 및 배포

### Android 빌드
```bash
# Debug APK 생성
cd android && ./gradlew assembleDebug && cd ..

# Release APK 생성
cd android && ./gradlew assembleRelease && cd ..

# AAB (Play Store용) 생성
cd android && ./gradlew bundleRelease && cd ..
```

### iOS 빌드
```bash
# Xcode에서 빌드
open ios/hanibiapp.xcworkspace

# 또는 명령어로 빌드
cd ios && xcodebuild -workspace hanibiapp.xcworkspace -scheme hanibiapp -configuration Debug && cd ..
```

## 🔧 네이티브 모듈 관리

### 새로운 네이티브 모듈 설치
```bash
# 1. npm으로 설치
npm install react-native-example-module

# 2. iOS 의존성 설치
cd ios && pod install && cd ..

# 3. Android는 자동 링크됨 (RN 0.60+)

# 4. 앱 재시작
npm run android  # 또는 npm run ios
```

### 수동 링킹이 필요한 경우
```bash
# react-native-config 등 일부 모듈
npx react-native link react-native-config
```

## 📱 디바이스별 설정

### Android 설정
```bash
# 연결된 디바이스 확인
adb devices

# 특정 디바이스에서 실행
npx react-native run-android --deviceId=DEVICE_ID

# 에뮬레이터 시작
$ANDROID_HOME/emulator/emulator -avd Pixel_4_API_30
```

### iOS 설정
```bash
# 시뮬레이터 목록 확인
xcrun simctl list devices

# 특정 시뮬레이터에서 실행
npx react-native run-ios --simulator="iPhone 15 Pro"

# 실제 디바이스에서 실행 (개발자 계정 필요)
npx react-native run-ios --device="Your iPhone"
```

## 🐛 디버깅

### React Native Debugger
```bash
# React Native Debugger 설치
brew install --cask react-native-debugger

# 또는 Chrome DevTools 사용
# 앱에서 Cmd+D (iOS) / Cmd+M (Android) → Debug 선택
```

### Flipper 사용
```bash
# Flipper 설치
brew install --cask flipper

# 앱 실행 후 Flipper에서 연결
```

### 로그 확인
```bash
# Android 로그
npx react-native log-android

# iOS 로그
npx react-native log-ios

# Metro bundler 로그
npm start
```

## 🔒 환경 변수 관리

### react-native-config 사용법
```bash
# .env 파일 수정
API_BASE_URL=https://api.example.com
APP_ENV=development

# TypeScript에서 사용
import Config from 'react-native-config';
console.log(Config.API_BASE_URL);
```

### 환경별 설정
```bash
# .env.development
API_BASE_URL=https://dev-api.example.com

# .env.production  
API_BASE_URL=https://api.example.com

# 빌드 시 환경 지정
ENVFILE=.env.production npm run android
```

## 📊 성능 최적화

### Bundle 분석
```bash
# Bundle 크기 분석
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android-bundle.js --analyze

# Hermes 엔진 사용 (Android)
# android/app/build.gradle에서
# project.ext.react = [
#     enableHermes: true
# ]
```

### 메모리 사용량 확인
```bash
# Android 메모리 사용량
adb shell dumpsys meminfo com.hanibiapp

# iOS는 Xcode Instruments 사용
```

## 🚨 문제 해결

### 자주 발생하는 문제들

#### 1. Metro bundler 오류
```bash
# 캐시 정리 후 재시작
npx react-native start --reset-cache
rm -rf node_modules && npm install
```

#### 2. Android 빌드 오류
```bash
# Gradle 캐시 정리
cd android && ./gradlew clean && cd ..
rm -rf android/.gradle
```

#### 3. iOS 빌드 오류
```bash
# Pod 재설치
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

#### 4. 네이티브 모듈 연결 오류
```bash
# 자동 링킹 재실행
npx react-native unlink react-native-module-name
npx react-native link react-native-module-name
```

## 📁 프로젝트 구조

```
hanibi-app/
├── android/                 # Android 네이티브 코드
├── ios/                     # iOS 네이티브 코드
├── src/                     # 소스 코드
│   ├── api/                 # API 클라이언트
│   ├── components/          # 재사용 컴포넌트
│   ├── navigation/          # 네비게이션 설정
│   ├── screens/            # 화면 컴포넌트
│   ├── services/           # 비즈니스 로직
│   ├── store/              # 상태 관리
│   └── styles/             # 디자인 시스템
├── App.tsx                 # 앱 엔트리포인트
├── index.js               # RN CLI 엔트리포인트
├── metro.config.js        # Metro 설정
├── babel.config.js        # Babel 설정
└── tsconfig.json          # TypeScript 설정
```

## 🔄 업데이트 가이드

### React Native 버전 업데이트
```bash
# React Native CLI 업데이트
npm install -g @react-native-community/cli

# 프로젝트 업데이트
npx react-native upgrade

# 수동으로 네이티브 파일 비교
# https://react-native-community.github.io/upgrade-helper/
```

### 의존성 업데이트
```bash
# 모든 의존성 확인
npm outdated

# 안전한 업데이트
npm update

# 메이저 버전 업데이트 (주의)
npm install package-name@latest
```

## 📚 추가 자료

- [React Native 공식 문서](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native CLI 가이드](https://github.com/react-native-community/cli)
- [네이티브 모듈 개발](https://reactnative.dev/docs/native-modules-intro)
- [성능 최적화](https://reactnative.dev/docs/performance)

---

**이 가이드는 지속적으로 업데이트됩니다. 문제가 발생하면 이슈를 등록해주세요.**
