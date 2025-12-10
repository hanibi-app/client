# 429 에러 원인 분석

## 로그 분석 (246-294 라인)

### 발견된 문제점

1. **`useSnapshots`가 여전히 호출되고 있음** (7번 연속 실패)
   - 주석처리했지만 React Query 캐시에 남아있거나 다른 곳에서 호출 중
   - 엔드포인트: `/api/v1/cameras/${deviceId}/snapshots`
   - 로그: `WARN [useSnapshots] 스냅샷 조회 실패 (이미지 에러는 무시): [AxiosError: Request failed with status code 429]`

2. **토큰 갱신도 429 에러 발생**
   - 앱 시작 시 `initializeApp()`에서 토큰 갱신 시도
   - 로그: `ERROR [AuthStore] 토큰 갱신 실패: [AxiosError: Request failed with status code 429]`

3. **ReferenceError 발생**
   - `ERROR [ReferenceError: Property 'useSnapshots' doesn't exist]`
   - 주석처리로 인한 참조 오류 가능성

## 현재 API 호출 빈도

### 앱 시작 시 (initializeApp)

- 토큰 갱신: 1회
- 페어링 갱신: 1회

### HomeScreen (포커스 시)

- `useDevice`: **15초마다** (`/api/v1/devices/:deviceId`)
- `useFoodSessions`: **10초마다**
  - 내부 `useSensorEvents`: **10초마다** (`/api/v1/sensors/request-logs`)
  - ~~`useSnapshots`: 주석처리했지만 여전히 호출됨~~ (문제!)

### CameraPreviewDebugScreen (포커스 시)

- `useCameraSnapshot`: **10초마다** (`/api/v1/camera/:deviceId/snapshot`)

### DashboardScreen (포커스 시)

- `useSensorLatest`: **15초마다** (`/api/v1/sensors/latest/:deviceId`)

## 문제 원인 추정

### 1. `useSnapshots`가 여전히 호출되는 이유

- React Query가 이전 쿼리를 계속 실행 중일 수 있음
- 다른 컴포넌트에서 호출하고 있을 수 있음
- 앱이 재시작되지 않아 이전 코드가 실행 중일 수 있음

### 2. 429 에러 발생 시나리오

**약 1분 동안의 API 호출 추정:**

```
00:00 - 앱 시작
  - 토큰 갱신: 1회
  - 페어링 갱신: 1회
  - useSnapshots (캐시된 쿼리): 여러 번 시도
  - useDevice: 1회
  - useFoodSessions: 1회
    - useSensorEvents: 1회

00:10 - 10초 후
  - useFoodSessions: 1회
    - useSensorEvents: 1회
  - useSnapshots (캐시된 쿼리): 재시도
  - useCameraSnapshot (CameraPreviewDebugScreen 열려있으면): 1회

00:15 - 15초 후
  - useDevice: 1회
  - useSensorLatest (DashboardScreen 열려있으면): 1회

00:20 - 20초 후
  - useFoodSessions: 1회
    - useSensorEvents: 1회
  - useSnapshots (캐시된 쿼리): 재시도

00:30 - 30초 후
  - useDevice: 1회
  - useFoodSessions: 1회
    - useSensorEvents: 1회
  - useSnapshots (캐시된 쿼리): 재시도
```

**1분 동안 약 15-20회의 API 호출이 발생할 수 있음**

### 3. 특히 문제가 되는 부분

- **`useSnapshots`가 주석처리했는데도 계속 호출됨** (7번 연속)
- 여러 화면이 동시에 포커스되면 API 호출이 중복됨
- 토큰 갱신도 429 에러 발생

## 해결 방안

### 즉시 조치

1. **React Query 캐시 초기화 필요**
   - 앱 재시작 또는 캐시 클리어
   - `useSnapshots` 쿼리 키를 완전히 제거

2. **`useSnapshots` 완전 비활성화**
   - `useFoodSessions`에서 `snapshots` 관련 로직 완전 제거
   - React Query에서 해당 쿼리 제거

3. **토큰 갱신 재시도 로직 추가**
   - 429 에러 시 지수 백오프 적용

### 장기 개선

1. **API 호출 빈도 조정**
   - `useDevice`: 15초 → 30초
   - `useFoodSessions`: 10초 → 20초
   - `useSensorEvents`: 10초 → 20초

2. **중복 호출 방지**
   - 같은 엔드포인트에 대한 동시 호출 방지
   - React Query의 `refetchOnMount: false` 활용

3. **에러 핸들링 강화**
   - 429 에러 시 자동 재시도 방지
   - 사용자에게 적절한 메시지 표시
