// Service configuration
export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
    enableLogging: import.meta.env.VITE_ENABLE_API_LOGGING === 'true',
  },
  
  // Feature flags
  features: {
    enableDevTools: import.meta.env.DEV,
    enableRequestLogging: import.meta.env.DEV,
    enableErrorReporting: true,
  },
  
  // Cache configuration
  cache: {
    defaultStaleTime: 5 * 60 * 1000, // 5 minutes
    defaultGcTime: 10 * 60 * 1000,   // 10 minutes
    maxRetries: 3,
  },
} as const;
