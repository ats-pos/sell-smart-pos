// Configuration management
export const config = {
  // API Configuration
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true' || false,
  api: {
    graphql: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://indyzgql-api.netlify.app/graphql',
    rest: import.meta.env.VITE_REST_ENDPOINT || 'http://api.indyzai.com/api'
  },
  
  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'SPM-POS',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0'
  },

  // Development flags
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Runtime configuration toggle (for testing/demo purposes)
export const toggleMockMode = () => {
  const currentMode = localStorage.getItem('FORCE_MOCK_MODE');
  const newMode = currentMode === 'true' ? 'false' : 'true';
  localStorage.setItem('FORCE_MOCK_MODE', newMode);
  window.location.reload();
};

export const isMockMode = (): boolean => {
  const forceMock = localStorage.getItem('FORCE_MOCK_MODE');
  return forceMock === 'true' || config.useMockData;
};