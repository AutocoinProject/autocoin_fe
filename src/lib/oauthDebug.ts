// 개발 환경에서만 사용할 디버깅 함수들
if (typeof window !== 'undefined') {
  window.debugOAuth = {
    // localStorage 상태 확인
    checkStorage: () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('=== Storage Check ===');
      console.log('Token:', token ? `${token.substring(0, 20)}...` : 'NULL');
      console.log('User:', user || 'NULL');
      if (user) {
        try {
          console.log('Parsed User:', JSON.parse(user));
        } catch (e) {
          console.error('User parsing error:', e);
        }
      }
      return { token: !!token, user: !!user };
    },

    // localStorage 클리어
    clearStorage: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('✅ Storage cleared');
    },

    // 수동으로 token으로 사용자 정보 가져오기
    fetchUserInfo: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No token found');
        return;
      }

      try {
        const apiUrl = 'http://112.171.131.161:8080';
        console.log('🔍 Fetching user info...');
        const response = await fetch(`${apiUrl}/api/v1/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        if (response.ok) {
          const userData = await response.json();
          console.log('✅ User data:', userData);
          localStorage.setItem('user', JSON.stringify(userData));
          window.location.reload();
        } else {
          const errorText = await response.text();
          console.error('❌ API Error:', errorText);
        }
      } catch (error) {
        console.error('❌ Fetch error:', error);
      }
    },

    // 강제로 사용자 정보 설정 (테스트용)
    setTestUser: () => {
      const testUser = {
        id: 1,
        email: 'test@kakao.com',
        username: '테스트사용자',
        role: 'USER',
        provider: 'kakao'
      };
      localStorage.setItem('user', JSON.stringify(testUser));
      console.log('✅ Test user set');
      window.location.reload();
    }
  };

  console.log(`
🔧 OAuth Debug Tools:
- debugOAuth.checkStorage()  // localStorage 상태 확인  
- debugOAuth.clearStorage()  // localStorage 클리어
- debugOAuth.fetchUserInfo() // 토큰으로 사용자 정보 가져오기
- debugOAuth.setTestUser()   // 테스트 사용자 설정
  `);
}

export {};
