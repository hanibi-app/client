# 리포트 화면 데이터 로딩 흐름 분석

## 📊 전체 데이터 흐름

### 1. 사용자가 탭을 선택하는 경우 (예: 습도)

```
사용자 클릭: "수분 컨디션" 탭
    ↓
ReportTabs 컴포넌트에서 onTabChange('humidity') 호출
    ↓
ReportsScreen의 setActiveTab('humidity') 실행
    ↓
mapTabTypeToApiType('humidity') → 'humidity' 반환
    ↓
useSensorReport('humidity', '1일') 호출
    ↓
fetchSensorReport('humidity', '1일') 실행
    ↓
API 호출: GET /api/v1/reports/humidity?range=1일
    ↓
응답 파싱: response.data.data → { dataPoints: [...], summary: {...} }
    ↓
화면에 그래프 및 테이블 표시
```

### 2. 습도(Humidity) 데이터 로딩 상세

**코드 위치:**

- `src/screens/Reports/ReportsScreen.tsx` (라인 222)
- `src/features/reports/hooks/useSensorReport.ts` (라인 40)
- `src/api/reports.ts` (라인 94)

**실제 호출되는 URL:**

```
GET /api/v1/reports/humidity?range=1일
```

**매핑 과정:**

```typescript
// ReportsScreen.tsx 라인 54-62
const mapTabTypeToApiType = (tabType: ReportTabType): string => {
  const mapping: Record<ReportTabType, string> = {
    temp: 'temp',
    humidity: 'humidity', // ← 'humidity' 그대로 사용
    weight: 'weight',
    voc: 'voc',
  };
  return mapping[tabType];
};

// activeTab = 'humidity'일 때
// apiType = 'humidity' 반환
// URL = /api/v1/reports/humidity
```

**응답 파싱:**

```typescript
// reports.ts 라인 106-110
const response = await apiClient.get<ApiResponse<SensorReportResponse>>(url, {
  params,
});

const data = response.data.data; // ← response.data.data 구조
// data = {
//   dataPoints: [...],
//   summary: {...}
// }
```

### 3. 무게(Weight) 데이터 로딩 상세

**매핑:**

```typescript
activeTab = 'weight'
  → mapTabTypeToApiType('weight')
  → 'weight' 반환
  → URL: /api/v1/reports/weight?range=1일
```

**응답 파싱:** 습도와 동일 (response.data.data 구조)

### 4. VOC 데이터 로딩 상세

**매핑:**

```typescript
activeTab = 'voc'
  → mapTabTypeToApiType('voc')
  → 'voc' 반환
  → URL: /api/v1/reports/voc?range=1일
```

**응답 파싱:** 습도와 동일 (response.data.data 구조)

---

## 🔴 온도(Temp) 데이터 로딩 문제

### 현재 상황

**이미지에서 확인된 오류:**

```
[ReportsScreen] API 호출 실패: type=temperature, range=1일
AxiosError: Request failed with status code 500
```

**문제점:**

- 에러 로그에 `type=temperature`로 표시됨
- 하지만 코드에서는 `temp: 'temp'`로 수정했음
- 이는 **React Query 캐시** 때문일 가능성이 높음

### 온도 데이터 로딩 흐름 (수정 후)

**매핑:**

```typescript
activeTab = 'temp'
  → mapTabTypeToApiType('temp')
  → 'temp' 반환 (수정됨: 이전에는 'temperature')
  → URL: /api/v1/reports/temp?range=1일  ← 올바른 URL
```

**예상되는 올바른 호출:**

```
GET /api/v1/reports/temp?range=1일
```

**응답 파싱:** 습도/무게/VOC와 동일 (response.data.data 구조)

---

## 🔍 확인해야 할 포인트

### 1. React Query 캐시 문제

**문제:**

- 코드는 수정했지만, React Query가 이전 쿼리 키로 캐시된 데이터를 사용할 수 있음
- 쿼리 키: `['reports', 'sensor', 'temperature', '1일']` (이전)
- 쿼리 키: `['reports', 'sensor', 'temp', '1일']` (수정 후)

**해결 방법:**

1. 앱 재시작 (캐시 초기화)
2. React Query DevTools로 캐시 확인
3. 쿼리 키가 올바르게 변경되었는지 확인

### 2. 실제 호출되는 URL 확인

**로그 추가 위치:**

- `src/api/reports.ts` 라인 96: `const url = `/api/v1/reports/${type}`;`
- 이미 로그가 있음: `console.log('[reportsApi.fetchSensorReport] 호출 시작: url=${url}')`

**확인 방법:**

- 콘솔에서 실제 호출되는 URL 확인
- `type=temperature`인지 `type=temp`인지 확인

### 3. 응답 파싱 구조 확인

**올바른 구조:**

```typescript
response.data.data.dataPoints; // ✅ 올바름
response.data.data.summary; // ✅ 올바름
```

**잘못된 구조 (확인 필요):**

```typescript
response.data.dataPoints; // ❌ 한 단계 덜 들어감
response.dataPoints; // ❌ 두 단계 덜 들어감
```

**현재 코드:** `src/api/reports.ts` 라인 110

```typescript
const data = response.data.data; // ✅ 올바른 구조
```

---

## 📝 요약

### 습도/무게/VOC가 정상 작동하는 이유

1. **매핑이 정확함:**
   - `humidity` → `'humidity'` (변환 없음)
   - `weight` → `'weight'` (변환 없음)
   - `voc` → `'voc'` (변환 없음)

2. **URL이 올바름:**
   - `/api/v1/reports/humidity`
   - `/api/v1/reports/weight`
   - `/api/v1/reports/voc`

3. **응답 파싱이 올바름:**
   - `response.data.data` 구조 사용

### 온도가 실패하는 이유 (수정 전)

1. **매핑이 잘못됨:**
   - `temp` → `'temperature'` (이전)
   - 올바른 매핑: `temp` → `'temp'` (수정 후)

2. **URL이 잘못됨:**
   - 잘못된 URL: `/api/v1/reports/temperature` (500 에러)
   - 올바른 URL: `/api/v1/reports/temp`

3. **React Query 캐시:**
   - 이전 쿼리 키가 캐시되어 있을 수 있음
   - 앱 재시작 필요

---

## 🛠️ 다음 단계

1. **앱 재시작** (React Query 캐시 초기화)
2. **콘솔 로그 확인:**
   - `[ReportsScreen] 탭 변경: activeTab=temp → apiType=temp`
   - `[reportsApi.fetchSensorReport] 호출 시작: url=/api/v1/reports/temp`
3. **에러 로그 재확인:**
   - 여전히 `type=temperature`로 나가면 다른 곳에서 매핑하는지 확인
   - `type=temp`로 나가면 백엔드 문제일 수 있음
