type Environment = 'local' | 'development' | 'production';

interface EnvironmentConfig {
  apiBaseUrl: string;
  environment: Environment;
  isDevelopment: boolean;
  isProduction: boolean;
}

const getEnvironment = (): Environment => {
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }
  if (process.env.NEXT_PUBLIC_ENV === 'development') {
    return 'development';
  }
  return 'local';
};

const environment = getEnvironment();

const config: EnvironmentConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  environment,
  isDevelopment: environment === 'development',
  isProduction: environment === 'production',
};

// 환경별 추가 설정
const environmentConfigs: Record<Environment, Partial<EnvironmentConfig>> = {
  local: {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://112.171.131.161:8080',
  },
  development: {
    apiBaseUrl: 'http://dev-api.autocoin.com',
  },
  production: {
    apiBaseUrl: 'http://api.autocoin.com',
  },
};

// 현재 환경의 설정을 적용
Object.assign(config, environmentConfigs[environment]);

export default config;