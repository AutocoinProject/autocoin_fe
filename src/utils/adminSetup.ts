// 개발 환경에서 관리자 권한을 부여하는 유틸리티

export const setAdminRole = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      userData.role = 'ADMIN';
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('✅ 관리자 권한이 부여되었습니다:', userData);
      alert('관리자 권한이 부여되었습니다. 페이지를 새로고침하세요.');
    } catch (error) {
      console.error('사용자 데이터 파싱 실패:', error);
    }
  } else {
    console.log('❌ 로그인된 사용자가 없습니다.');
    alert('먼저 로그인하세요.');
  }
};

export const removeAdminRole = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      userData.role = 'USER';
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('✅ 일반 사용자 권한으로 변경되었습니다:', userData);
      alert('일반 사용자 권한으로 변경되었습니다. 페이지를 새로고침하세요.');
    } catch (error) {
      console.error('사용자 데이터 파싱 실패:', error);
    }
  } else {
    console.log('❌ 로그인된 사용자가 없습니다.');
  }
};

// 브라우저 콘솔에서 사용할 수 있도록 전역 객체에 추가
if (typeof window !== 'undefined') {
  (window as any).adminSetup = {
    setAdminRole,
    removeAdminRole
  };
}
