# 프로젝트 구조 개선 가이드

이 문서는 AutoCoin 프론트엔드 프로젝트의 구조 개선에 대한 가이드입니다.

## 새로운 프로젝트 구조

프로젝트는 기능 중심 아키텍처(Feature-Driven Architecture)로 재구성되었습니다. 이 접근 방식은 관련 기능을 함께 그룹화하여 더 나은 코드 조직화와 확장성을 제공합니다.

```
/src
  /app                  # Next.js App Router 페이지
  /features             # 기능별 모듈화된 코드
    /dashboard          # 대시보드 기능
      /api              # 대시보드 API 호출
      /components       # 대시보드 컴포넌트
      /hooks            # 대시보드 관련 커스텀 훅
    /wallet             # 지갑 기능
    /trading            # 거래 기능
    /news               # 뉴스 기능
    /auth               # 인증 기능
    /admin              # 관리자 기능
    /backtest           # 백테스트 기능
  /shared               # 공유 리소스
    /api                # API 클라이언트 및 공통 API 호출
    /components         # 공유 컴포넌트
      /ui               # UI 컴포넌트 (버튼, 모달 등)
      /charts           # 차트 컴포넌트
    /constants          # 상수 값
    /config             # 환경 설정
    /contexts           # Context API 정의
    /hooks              # 공유 커스텀 훅
    /layouts            # 레이아웃 컴포넌트
    /styles             # 글로벌 스타일
    /types              # TypeScript 타입 정의
    /utils              # 유틸리티 함수
```

## 주요 변경사항

1. **기능 중심 구조**
   - 모든 기능별 코드가 `/features` 디렉토리 내에서 각자의 폴더로 그룹화됨
   - 각 기능 폴더는 관련 컴포넌트, API 호출, 훅, 유틸리티를 포함함

2. **공유 리소스 정리**
   - 여러 기능에서 공유하는 코드를 `/shared` 디렉토리로 이동
   - 공통 컴포넌트, 유틸리티, 타입 등이 명확하게 구분됨

3. **Next.js 라우팅 분리**
   - `/app` 디렉토리는 Next.js App Router만을 위해 사용
   - 비즈니스 로직은 `/features`로 이동하여 라우팅과 로직이 분리됨

4. **코드 재사용성 향상**
   - 관심사 분리(Separation of Concerns) 원칙 강화
   - 코드 중복 감소 및 유지보수성 향상

## 코드 가이드라인

### 임포트 패턴

상대 경로 대신 절대 경로를 사용합니다:

```typescript
// 좋음
import { Button } from '@/shared/components/ui/Button';
import { useAuth } from '@/shared/contexts/AuthContext';
import { API_ENDPOINTS } from '@/shared/constants/api';

// 나쁨
import { Button } from '../../../../shared/components/ui/Button';
```

### 새 기능 추가하기

새로운 기능을 추가할 때는:

1. `/features` 디렉토리에 기능 이름의 폴더 생성
2. 필요한 하위 폴더 구조 생성 (components, api, hooks 등)
3. 필요한 경우 `/app` 디렉토리에 해당 기능의 페이지 추가

### 공유 코드 작성하기

여러 기능에서 재사용할 코드를 작성할 때는:

1. `/shared` 디렉토리의 적절한 폴더에 코드 추가
2. 명확한 이름과 문서화를 통해 재사용성 향상

## 이점

1. **확장성** - 새로운 기능을 쉽게 추가할 수 있음
2. **유지보수성** - 관련 코드가 함께 그룹화되어 유지보수가 용이
3. **테스트 용이성** - 기능별로 테스트 가능
4. **협업 개선** - 개발자가 담당 기능에 집중할 수 있음
5. **코드 조직화** - 코드베이스가 커져도 구조적 일관성 유지

## 마이그레이션 진행 상황

현재 몇 가지 예시 파일이 이동되었으며, 점진적으로 나머지 파일들도 이동할 예정입니다. 마이그레이션은 기존 기능을 손상시키지 않도록 단계적으로 진행됩니다.
