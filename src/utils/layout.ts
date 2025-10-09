import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/theme/spacing';

export function useKeyboardOffsets(options?: { includeBottomInset?: boolean; extraOffset?: number }): { keyboardVerticalOffset: number } {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const includeBottomInset = options?.includeBottomInset ?? false;
  const extraOffset = options?.extraOffset ?? 0;
  const keyboardVerticalOffset = headerHeight + (includeBottomInset ? insets.bottom : 0) + extraOffset;
  return { keyboardVerticalOffset };
}

export type PaddingPreset = 'none' | 'sm' | 'md' | 'lg';

export function getContentPadding(preset: PaddingPreset = 'md'): number {
  switch (preset) {
    case 'none':
      return 0;
    case 'sm':
      return spacing.sm;
    case 'lg':
      return spacing.lg;
    default:
      return spacing.md;
  }
}


