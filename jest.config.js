module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(((jest-)?react-native|@react-native|react-native-.*|@react-navigation/.*|expo(nent)?|@expo/.*|expo-.*|react-native-svg)/))',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/?(*.)+(test).tsx'],
};
