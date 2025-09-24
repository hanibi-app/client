// Environment configuration
// Note: react-native-config will be configured in later commit
export const Config = {
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.example.com',
  APP_ENV: process.env.APP_ENV || 'development',
  DEBUG: process.env.DEBUG === 'true' || __DEV__,
} as const;

// Export individual constants for convenience
export const API_BASE_URL = Config.API_BASE_URL;
export const APP_ENV = Config.APP_ENV;
export const DEBUG = Config.DEBUG;
