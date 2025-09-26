module.exports = {
  root: true,
  extends: ['@react-native'],
  rules: {
    // React Native 최적화 규칙
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': 'warn',

    // React 규칙
    'react/react-in-jsx-scope': 'off', // React 17+ 에서는 불필요
    'react-hooks/exhaustive-deps': 'warn',

    // 일반 규칙
    'prefer-const': 'warn',
    'no-console': 'warn',
    'no-debugger': 'error',
  },
  ignorePatterns: [
    'node_modules/',
    'android/',
    'ios/',
    'dist/',
    'build/',
    '*.config.js',
    'metro.config.js',
    'babel.config.js',
  ],
};
