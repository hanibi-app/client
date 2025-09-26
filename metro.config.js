const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration for React Native
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    // 플랫폼별 확장자 우선순위
    platforms: ['ios', 'android', 'native', 'web'],
  },
  transformer: {
    // SVG 지원 등 추가 변환기 설정 가능
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  // 성능 최적화
  watchFolders: [
    path.resolve(__dirname, 'src'),
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
