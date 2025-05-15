/** @type {import('next').NextConfig} */

// 환경별 API 주소 설정
const getApiUrl = () => {
  switch (process.env.NEXT_PUBLIC_ENV) {
    case 'development':
      return 'http://dev-api.autocoin.com';
    case 'production':
      return 'http://api.autocoin.com';
    default: // local
      return 'http://localhost:8080';
  }
};

const nextConfig = {
  // Turbopack 비활성화
  experimental: {
    turbo: false
  },
  async rewrites() {
    const apiUrl = getApiUrl();
    console.log('Current API URL:', apiUrl); // 현재 사용 중인 API URL 로깅

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig; 