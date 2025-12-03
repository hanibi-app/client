# EAS Build 가이드

이 문서는 Expo Application Services (EAS) Build를 사용하여 앱을 빌드하고 배포하는 방법을 설명합니다.

## 목차

1. [사전 준비](#사전-준비)
2. [빌드 프로파일](#빌드-프로파일)
3. [빌드 명령어](#빌드-명령어)
4. [플랫폼별 빌드](#플랫폼별-빌드)
5. [빌드 옵션](#빌드-옵션)
6. [빌드 상태 확인](#빌드-상태-확인)
7. [빌드 다운로드](#빌드-다운로드)
8. [트러블슈팅](#트러블슈팅)

## 사전 준비

### 1. EAS CLI 설치 확인

```bash
# EAS CLI 버전 확인
eas --version

# 또는 npx로 실행
npx eas-cli --version
```

### 2. EAS 계정 로그인

```bash
# 로그인 상태 확인
eas whoami

# 로그인이 안 되어 있다면
eas login
```

### 3. 프로젝트 설정 확인

- `eas.json` 파일이 프로젝트 루트에 있는지 확인
- `app.json`에 EAS 프로젝트 ID가 설정되어 있는지 확인

## 빌드 프로파일

현재 프로젝트에는 다음 3가지 빌드 프로파일이 설정되어 있습니다:

### 1. Development (개발 빌드)

- **용도**: 개발 중 테스트용
- **특징**:
  - Development Client 포함
  - 내부 배포용
- **설정**: `eas.json`의 `build.development`

### 2. Preview (프리뷰 빌드)

- **용도**: 테스트 및 QA용
- **특징**:
  - 내부 배포용
  - 프로덕션과 유사한 환경
- **설정**: `eas.json`의 `build.preview`

### 3. Production (프로덕션 빌드)

- **용도**: 실제 배포용
- **특징**:
  - 자동 버전 증가 (`autoIncrement: true`)
  - 앱 스토어 제출 준비 완료
- **설정**: `eas.json`의 `build.production`

## 빌드 명령어

### 기본 형식

```bash
eas build --platform <플랫폼> --profile <프로파일>
```

### iOS 빌드

```bash
# 프로덕션 빌드
eas build --platform ios --profile production

# 프리뷰 빌드
eas build --platform ios --profile preview

# 개발 빌드
eas build --platform ios --profile development
```

### Android 빌드

```bash
# 프로덕션 빌드
eas build --platform android --profile production

# 프리뷰 빌드
eas build --platform android --profile preview

# 개발 빌드
eas build --platform android --profile development
```

### 모든 플랫폼 빌드

```bash
# 프로덕션 빌드 (iOS + Android)
eas build --platform all --profile production

# 프리뷰 빌드 (iOS + Android)
eas build --platform all --profile preview
```

## 플랫폼별 빌드

### iOS 빌드

#### 사전 요구사항

1. **Apple Developer 계정**
   - Apple Developer Program 가입 필요
   - 연간 $99 구독

2. **인증서 및 프로비저닝 프로파일**
   - EAS가 자동으로 관리 (자동 프로비저닝)
   - 또는 수동으로 설정 가능

#### 빌드 실행

```bash
# 프로덕션 빌드
eas build --platform ios --profile production
```

#### 빌드 타입 선택

빌드 실행 시 다음 중 선택할 수 있습니다:

- **App Store**: App Store 제출용 (.ipa)
- **Ad Hoc**: 특정 기기용 배포 (.ipa)
- **Development**: 개발용 (.ipa)
- **Simulator**: 시뮬레이터용 (.app)

### Android 빌드

#### 사전 요구사항

1. **Google Play Console 계정**
   - Google Play Developer Program 가입 필요
   - 일회성 $25 등록비

2. **서명 키**
   - EAS가 자동으로 관리 (권장)
   - 또는 수동으로 설정 가능

#### 빌드 실행

```bash
# 프로덕션 빌드
eas build --platform android --profile production
```

#### 빌드 타입 선택

빌드 실행 시 다음 중 선택할 수 있습니다:

- **APK**: 직접 설치용 (.apk)
- **AAB (App Bundle)**: Google Play 제출용 (.aab)

## 빌드 옵션

### 주요 옵션

```bash
# 로컬에서 빌드 (빠르지만 환경 설정 필요)
eas build --platform ios --profile production --local

# 대화형 프롬프트 없이 빌드
eas build --platform ios --profile production --non-interactive

# 캐시 클리어 후 빌드
eas build --platform ios --profile production --clear-cache

# 특정 메시지와 함께 빌드
eas build --platform ios --profile production --message "버그 수정"
```

### 환경 변수 사용

```bash
# 환경 변수 설정
eas build --platform ios --profile production --env-file .env.production
```

## 빌드 상태 확인

### 빌드 목록 확인

```bash
# 모든 빌드 목록 확인
eas build:list

# 특정 플랫폼만 확인
eas build:list --platform ios
eas build:list --platform android
```

### 빌드 상세 정보 확인

```bash
# 빌드 ID로 상세 정보 확인
eas build:view <빌드-ID>
```

### 빌드 로그 확인

```bash
# 빌드 로그 확인
eas build:logs <빌드-ID>
```

## 빌드 다운로드

### 빌드 완료 후 다운로드

빌드가 완료되면:

1. **이메일 알림**: 빌드 완료 시 이메일로 알림 수신
2. **웹 대시보드**: [expo.dev](https://expo.dev)에서 다운로드
3. **명령어로 다운로드**:

```bash
# 빌드 ID로 다운로드
eas build:download <빌드-ID>

# 최신 빌드 다운로드
eas build:download --latest
```

### QR 코드로 설치 (Android APK)

Android APK의 경우 빌드 완료 후 QR 코드가 제공됩니다. 이를 스캔하여 기기에 직접 설치할 수 있습니다.

## 앱 스토어 제출

### iOS (App Store)

```bash
# 빌드와 함께 자동 제출
eas build --platform ios --profile production --auto-submit

# 또는 별도로 제출
eas submit --platform ios
```

### Android (Google Play)

```bash
# 빌드와 함께 자동 제출
eas build --platform android --profile production --auto-submit

# 또는 별도로 제출
eas submit --platform android
```

## 트러블슈팅

### 일반적인 문제

#### 1. 빌드 실패

```bash
# 빌드 로그 확인
eas build:logs <빌드-ID>

# 캐시 클리어 후 재시도
eas build --platform ios --profile production --clear-cache
```

#### 2. 인증서 문제 (iOS)

```bash
# 인증서 상태 확인
eas credentials

# 인증서 재생성
eas credentials --platform ios
```

#### 3. 서명 키 문제 (Android)

```bash
# 서명 키 상태 확인
eas credentials

# 서명 키 재생성
eas credentials --platform android
```

#### 4. 환경 변수 문제

```bash
# 환경 변수 확인
eas build:configure

# .env 파일 확인
cat .env.production
```

### 유용한 명령어

```bash
# EAS 설정 확인
eas build:configure

# 프로젝트 정보 확인
eas project:info

# 계정 정보 확인
eas account:view
```

## 빌드 시간 및 비용

### 빌드 시간

- **iOS**: 약 10-20분
- **Android**: 약 5-15분

### EAS Build 요금제

- **무료 플랜**: 월 30회 빌드
- **프로 플랜**: 월 100회 빌드 ($29/월)
- **스케일 플랜**: 무제한 빌드 ($99/월)

자세한 내용은 [EAS Build 가격](https://expo.dev/pricing)을 참고하세요.

## 참고 자료

- [EAS Build 공식 문서](https://docs.expo.dev/build/introduction/)
- [EAS Build 설정 가이드](https://docs.expo.dev/build/eas-json/)
- [EAS CLI 명령어 참조](https://docs.expo.dev/build/building-on-ci/)
- [앱 스토어 제출 가이드](https://docs.expo.dev/submit/introduction/)

## 빠른 참조

### 가장 많이 사용하는 명령어

```bash
# iOS 프로덕션 빌드
eas build --platform ios --profile production

# Android 프로덕션 빌드
eas build --platform android --profile production

# 빌드 목록 확인
eas build:list

# 최신 빌드 다운로드
eas build:download --latest

# 빌드 로그 확인
eas build:logs <빌드-ID>
```

---

**마지막 업데이트**: 2025-12-03
