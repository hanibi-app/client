# 상태 태그 타입 상세 설명

이 문서는 프로젝트에서 사용되는 모든 상태 태그 타입과 그 데이터 소스, 사용 위치를 설명합니다.

---

## 1. DeviceProcessingStatus (기기 동작 상태)

### 타입 정의

```typescript
type DeviceProcessingStatus = 'IDLE' | 'PROCESSING' | 'ERROR';
```

### 값 설명

- **`IDLE`** (대기 중): 기기가 대기 상태
  - 배지 색상: 회색 (`colors.gray100`)
  - 텍스트 색상: 검정 (`colors.text`)
- **`PROCESSING`** (처리 중): 기기가 음식 처리 중
  - 배지 색상: 보라색 (`#8B5CF6`)
  - 텍스트 색상: 흰색 (`colors.white`)
- **`ERROR`** (오류): 기기 오류 발생
  - 배지 색상: 빨강 (`colors.danger`)
  - 텍스트 색상: 흰색 (`colors.white`)

### 데이터 소스

- **API 엔드포인트**: `GET /api/v1/devices/:deviceId`
- **응답 필드**: `DeviceDetail.deviceStatus`
- **훅**: `useDeviceDetail(deviceId)`
- **캐시 시간**: 30초 (`staleTime: 1000 * 30`)
- **갱신 주기**: 수동 refetch 또는 쿼리 무효화 시

### 사용 위치

1. **`DeviceStatusCard`** (`src/components/device/DeviceStatusCard.tsx`)
   - 대시보드 화면의 기기 상태 카드
   - `deviceDetail?.deviceStatus`에서 받아옴
2. **`DeviceControlModal`** (`src/components/DeviceControlModal.tsx`)
   - 홈 화면에서 캐릭터 클릭 → 내 기기 클릭 시 나타나는 모달
   - `latestDevice?.deviceStatus`에서 받아옴

3. **`DeviceDetailScreen`** (`src/screens/DeviceDetailScreen.tsx`)
   - 기기 상세 화면
   - `device?.deviceStatus`에서 받아옴

---

## 2. ConnectionStatus (연결 상태)

### 타입 정의

```typescript
type ConnectionStatus = 'ONLINE' | 'OFFLINE' | string;
```

### 값 설명

- **`ONLINE`** (온라인): 기기가 서버와 연결됨
  - 배지 색상: 초록 (`colors.success`)
  - 텍스트 색상: 흰색 (`colors.white`)
- **`OFFLINE`** (오프라인): 기기가 서버와 연결되지 않음
  - 배지 색상: 회색 (`colors.mutedText`)
  - 텍스트 색상: 검정 (`colors.text`)

### 데이터 소스

- **API 엔드포인트**: `GET /api/v1/devices/:deviceId`
- **응답 필드**: `DeviceDetail.connectionStatus`
- **훅**: `useDeviceDetail(deviceId)`
- **캐시 시간**: 30초
- **갱신 주기**: 수동 refetch 또는 쿼리 무효화 시

### 사용 위치

1. **`DeviceControlModal`** (`src/components/DeviceControlModal.tsx`)
   - "연결 상태" 섹션에 표시
   - `latestDevice?.connectionStatus`에서 받아옴

2. **`DeviceListModal`** (`src/components/DeviceListModal.tsx`)
   - 기기 목록에서 각 기기의 연결 상태 표시
   - `device.connectionStatus`에서 받아옴

---

## 3. SensorStatus (센서 상태)

### 타입 정의

```typescript
type SensorStatus = 'SAFE' | 'CAUTION' | 'WARNING';
```

### 값 설명

- **`SAFE`** (안전): 센서 값이 정상 범위
  - 색상: 초록 (`#40EA87`)
  - 점수: 10점
- **`CAUTION`** (주의): 센서 값이 주의 범위
  - 색상: 노랑 (`#FFD700`)
  - 점수: 5점
- **`WARNING`** (경고): 센서 값이 위험 범위
  - 색상: 주황 (`#FF7017`)
  - 점수: 0점

### 계산 로직

#### 온도 (Temperature)

- **SAFE**: 20°C ~ 30°C
- **CAUTION**: 30°C ~ 35°C
- **WARNING**: 그 외

#### 습도 (Humidity)

- **SAFE**: 0% ~ 30% (낮을수록 좋음)
- **CAUTION**: 30% ~ 50%
- **WARNING**: 50% 이상

#### 가스/VOC (Gas)

- **SAFE**: 0 ~ 200 ppb
- **CAUTION**: 200 ~ 400 ppb
- **WARNING**: 400 ppb 이상

#### 무게 (Weight)

- **SAFE**: 0 < weight ≤ 1000g
- **CAUTION**: 1000g < weight ≤ 2000g
- **WARNING**: weight > 2000g 또는 weight === 0

### 데이터 소스

- **API 엔드포인트**: `GET /api/v1/sensors/latest/:deviceId`
- **응답 필드**: `SensorLatestData` (temperature, humidity, weight, gas)
- **훅**: `useSensorLatest(deviceId)`
- **갱신 주기**: **5초마다 자동 폴링** (`refetchInterval: 5000`)
- **계산 함수**:
  - `getTemperatureStatus(temp)` (`src/features/dashboard/utils/healthScore.ts`)
  - `getHumidityStatus(humidity)`
  - `getGasStatus(gas)`
  - `getWeightStatus(weight)` (`DeviceStatusCard` 내부)

### 사용 위치

1. **`DeviceStatusCard`** (`src/components/device/DeviceStatusCard.tsx`)
   - 온도, 습도, 무게, 가스 각각의 상태를 점(도트)으로 표시
   - 센서 값 옆에 색상으로 상태 표시

2. **`DashboardScreen`** (`src/screens/Dashboard/DashboardScreen.tsx`)
   - 건강 점수 계산에 사용
   - 각 센서별 상태를 점수로 변환하여 총점 계산 (0~40점)

---

## 4. FoodInputSession Status (음식 투입 세션 상태)

### 타입 정의

```typescript
type FoodInputSessionStatus = 'in_progress' | 'completed';
```

### 값 설명

- **`in_progress`** (투입 중): 세션이 진행 중
  - 조건: `FOOD_INPUT_BEFORE` 이벤트만 있고, `FOOD_INPUT_AFTER` 또는 `PROCESSING_COMPLETED` 이벤트가 없음
  - 배지 색상: 노랑 배경 (`colors.warning + '20'`)
  - 텍스트 색상: 노랑 (`colors.warning`)
  - 레이블: "투입 중"
- **`completed`** (투입 완료): 세션이 완료됨
  - 조건: `FOOD_INPUT_AFTER` 또는 `PROCESSING_COMPLETED` 이벤트가 있음
  - 배지 색상: 초록 배경 (`colors.success + '20'`)
  - 텍스트 색상: 초록 (`colors.success`)
  - 레이블: "투입 완료"

### 데이터 소스

- **API 엔드포인트**:
  - `GET /api/v1/sensors/request-logs` (센서 이벤트)
  - `GET /api/v1/cameras/:deviceId/snapshots` (스냅샷, 현재 주석 처리됨)
- **훅**: `useFoodSessions(deviceId)`
- **내부 로직**:
  - `useSensorEvents(deviceId)`로 센서 이벤트 조회
  - `buildSessionsFromEventsAndSnapshots()`로 세션 생성
  - `FOOD_INPUT_BEFORE` → `FOOD_INPUT_AFTER` / `PROCESSING_COMPLETED` 매칭
- **갱신 주기**: 수동 refetch 또는 쿼리 무효화 시

### 세션 생성 규칙

1. `FOOD_INPUT_BEFORE` 이벤트를 만나면 새 세션 시작
2. `FOOD_INPUT_AFTER` 이벤트를 만나면 세션 종료 (`status: 'completed'`)
3. `PROCESSING_COMPLETED` 이벤트를 만나면 세션 종료 (`status: 'completed'`)
4. `FOOD_INPUT_BEFORE`만 있고 종료 이벤트가 없으면 `status: 'in_progress'`

### 사용 위치

1. **`DeviceStatusCard`** (`src/components/device/DeviceStatusCard.tsx`)
   - 최신 세션(`latestSession`)의 상태를 배지로 표시
   - 기기 동작 상태 배지 왼쪽에 표시

2. **`HomeScreen`** (`src/screens/Home/HomeScreen.tsx`)
   - 캐릭터 위에 상태 태그로 표시
   - `latestSession?.status`에서 받아옴

3. **`FoodSessionTimeline`** (`src/components/food/FoodSessionTimeline.tsx`)
   - 각 세션 카드에 상태 배지 표시
   - "진행 중" 또는 "완료" 배지

4. **`DeviceControlModal`** (`src/components/DeviceControlModal.tsx`)
   - "최근 음식 투입 기록" 섹션에 최신 세션 정보 표시

---

## 5. Health Score Level (건강 점수 레벨)

### 타입 정의

```typescript
type HealthScoreLevel = 'SAFE' | 'CAUTION' | 'WARNING' | 'CRITICAL';
```

### 값 설명

- **`SAFE`**: 75~100점 (안전 상태)
- **`CAUTION`**: 50~74점 (주의 상태)
- **`WARNING`**: 25~49점 (경고 상태)
- **`CRITICAL`**: 0~24점 (위험 상태)

### 계산 방법

1. 각 센서(온도, 습도, 무게, 가스)의 `SensorStatus`를 점수로 변환
   - `SAFE`: 10점
   - `CAUTION`: 5점
   - `WARNING`: 0점
2. 총점 계산 (0~40점)
3. 총점을 100점 만점으로 변환 (0~100점)
4. 점수에 따라 레벨 결정

### 데이터 소스

- **계산 함수**: `calculateHealthScore()` (`src/features/dashboard/utils/healthScore.ts`)
- **입력**: `useSensorLatest(deviceId)`에서 받은 센서 데이터
- **갱신 주기**: 센서 데이터 갱신 시마다 재계산 (5초마다)

### 사용 위치

1. **`DashboardScreen`** (`src/screens/Dashboard/DashboardScreen.tsx`)
   - 건강 점수 원형 차트에 표시
   - 점수에 따른 색상 그라데이션 표시

---

## 요약 테이블

| 타입                        | 값                               | 데이터 소스                                           | 갱신 주기        | 주요 사용 위치                                    |
| --------------------------- | -------------------------------- | ----------------------------------------------------- | ---------------- | ------------------------------------------------- |
| **DeviceProcessingStatus**  | IDLE, PROCESSING, ERROR          | `GET /api/v1/devices/:deviceId` → `deviceStatus`      | 수동/쿼리 무효화 | DeviceStatusCard, DeviceControlModal              |
| **ConnectionStatus**        | ONLINE, OFFLINE                  | `GET /api/v1/devices/:deviceId` → `connectionStatus`  | 수동/쿼리 무효화 | DeviceControlModal, DeviceListModal               |
| **SensorStatus**            | SAFE, CAUTION, WARNING           | `GET /api/v1/sensors/latest/:deviceId` → 센서 값 계산 | **5초마다 자동** | DeviceStatusCard, DashboardScreen                 |
| **FoodInputSession Status** | in_progress, completed           | `GET /api/v1/sensors/request-logs` → 세션 생성        | 수동/쿼리 무효화 | DeviceStatusCard, HomeScreen, FoodSessionTimeline |
| **Health Score Level**      | SAFE, CAUTION, WARNING, CRITICAL | 센서 데이터 기반 계산                                 | **5초마다 자동** | DashboardScreen                                   |

---

## 참고사항

1. **실시간 갱신**: `SensorStatus`와 `Health Score Level`은 5초마다 자동으로 갱신됩니다.
2. **수동 갱신**: 나머지 상태들은 React Query의 캐시 무효화 또는 수동 refetch 시에만 갱신됩니다.
3. **카메라 기능**: 현재 스냅샷 관련 기능은 주석 처리되어 있으며, 백엔드 준비 완료 후 활성화 예정입니다.
