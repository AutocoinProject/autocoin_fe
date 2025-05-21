# 환경 변수 설정 가이드

AutoCoin 프로젝트에서 사용하는 환경 변수 설정 가이드입니다.

## 환경 변수 파일 개요

프로젝트에서는 다음 환경 변수 파일들을 사용합니다:

- `.env.development`: 개발 환경을 위한 기본 설정
- `.env.production`: 프로덕션 환경을 위한 기본 설정
- `.env.staging`: 스테이징 환경을 위한 기본 설정
- `.env.local`: 모든 환경에서 사용되는 개인 로컬 설정 (git에 커밋되지 않음)
- `.env.local.example`: 로컬 설정 예시 파일 (이 파일을 복사하여 `.env.local` 생성)

## 주요 환경 변수 설명

### API 연결 설정
```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_API_PREFIX=/api/v1
```
API 서버 연결을 위한 기본 URL과 경로 접두사입니다.

### 디버깅 관련 설정
```
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
```
디버깅 모드 활성화 및 로그 레벨을 설정합니다. 프로덕션에서는 `DEBUG_MODE=false`, `LOG_LEVEL=error`로 설정하세요.

### 데이터 설정
```
NEXT_PUBLIC_USE_MOCK_NEWS=true
NEXT_PUBLIC_MOCK_DELAY=1000
```
개발 시 모의 데이터 사용 여부와 API 지연 시간을 설정합니다.

### 성능 관련 설정
```
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_REFRESH_INTERVAL=30000
NEXT_PUBLIC_CACHE_MAX_AGE=3600
```
API 요청 타임아웃, 자동 새로고침 간격, 캐시 수명을 설정합니다.

### CDN 및 미디어 설정
```
NEXT_PUBLIC_USE_CDN=true
NEXT_PUBLIC_CDN_URL=https://cdn.example.com
```
CDN 사용 여부와 URL을 설정합니다.

### 분석 및 에러 보고
```
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_ERROR_REPORTING_ENABLED=true
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/project-id
```
애널리틱스 활성화 여부, 에러 보고 설정, Sentry DSN을 설정합니다.

## 환경별 빌드 및 실행 방법

### 개발 환경

```bash
# 개발 서버 시작 (개발 환경 변수 사용)
npm run dev
```

### 스테이징 환경

```bash
# 스테이징 환경으로 빌드
NODE_ENV=staging npm run build

# 스테이징 환경으로 실행
NODE_ENV=staging npm run start
```

### 프로덕션 환경

```bash
# 프로덕션용 빌드
npm run build

# 프로덕션 실행
npm run start
```

## Vercel 배포 시 환경 변수 설정

Vercel에 배포할 때는 각 환경(프로덕션, 프리뷰, 개발)별로 환경 변수를 설정할 수 있습니다:

1. Vercel 대시보드에서 프로젝트 선택
2. "Settings" 탭으로 이동
3. "Environment Variables" 섹션 열기
4. 필요한 환경 변수 추가
5. 각 환경 변수마다 적용될 환경 선택 (Production, Preview, Development)

## 중요 참고사항

- `NEXT_PUBLIC_` 접두사가 붙은 환경 변수만 클라이언트 측 코드에서 접근할 수 있습니다.
- 민감한 정보(API 키, 비밀번호 등)는 절대 `NEXT_PUBLIC_` 접두사를 사용하지 마세요.
- 새로운 환경 변수를 추가할 때는 `.env.local.example` 파일도 업데이트하세요.
- 로컬 개발용 `.env.local` 파일은 개인 설정을 위한 것으로, 절대 Git에 커밋하지 마세요.
