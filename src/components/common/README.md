# 공용 컴포넌트 가이드

## 원칙

- 일관성 우선: Props·이벤트·네이밍을 공통 규칙으로 통일합니다.
- 기본 접근성: 라벨·역할·포커스 동작을 기본 제공하고 누락을 방지합니다.
- 테마 기반: 색상·간격·타이포는 `src/theme` 토큰만 사용합니다.
- 최소 필수값: 필수 Props는 최소화하고 합리적인 기본값을 제공합니다.
- 테스트 용이성: 최상위 요소에 안정적인 `testID`를 제공합니다.

## 폴더 구조와 네이밍

- 위치
  - `src/components/common`: 도메인에 중립적인 앱 공용 컴포넌트
  - `src/components/ui`: 더 저수준의 프리미티브(표현 중심)
- 파일: `ComponentName.tsx`
- 테스트: 인접 `__tests__/ComponentName.test.tsx`
- 내보내기: 컴포넌트는 default, 타입/헬퍼는 named export

## Props 규칙

- 필수/옵션: 필수는 최소화, 기본값은 JSDoc로 명시
- 이벤트: `onPress`, `onChange`, `onToggle`, `onConfirm` (현재형)
- 시각 변형: `variant`(`primary`, `secondary`, `ghost` 등)
- 크기: `size`(`sm`, `md`, `lg`)
- 접근성: `accessibilityLabel`, `accessibilityHint`, 키보드 포커스 고려
- 테스트: 최상위 요소에 `testID` 부여, 필요 시 하위로 전달
- 스타일: 하드코딩 금지, `src/theme` 토큰만 사용

## 테마 토큰 사용법

- Colors: `src/theme/Colors.ts`에서 의미 기반 키(`colors.primary`, `colors.text`) 사용
- Spacing: `spacing.sm`, `spacing.md`와 같은 스케일 값 사용
- Typography: `typography.sizes`, `typography.weights` 사용, 숫자 하드코딩 지양
- 다크/고대비: 의미 기반 색상 키를 사용해 테마 전환을 대비

예시:

```
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const styles = StyleSheet.create({
  container: { padding: spacing.md, backgroundColor: colors.background },
  label: { color: colors.text, fontSize: typography.sizes.sm },
});
```

## AppButton 변형과 크기

| Prop        | 값          | 기본값    | 비고                                     |
| ----------- | ----------- | --------- | ---------------------------------------- |
| `variant`   | `primary`   | `primary` | 테마 색상 사용                           |
|             | `secondary` |           | `colors.secondary` 배경/테두리           |
|             | `ghost`     |           | 투명 배경, 텍스트 색상만 적용            |
| `size`      | `sm`        | `md`      | 높이/패딩/라운드가 `spacing`에 따라 변경 |
|             | `md`        |           | 권장 기본(44px 이상 터치 타깃)           |
|             | `lg`        |           | 큰 터치 타깃                             |
| `loading`   | `boolean`   | `false`   | 누름 비활성 + 스피너 표시                |
| `leftIcon`  | `ReactNode` | -         | 라벨 앞에 렌더                           |
| `rightIcon` | `ReactNode` | -         | 라벨 뒤에 렌더                           |

사용 예시:

```
<AppButton label="저장" onPress={save} />
<AppButton label="더보기" variant="ghost" size="sm" onPress={loadMore} />
<AppButton label="제출" loading onPress={submit} />
```

## 마이그레이션 가이드

- Button → AppButton
  - `size`, `variant`, `loading`, `leftIcon`, `rightIcon` 지원
  - 커스텀 스피너/비활성 로직은 내장 `loading`으로 대체

- InputField
  - `label`, `helperText`, `errorText`, `isPassword` 추가
  - 개별 화면의 임시 에러 라벨을 `errorText`로 통일
  - 스크린리더는 `accessibilityState.invalid` 혜택

- SwitchRow
  - 행 전체 탭으로 토글 가능(래퍼 불필요)
  - `accessibilityRole="switch"`, `accessibilityState.checked` 사용

- 레이아웃/키보드
  - `KeyboardAwareContainer`의 `contentPadding`, `extraKeyboardOffset` 사용
  - `@/utils/layout`의 `getContentPadding()`으로 패딩 계산

---

- AppButton:

```
<AppButton label="저장" variant="primary" onPress={() => {}} />
```

- AppHeader:

```
<AppHeader title="설정" onBack={() => {}} />
```

- BottomTabBar:

```
<BottomTabBar tabs={["홈","설정"]} activeTab="홈" onChangeTab={() => {}} />
```

- InfoCard:

```
<InfoCard title="온도" value={24} unit="°C" />
```

- AlertBanner:

```
<AlertBanner type="info" message="알림 메시지" />
```

- ModalPopup:

```
<ModalPopup visible title="확인" description="저장할까요?" onCancel={()=>{}} onConfirm={()=>{}} />
```

- SwitchRow:

```
<SwitchRow label="알림" value onToggle={()=>{}} />
```

- InputField:

```
<InputField value="" onChangeText={()=>{}} placeholder="입력" />
```

- ToastMessage:

```
<ToastMessage type="success" message="완료" />
```

- IconButton:

```
<IconButton icon={<Text>☆</Text>} onPress={()=>{}} />
```

- Divider:

```
<Divider />
```
