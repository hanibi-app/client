import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useKeyboardOffsets(): { keyboardVerticalOffset: number } {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const keyboardVerticalOffset = headerHeight + insets.bottom;
  return { keyboardVerticalOffset };
}


