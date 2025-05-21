// 브라우저 콘솔에서 사용할 수 있는 디버깅 함수들

// 전역 스코프에 디버깅 함수들 추가
if (typeof window !== 'undefined') {
  // 안전한 localStorage 접근을 위한 함수
  window.debugAuth = {
    // 사용자 정보 확인
    getUser: () => {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        console.log('❌ No user data found in localStorage');
        return null;
      }
      try {
        const user = JSON.parse(userStr);
        console.log('✅ User data:', user);
        return user;
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        console.log('Raw user data:', userStr);
        return null;
      }
    },

    // 토큰 확인
    getToken: () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('❌ No authToken found in localStorage');
        return null;
      }
      console.log('✅ AuthToken found (first 50 chars):', token.substring(0, 50) + '...');
      return token;
    },

    // 모든 인증 정보 확인
    checkAll: () => {
      console.group('🔍 Authentication Debug Info');
      
      const token = window.debugAuth.getToken();
      const user = window.debugAuth.getUser();
      
      console.log('📊 Summary:');
      console.log('- Token exists:', !!token);
      console.log('- User data exists:', !!user);
      console.log('- Auth appears valid:', !!(token && user));
      
      console.groupEnd();
      
      return { token: !!token, user: !!user, valid: !!(token && user) };
    },

    // 인증 정보 초기화
    clearAuth: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      console.log('✅ Authentication data cleared');
      console.log('🔄 Reload the page to see changes');
    },

    // 토큰 상세 정보 확인
    checkToken: () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('❌ No authToken found');
        return null;
      }

      try {
        // JWT 디코딩
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.error('❌ Invalid JWT format');
          return null;
        }

        const payload = JSON.parse(atob(parts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp ? payload.exp < currentTime : false;
        const expiryDate = payload.exp ? new Date(payload.exp * 1000) : null;

        console.group('🔍 Token Analysis');
        console.log('✓ Token format: Valid');
        console.log('✓ Payload:', payload);
        console.log('✓ Expired:', isExpired);
        console.log('✓ Expiry date:', expiryDate?.toLocaleString() || 'No expiry');
        console.log('✓ Current time:', new Date().toLocaleString());
        if (payload.exp) {
          const timeLeft = payload.exp - currentTime;
          console.log('✓ Time left:', timeLeft > 0 ? `${Math.floor(timeLeft / 60)} minutes` : 'Expired');
        }
        console.groupEnd();

        return {
          valid: true,
          expired: isExpired,
          payload,
          expiryDate
        };
      } catch (error) {
        console.error('❌ Token parsing error:', error);
        return null;
      }
    },
    // API 테스트
    testApi: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('❌ No authToken found. Cannot test API.');
        return;
      }

      try {
        console.log('🔄 Testing /api/v1/auth/me...');
        const response = await fetch('/api/v1/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('✅ API Test successful:', userData);
          return userData;
        } else {
          const errorText = await response.text();
          console.error('❌ API Test failed:', response.status, response.statusText);
          console.error('Error details:', errorText);
          return null;
        }
      } catch (error) {
        console.error('❌ API Test error:', error);
        return null;
      }
    },

    // localStorage 전체 내용 확인
    checkStorage: () => {
      console.group('📦 LocalStorage Contents');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          console.log(`${key}:`, value);
        }
      }
      console.groupEnd();
    }
  };

  // 사용법 안내
  console.log(`
🔧 Authentication Debug Tools Available:

• debugAuth.getUser()      - 저장된 사용자 정보 확인
• debugAuth.getToken()     - 저장된 토큰 확인  
• debugAuth.checkToken()   - 토큰 상세 대시보드 (만료 여부 포함)
• debugAuth.checkAll()     - 모든 인증 정보 확인
• debugAuth.clearAuth()    - 인증 정보 초기화
• debugAuth.testApi()      - API 엔드포인트 테스트
• debugAuth.checkStorage() - localStorage 전체 내용 확인

예시: 
- debugAuth.checkToken()  // 토큰 만료 여부 확인
- debugAuth.clearAuth()   // 인증 정보 초기화 후 다시 로그인
  `);
}

export {};
