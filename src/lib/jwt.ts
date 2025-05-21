// JWT 토큰 디코딩 및 만료 확인 유틸리티

export function decodeJWT(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

export function getTokenExpiry(token: string): Date | null {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return null;
  }
  
  return new Date(decoded.exp * 1000);
}

export function getTokenInfo(token: string): {
  valid: boolean;
  expired: boolean;
  expiryDate: Date | null;
  payload: any;
} {
  if (!token) {
    return {
      valid: false,
      expired: true,
      expiryDate: null,
      payload: null
    };
  }

  const payload = decodeJWT(token);
  const expired = isTokenExpired(token);
  const expiryDate = getTokenExpiry(token);

  return {
    valid: !!payload,
    expired,
    expiryDate,
    payload
  };
}
