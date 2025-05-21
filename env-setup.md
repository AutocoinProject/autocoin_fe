# 환경 변수 설정 가이드

AutoCoin 프로젝트는 다양한 환경(개발, 스테이징, 프로덕션)에 맞게 환경 변수를 관리합니다.

## 환경 변수 파일 개요

- `.env.development`: 개발 환경을 위한 환경 변수
- `.env.staging`: 스테이징(테스트) 환경을 위한 환경 변수
- `.env.production`: 프로덕션 환경을 위한 환경 변수
- `.env.local`: 모든 환경에서 사용되는 로컬 오버라이드 (git에 추가되지 않음)
- `.env.local.example`: 환경 변수 설정 예시 (새 개발자를 위한 가이드)

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
NODE_ENV=production npm run build

# 프로덕션 실행
NODE_ENV=production npm run start
```

## Vercel에 배포할 때 환경 변수 설정

Vercel에 배포할 때는 각 환경(프로덕션, 프리뷰, 개발)별로 환경 변수를 설정할 수 있습니다:

1. Vercel 대시보드에서 프로젝트 선택
2. "Settings" 탭으로 이동
3. "Environment Variables" 섹션 열기
4. 필요한 환경 변수 추가
5. 각 환경 변수마다 적용될 환경 선택 (Production, Preview, Development)

## 로컬 개발 시 환경 변수 오버라이드

특정 환경 변수를 로컬에서만 오버라이드하려면 `.env.local` 파일을 사용하세요. 이 파일은 git에 커밋되지 않으므로 안전하게 민감한 정보를 포함할 수 있습니다.

```bash
# .env.local 예시
NEXT_PUBLIC_API_URL=http://my-local-api:3000
```

## 중요 참고사항

- `NEXT_PUBLIC_` 접두사가 붙은 환경 변수만 클라이언트 측 코드에서 접근할 수 있습니다.
- 민감한 정보(API 키, 비밀번호 등)는 절대 `NEXT_PUBLIC_` 접두사를 사용하지 마세요.
- 새로운 환경 변수를 추가할 때는 `.env.local.example` 파일도 업데이트하세요.
