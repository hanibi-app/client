# Common Components

## Principles
- Consistency first: follow shared API patterns for props, events, and naming.
- Accessibility by default: provide labels, roles, and focus behavior out of the box.
- Theme-driven: use tokens from `src/theme` for colors, spacing, and typography.
- Minimal surface: keep required props small; sensible defaults for the rest.
- Testable: expose stable `testID` on the outermost interactive/root element.

## Folder Structure & Naming
- Location
  - `src/components/common`: domain-agnostic, app-specific primitives/compounds
  - `src/components/ui`: low-level primitives that may be purely presentational
- Filenames: `ComponentName.tsx`
- Tests: `ComponentName.test.tsx` in `__tests__` sibling folder
- Exports: default export for component, named exports for types/helpers

## Props Conventions
- Required vs optional: keep required minimal; document defaults in JSDoc
- Event handlers: `onPress`, `onChange`, `onToggle`, `onConfirm` (present tense)
- Visual variants: `variant` (e.g., `primary`, `secondary`, `ghost`, `destructive`)
- Size: `size` (e.g., `sm`, `md`, `lg`)
- Accessibility: `accessibilityLabel`, `accessibilityHint`, keyboard focus support
- Testing: `testID` on the outermost element; forward to underlying native element if needed
- Styling: no inline magic values; consume tokens from `src/theme`

## Theme Tokens Usage
- Colors: import from `src/theme/Colors.ts` and reference by semantic keys (e.g., `colors.primary`, `colors.text`)
- Spacing: import `spacing` and use scale values (`spacing.sm`, `spacing.md`)
- Typography: use `typography.sizes` and `typography.weights`; avoid hard-coded font sizes
- Dark/High-contrast: prefer semantic color keys to enable future theme switching

Example:
```
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const styles = StyleSheet.create({
  container: { padding: spacing.md, backgroundColor: colors.background },
  label: { color: colors.text, fontSize: typography.sizes.sm },
});
```

## Variants & Sizes (AppButton)

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `primary` | `primary` | use semantic variant, colors from theme |
|  | `secondary` |  | border/background uses `colors.secondary` |
|  | `ghost` |  | transparent, text uses `colors.ghostForeground` |
| `size` | `sm` | `md` | height/padding/radius scale with `spacing` |
|  | `md` |  | balanced touch target (>=44px) |
|  | `lg` |  | larger target and padding |
| `loading` | `boolean` | `false` | disables press, shows spinner |
| `leftIcon` | `ReactNode` | - | rendered before label |
| `rightIcon` | `ReactNode` | - | rendered after label |

Usage examples:
```
<AppButton label="저장" onPress={save} />
<AppButton label="더보기" variant="ghost" size="sm" onPress={loadMore} />
<AppButton label="제출" loading onPress={submit} />
```

## Migration Guide

- Button → AppButton
  - before: `AppButton label` only supported basic props
  - now: add `size`, `variant`, `loading`, `leftIcon`, `rightIcon`
  - replace any custom spinner/disabled logic with built-in `loading`

- InputField
  - add `label`, `helperText`, `errorText`, `isPassword`
  - remove ad-hoc error labels near inputs; use `errorText`
  - screen reader benefits from `accessibilityState.invalid`

- SwitchRow
  - row is now pressable; remove custom wrappers used to toggle
  - rely on `accessibilityRole="switch"` and `accessibilityState.checked`

- Layout & Keyboard
  - use `KeyboardAwareContainer` with `contentPadding` and `extraKeyboardOffset`
  - compute padding with `getContentPadding()` from `@/utils/layout`

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
