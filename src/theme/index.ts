/**
 * 테마 관련 exports
 */

export { lightTheme } from './light';
export { darkTheme } from './dark';
export { SemanticTokens } from './tokens';

// useTheme 훅 구현
import { useColorScheme } from 'react-native';

import { lightTheme, darkTheme } from './light';

export function useTheme() {
  const colorScheme = useColorScheme();
  const tokens = colorScheme === 'dark' ? darkTheme : lightTheme;

  return { tokens };
}
