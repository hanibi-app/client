# FoodInputSession Status UI 표시 방식 상세 설명

이 문서는 `FoodInputSession`의 `status` 필드(`'in_progress' | 'completed'`)가 실제 UI에서 어떻게 표시되는지 상세히 설명합니다.

---

## 📍 표시 위치 및 스타일

### 1. **대시보드 화면 - DeviceStatusCard**

**위치**: `src/components/device/DeviceStatusCard.tsx`

#### 표시 위치

- 기기 이름 옆, 상단 헤더 영역
- 기기 동작 상태 배지(`IDLE`/`PROCESSING`/`ERROR`) **왼쪽**에 배치

#### 시각적 표현

```tsx
{
  latestSession && (
    <View
      style={[
        styles.statusBadge,
        latestSession.status === 'in_progress'
          ? styles.sessionBadgeInProgress // 노란색 배경
          : styles.sessionBadgeCompleted, // 초록색 배경
      ]}
    >
      <Text
        style={{
          color:
            latestSession.status === 'in_progress'
              ? colors.warning // 노란색 텍스트
              : colors.success, // 초록색 텍스트
        }}
      >
        {latestSession.status === 'in_progress' ? '투입 중' : '투입 완료'}
      </Text>
    </View>
  );
}
```

#### 스타일 상세

- **`in_progress` (투입 중)**:
  - 배경색: `colors.warning + '20'` (노란색 반투명, `#f59e0b20`)
  - 텍스트 색상: `colors.warning` (노란색, `#f59e0b`)
  - 텍스트: "투입 중"
  - 크기: `paddingHorizontal: spacing.md`, `paddingVertical: spacing.xs`
  - 모서리: `borderRadius: 12`

- **`completed` (투입 완료)**:
  - 배경색: `colors.success + '20'` (초록색 반투명, `#10b98120`)
  - 텍스트 색상: `colors.success` (초록색, `#10b981`)
  - 텍스트: "투입 완료"
  - 크기: 동일

#### 레이아웃

```
[기기 이름]  [투입 중/투입 완료 배지] [대기 중/처리 중/오류 배지]
```

---

### 2. **홈 화면 - 캐릭터 위 상태 태그**

**위치**: `src/screens/Home/HomeScreen.tsx`

#### 표시 위치

- 한니비 캐릭터 **위쪽**에 배치
- 캐릭터 중심에서 위로 약 80px 떨어진 위치
- 기기 동작 상태 태그와 함께 가로로 나란히 표시

#### 시각적 표현

```tsx
{
  isPaired && latestSession && (
    <View style={styles.statusTagsContainer}>
      {/* 음식 투입 세션 상태 */}
      <View
        style={[
          styles.statusTag,
          latestSession.status === 'in_progress'
            ? styles.sessionTagInProgress
            : styles.sessionTagCompleted,
        ]}
      >
        <Text
          style={{
            color: latestSession.status === 'in_progress' ? colors.warning : colors.success,
          }}
        >
          {latestSession.status === 'in_progress' ? '투입 중' : '투입 완료'}
        </Text>
      </View>

      {/* 기기 동작 상태 (옆에 표시) */}
      {pairedDeviceDetail?.deviceStatus && (
        <View style={styles.statusTag}>
          <Text>처리 중 / 대기 중</Text>
        </View>
      )}
    </View>
  );
}
```

#### 스타일 상세

- **컨테이너**: `flexDirection: 'row'`, `gap: spacing.xs`
- **`in_progress` (투입 중)**:
  - 배경색: `colors.warning + '20'` (노란색 반투명)
  - 텍스트 색상: `colors.warning` (노란색)
  - 텍스트: "투입 중"
- **`completed` (투입 완료)**:
  - 배경색: `colors.success + '20'` (초록색 반투명)
  - 텍스트 색상: `colors.success` (초록색)
  - 텍스트: "투입 완료"

#### 레이아웃

```
        [투입 중/투입 완료] [처리 중/대기 중]
              ⬇️
        [한니비 캐릭터]
```

---

### 3. **기기 상세 화면 - FoodSessionTimeline**

**위치**: `src/components/food/FoodSessionTimeline.tsx`

#### 표시 위치

- 각 세션 카드의 헤더 영역
- 세션 제목("음식 투입 세션") 오른쪽에 배지로 표시

#### 시각적 표현

```tsx
<View style={styles.cardHeader}>
  <View style={styles.cardHeaderLeft}>
    <Text style={styles.cardTitle}>음식 투입 세션</Text>
    <View style={styles.badgeContainer}>
      {session.status === 'in_progress' ? (
        <View style={[styles.badge, styles.badgeInProgress]}>
          <Text style={styles.badgeText}>진행 중</Text>
        </View>
      ) : (
        <View style={[styles.badge, styles.badgeCompleted]}>
          <Text style={styles.badgeText}>완료</Text>
        </View>
      )}
      {session.processingCompletedEvent && (
        <View style={[styles.badge, styles.badgeProcessing]}>
          <Text style={styles.badgeText}>처리 완료</Text>
        </View>
      )}
    </View>
  </View>
  <Text style={styles.cardTime}>{formatRelativeTime(session.startedAt)}</Text>
</View>
```

#### 스타일 상세

- **`in_progress` (진행 중)**:
  - 배경색: `colors.warning + '20'` (노란색 반투명)
  - 텍스트 색상: `colors.text` (검정)
  - 텍스트: "진행 중"
  - 크기: `paddingHorizontal: spacing.sm`, `paddingVertical: spacing.xs`
  - 모서리: `borderRadius: 8`

- **`completed` (완료)**:
  - 배경색: `colors.success + '20'` (초록색 반투명)
  - 텍스트 색상: `colors.text` (검정)
  - 텍스트: "완료"
  - 크기: 동일

- **추가 배지 (처리 완료)**:
  - `processingCompletedEvent`가 있으면 추가로 표시
  - 배경색: `colors.primary + '20'` (초록색 반투명)
  - 텍스트: "처리 완료"

#### 카드 스타일 차이

- **`in_progress` 세션 카드**:
  - 테두리: `borderColor: colors.primary`, `borderWidth: 2` (두꺼운 초록색 테두리)
- **`completed` 세션 카드**:
  - 테두리: 기본 테두리 (`borderColor: colors.border`, `borderWidth: 1`)

#### 레이아웃

```
┌─────────────────────────────────────┐
│ 음식 투입 세션  [진행 중/완료] [처리 완료]  3분 전 │
│                                     │
│ 한 번의 음식 투입이 감지되었어요.      │
│                                     │
│ [확장 시 상세 정보 표시]              │
└─────────────────────────────────────┘
```

---

### 4. **기기 제어 모달 - 최근 음식 투입 기록**

**위치**: `src/components/DeviceControlModal.tsx`

#### 표시 위치

- 모달 내 "최근 음식 투입 기록" 섹션
- 세션 카드 헤더에 배지로 표시

#### 시각적 표현

```tsx
<View style={styles.sessionCard}>
  <View style={styles.sessionHeader}>
    <Text style={styles.sessionTitle}>음식 투입 세션</Text>
    <View style={styles.badgeContainer}>
      {latestSession.status === 'in_progress' ? (
        <View style={[styles.badge, styles.badgeInProgress]}>
          <Text style={styles.badgeText}>진행 중</Text>
        </View>
      ) : (
        <View style={[styles.badge, styles.badgeCompleted]}>
          <Text style={styles.badgeText}>완료</Text>
        </View>
      )}
    </View>
  </View>
  <Text style={styles.sessionTime}>{formatRelativeTime(latestSession.startedAt)}</Text>
  {/* 무게 정보 표시 */}
  {latestSession.weightChange && (
    <View style={styles.weightRow}>
      <Text>투입 전: {latestSession.weightChange.before}g</Text>
      <Text>투입 후: {latestSession.weightChange.after}g</Text>
      <Text>변화량: {latestSession.weightChange.diff}g</Text>
    </View>
  )}
</View>
```

#### 스타일 상세

- **`in_progress` (진행 중)**:
  - 배경색: 노란색 반투명
  - 텍스트: "진행 중"
- **`completed` (완료)**:
  - 배경색: 초록색 반투명
  - 텍스트: "완료"

#### 추가 정보 표시

- 세션 시작 시간 (상대 시간, 예: "3분 전")
- 무게 변화 정보 (투입 전/후/변화량)

---

## 🎨 색상 체계 요약

| 상태              | 배경색                      | 텍스트 색상        | 텍스트                | 사용 위치 |
| ----------------- | --------------------------- | ------------------ | --------------------- | --------- |
| **`in_progress`** | `#f59e0b20` (노란색 반투명) | `#f59e0b` (노란색) | "투입 중" / "진행 중" | 모든 위치 |
| **`completed`**   | `#10b98120` (초록색 반투명) | `#10b981` (초록색) | "투입 완료" / "완료"  | 모든 위치 |

---

## 📊 데이터 흐름

1. **데이터 조회**:

   ```tsx
   const { data: sessions } = useFoodSessions(deviceId);
   const latestSession = sessions && sessions.length > 0 ? sessions[0] : null;
   ```

2. **상태 결정**:
   - `FOOD_INPUT_BEFORE` 이벤트만 있으면 → `status: 'in_progress'`
   - `FOOD_INPUT_AFTER` 또는 `PROCESSING_COMPLETED` 이벤트가 있으면 → `status: 'completed'`

3. **조건부 렌더링**:
   - `latestSession`이 있을 때만 배지 표시
   - `latestSession.status`에 따라 스타일과 텍스트 변경

---

## 🔄 상태 전환 시각화

```
[FOOD_INPUT_BEFORE 이벤트 발생]
         ⬇️
   [세션 시작]
   status: 'in_progress'
   배지: "투입 중" (노란색)
         ⬇️
[FOOD_INPUT_AFTER 또는 PROCESSING_COMPLETED 이벤트 발생]
         ⬇️
   [세션 완료]
   status: 'completed'
   배지: "투입 완료" (초록색)
```

---

## 📱 반응형 및 접근성

- **텍스트 크기**: `typography.sizes.sm` (작은 텍스트)
- **폰트 굵기**: `typography.weights.bold` (굵게)
- **터치 영역**: 배지 자체는 클릭 불가 (FoodSessionTimeline의 카드는 전체 클릭 가능)
- **색상 대비**: 배경색은 반투명(`+ '20'`)으로 가독성 확보

---

## 🎯 주요 특징

1. **일관된 디자인**: 모든 위치에서 동일한 색상 체계 사용
2. **명확한 구분**: 노란색(진행 중) vs 초록색(완료)로 직관적 구분
3. **최신 정보 우선**: `latestSession`만 표시하여 현재 상태에 집중
4. **조건부 표시**: 세션이 있을 때만 배지 표시 (불필요한 빈 공간 방지)
