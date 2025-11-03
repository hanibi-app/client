# 🔧 트러블슈팅 가이드

## iOS 시뮬레이터 타임아웃 오류 (Code 60)

### 문제
```
Error: xcrun simctl openurl ... exited with non-zero code: 60
Simulator device failed to open exp://...
Operation timed out
```

### 해결 방법

#### 방법 1: 캐시 클리어 후 재시작 (추천)

```bash
# 1. 모든 프로세스 종료
pkill -f "expo start"
pkill -f "metro"

# 2. 캐시 클리어하고 시작
npx expo start --clear

# 3. iOS 시뮬레이터를 수동으로 열기
# (Xcode > Open Developer Tool > Simulator)

# 4. 터미널에서 'i' 키를 누르거나, 
# Simulator에서 직접 Expo Go 앱을 열고 
# Metro bundler URL을 입력
```

#### 방법 2: 직접 빌드 (네이티브 빌드)

```bash
# 개발 빌드로 실행 (Expo Go 없이)
npx expo run:ios
```

이 방법은 Expo Go 대신 네이티브 앱을 직접 빌드합니다.
- 장점: 더 안정적, GL 기능 완벽 지원
- 단점: 첫 빌드가 느림 (5-10분)

#### 방법 3: 웹에서 먼저 테스트

```bash
npm run web
```

3D 캐릭터는 웹에서는 제한적이지만, UI와 로직은 확인 가능합니다.

#### 방법 4: Android 에뮬레이터 사용

iOS가 안 되면 Android로 테스트:

```bash
# Android Studio에서 에뮬레이터를 먼저 실행한 후
npm run android
```

### 추가 해결책

#### A. Metro Bundler 수동 확인

```bash
# Expo 서버가 실행 중인지 확인
lsof -i :8081

# 8081 포트가 사용 중이면 프로세스 종료
kill -9 <PID>
```

#### B. iOS 시뮬레이터 리셋

```bash
# 시뮬레이터 초기화
xcrun simctl erase all

# 또는 Xcode에서:
# Simulator > Device > Erase All Content and Settings
```

#### C. Watchman 캐시 클리어

```bash
# Watchman 설치 확인
brew install watchman

# 캐시 클리어
watchman watch-del-all
```

#### D. Node modules 재설치

```bash
# 의존성 완전히 재설치
rm -rf node_modules package-lock.json
npm install
```

### 현재 권장 실행 방법 🚀

**가장 안정적인 방법: 네이티브 빌드**

```bash
# 1. 개발 서버 시작
npm start

# 2. 새 터미널에서 iOS 빌드
npx expo run:ios
```

이렇게 하면:
- ✅ Expo Go 없이 네이티브 앱 실행
- ✅ 3D GL 기능 완벽 지원
- ✅ 타임아웃 오류 없음
- ✅ Hot reload 지원

### 참고 사항

#### Expo Go vs 개발 빌드

| 항목 | Expo Go | 개발 빌드 (expo run:ios) |
|------|---------|--------------------------|
| 설치 속도 | 빠름 | 느림 (첫 빌드만) |
| 안정성 | 보통 | 높음 |
| GL 지원 | 제한적 | 완벽 |
| 권장 용도 | 빠른 프로토타입 | 실제 개발 |

### 네트워크 문제

타임아웃은 보통 네트워크 문제입니다:

```bash
# 1. localhost로 변경
npx expo start --localhost

# 2. 터널 모드 사용
npx expo start --tunnel

# 3. LAN 모드 (기본값)
npx expo start --lan
```

### 정리: 빠른 해결 순서

1. ✅ **캐시 클리어**: `npx expo start --clear`
2. ✅ **네이티브 빌드**: `npx expo run:ios`
3. ✅ **시뮬레이터 리셋**: `xcrun simctl erase all`
4. ✅ **의존성 재설치**: `rm -rf node_modules && npm install`

---

## 기타 자주 발생하는 문제

### "Metro bundler 연결 실패"

```bash
# Metro 재시작
npx expo start --clear --reset-cache
```

### "Module not found"

```bash
# TypeScript 및 Metro 캐시 클리어
npx expo start --clear
npm run typecheck
```

### "GL 컨텍스트 생성 실패"

```bash
# 네이티브 빌드 사용
npx expo run:ios
# Expo Go는 GL 지원이 제한적일 수 있습니다
```

### "빌드가 너무 느림"

```bash
# 캐시 활용
npx expo run:ios --no-build-cache
# 또는 Xcode에서 직접 빌드
```

---

**도움이 필요하면 Expo 공식 문서를 참고하세요:**
- [Expo Troubleshooting](https://docs.expo.dev/troubleshooting/overview/)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)

