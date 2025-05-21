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
  // 빌드 시 ESLint 및 TypeScript 오류 무시
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  // 리디렉션 및 리라이트 설정
  async rewrites() {
    const apiUrl = getApiUrl();
    console.log('Current API URL:', apiUrl);

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