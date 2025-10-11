/**
 * 테마 관련 exports
 */

import * as React from 'react';
import { createContext, ReactNode } from 'react';

import { useColorScheme } from 'react-native';

import { darkTheme } from './dark';
import { lightTheme } from './light';
import { SemanticTokens } from './tokens';

export { lightTheme } from './light';
export { darkTheme } from './dark';
export { SemanticTokens } from './tokens';

// useTheme 훅 구현
export function useTheme() {
  const colorScheme = useColorScheme();
  const tokens = colorScheme === 'dark' ? darkTheme : lightTheme;

  return { tokens };
}

// ThemeProvider 구현

interface ThemeContextType {
  tokens: SemanticTokens;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { tokens } = useTheme();

  return React.createElement(ThemeContext.Provider, { value: { tokens } }, children);
}
