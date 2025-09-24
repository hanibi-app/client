import Config from 'react-native-config';

// Environment configuration using react-native-config
export const AppConfig = {
  API_BASE_URL: Config.API_BASE_URL || 'https://api.example.com',
  APP_ENV: Config.APP_ENV || 'development',
  DEBUG: Config.DEBUG === 'true' || __DEV__,
} as const;

// Export individual constants for convenience
export const API_BASE_URL = AppConfig.API_BASE_URL;
export const APP_ENV = AppConfig.APP_ENV;
export const DEBUG = AppConfig.DEBUG;
