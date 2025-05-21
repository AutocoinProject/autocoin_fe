/** @type {import('next').NextConfig} */

// 환경별 API 주소 설정
const getApiUrl = () => {
  // 환경변수를 우선적으로 사용
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 환경변수가 없을 경우 기본 설정 사용
  switch (process.env.NEXT_PUBLIC_ENV) {
    case 'development':
      return 'http://dev-api.autocoin.com';
    case 'production':
      return 'http://api.autocoin.com';
    default: // local
      return 'http://172.30.1.10:8080';
  }
};

const nextConfig = {
  // Next.js 재정의
  eslint: {
    ignoreDuringBuilds: true // 빌드 중에는 ESLint 검사 무시
  },
  typescript: {
    ignoreBuildErrors: true // 빌드 중에는 TypeScript 검사 무시
  },
  experimental: {},
  async rewrites() {
    const apiUrl = getApiUrl();
    console.log('Current API URL:', apiUrl); // 현재 사용 중인 API URL 로깅

    // CORS 이슈를 해결하기 위한 프록시 설정
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: '/auth/:path*',
        destination: `${apiUrl}/auth/:path*`,
      },
    ];
  },
};

module.exports = nextConfig; 