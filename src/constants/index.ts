// Application constants

export const APP_NAME = 'Game App';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const STORAGE_KEYS = {
  THEME: 'theme',
  USER: 'user',
  TOKEN: 'token',
} as const;
