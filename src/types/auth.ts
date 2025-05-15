// API 응답 타입 정의
export interface UserInfo {
  id: number;
  email: string;
  username: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  provider?: string | null;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export interface SignUpResponse {
  message: string;
  user: UserInfo;
}

export interface ErrorResponse {
  code: string;
  message: string;
}

// 에러 코드 상수
export const ERROR_CODES = {
  EMAIL_DUPLICATED: 'U001',
  USER_NOT_FOUND: 'U002',
  EMAIL_NOT_FOUND: 'U003',
  INVALID_CREDENTIALS: 'U004',
  INVALID_INPUT: 'C001',
  METHOD_NOT_ALLOWED: 'C002',
  ENTITY_NOT_FOUND: 'C003',
  SERVER_ERROR: 'S001',
  INVALID_TYPE: 'C005',
  ACCESS_DENIED: 'C006',
  ALREADY_LOGGED_IN: 'U005',
  LOGIN_REQUIRED: 'U006',
  DATABASE_ERROR: 'S002',
  AUTHENTICATION_FAILED: 'A001',
  TOKEN_EXPIRED: 'A002',
  UNAUTHORIZED: 'A003',
} as const;

// 에러 메시지 매핑
export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.EMAIL_DUPLICATED]: '이미 사용 중인 이메일입니다.',
  [ERROR_CODES.USER_NOT_FOUND]: '사용자를 찾을 수 없습니다.',
  [ERROR_CODES.EMAIL_NOT_FOUND]: '해당 이메일로 등록된 계정을 찾을 수 없습니다.',
  [ERROR_CODES.INVALID_CREDENTIALS]: '이메일 또는 비밀번호가 일치하지 않습니다.',
  [ERROR_CODES.INVALID_INPUT]: '입력값이 올바르지 않습니다.',
  [ERROR_CODES.METHOD_NOT_ALLOWED]: '허용되지 않은 요청입니다.',
  [ERROR_CODES.ENTITY_NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
  [ERROR_CODES.SERVER_ERROR]: '서버 오류가 발생했습니다.',
  [ERROR_CODES.INVALID_TYPE]: '잘못된 타입의 값입니다.',
  [ERROR_CODES.ACCESS_DENIED]: '접근이 거부되었습니다.',
  [ERROR_CODES.ALREADY_LOGGED_IN]: '이미 로그인되어 있습니다.',
  [ERROR_CODES.LOGIN_REQUIRED]: '로그인이 필요합니다.',
  [ERROR_CODES.DATABASE_ERROR]: '데이터베이스 오류가 발생했습니다.',
  [ERROR_CODES.AUTHENTICATION_FAILED]: '인증에 실패했습니다.',
  [ERROR_CODES.TOKEN_EXPIRED]: '토큰이 만료되었습니다.',
  [ERROR_CODES.UNAUTHORIZED]: '권한이 없습니다.',
}; 