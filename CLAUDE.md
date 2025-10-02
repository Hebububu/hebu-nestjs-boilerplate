# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

NestJS 기반의 백엔드 보일러플레이트입니다. PostgreSQL과 Prisma ORM을 사용하며, Winston 로깅, 환경변수 검증, Swagger API 문서화, 헬스체크 등의 기능을 제공합니다.

## 주요 명령어

### 개발 환경 설정
```bash
# 환경변수 설정 (.env.example 참고)
cp .env.example .env

# 의존성 설치
npm install

# Prisma 초기화
npm run prisma:generate        # Prisma Client 생성
npm run prisma:db-push         # 데이터베이스 스키마 동기화
npm run prisma:seed            # 시드 데이터 삽입 (선택사항)
```

### 개발 및 실행
```bash
npm run dev                    # 개발 모드 실행 (watch 모드)
npm run build                  # 프로덕션 빌드
npm run start                  # 프로덕션 모드 실행
```

### 코드 품질
```bash
npm run lint                   # ESLint 실행 (자동 수정 포함)
npm run format                 # Prettier 포맷팅
npm run format:check           # 포맷팅 검사만 수행
npm run tsc                    # 타입 체크 (빌드 없이)
```

### 테스트
```bash
npm run test                   # 단위 테스트 실행
npm run test:watch             # 테스트 watch 모드
npm run test:cov               # 테스트 커버리지 확인
npm run test:e2e               # E2E 테스트 실행
npm run test:debug             # 테스트 디버그 모드
```

### Prisma 관리
```bash
npm run prisma:studio          # Prisma Studio 실행 (DB GUI)
npm run prisma:generate        # Prisma Client 재생성
npm run prisma:db-push         # 스키마 변경사항 데이터베이스에 적용
```

## 아키텍처 구조

### 모듈 구조
이 프로젝트는 NestJS의 모듈 기반 아키텍처를 따릅니다:

- **AppModule** (src/app.module.ts): 루트 모듈로 모든 하위 모듈을 통합
- **ConfigModule** (src/config/config.module.ts): 환경변수 검증 및 설정 관리를 담당하는 글로벌 모듈
- **LoggerModule** (src/logger/logger.module.ts): Winston 기반 로깅 시스템
- **SwaggerModule** (src/swagger/swagger.module.ts): Swagger API 문서화 모듈
- **PrismaModule** (src/common/prisma/prisma.module.ts): 데이터베이스 접근 계층
- **Feature Modules** (src/modules/): 비즈니스 로직별 독립 모듈 (예: HealthModule)

### 설정 패턴 (Config Pattern)
설정은 도메인별로 분리되어 관리됩니다:

```
src/config/
├── config.module.ts           # 설정 모듈 통합
├── env/env.validation.ts      # Joi 기반 환경변수 검증 스키마
├── app/
│   ├── app.config.ts         # 앱 설정 로드 함수
│   └── app-config.service.ts # 앱 설정 서비스 (타입 안전한 접근)
├── auth/
│   ├── auth.config.ts
│   └── auth-config.service.ts
├── database/
│   ├── database.config.ts
│   └── database-config.service.ts
└── swagger/
    ├── swagger.config.ts
    └── swagger-config.service.ts
```

**중요**:
- 모든 환경변수는 필수(required)이며, default 값을 사용하지 않습니다
- 환경변수가 누락된 경우 애플리케이션 시작 시 오류가 발생합니다
- 새로운 환경변수를 추가할 때는 반드시:
  1. `src/config/env/env.validation.ts`에 Joi 검증 스키마 추가 (`.required()` 사용)
  2. 해당 도메인의 `*.config.ts` 파일에 설정 로드 로직 추가 (non-null assertion `!` 사용)
  3. `*-config.service.ts`에 타입 안전한 getter 메서드 추가
  4. `.env.example` 파일에 예시 값 추가

### Path Aliases
TypeScript Path Mapping을 사용하여 깔끔한 import를 지원합니다:

```typescript
@/*         → src/*
@common/*   → src/common/*
@modules/*  → src/modules/*
@config/*   → src/config/*
@logger/*   → src/logger/*
@swagger/*  → src/swagger/*
```

**예시**:
```typescript
import { LoggerService } from '@logger/logger.service';
import { PrismaService } from '@common/prisma/prisma.service';
import { SwaggerService } from '@swagger/swagger.service';
import { AppConfigService } from '@config/app/app-config.service';
```

### 로깅 시스템
Winston과 nest-winston을 사용한 구조화된 로깅:

- 콘솔 로그 (개발 환경)
- 파일 로그 with 일별 로테이션 (`logs/` 디렉토리)
- 레벨별 파일 분리 (error, info, debug)
- HTTP 요청/응답 자동 로깅 (`HttpLoggingInterceptor`)

로거는 `LoggerService`를 통해 주입받아 사용:
```typescript
constructor(private readonly logger: LoggerService) {}

this.logger.log('메시지', 'Context');
this.logger.error('에러 메시지', 'trace', 'Context');
```

### 전역 설정 (src/main.ts)
- API 글로벌 prefix: `/api`
- Timezone: `Asia/Seoul`
- ValidationPipe: whitelist, transform 활성화
- CORS: `ALLOWED_ORIGINS` 환경변수 기반
- Swagger: 환경변수로 제어 (`SWAGGER_ENABLED`, `SWAGGER_PATH` 등)

### Prisma 사용
- PrismaService는 글로벌 모듈로 제공되어 어디서든 주입 가능
- 스키마 위치: `prisma/schema.prisma`
- 시드 파일: `prisma/seed.ts`

**데이터베이스 모델 변경 시**:
1. `prisma/schema.prisma` 수정
2. `npm run prisma:generate` 실행 (Client 재생성)
3. `npm run prisma:db-push` 실행 (DB 스키마 적용)

### Swagger 모듈
Swagger는 별도 모듈로 분리되어 있습니다:

- **위치**: `src/swagger/swagger.module.ts`, `src/swagger/swagger.service.ts`
- **설정**: `src/config/swagger/` (swagger.config.ts, swagger-config.service.ts)
- **환경변수 제어**:
  - `SWAGGER_ENABLED`: Swagger 활성화 여부 (true/false)
  - `SWAGGER_TITLE`: API 문서 제목
  - `SWAGGER_DESCRIPTION`: API 문서 설명
  - `SWAGGER_PATH`: Swagger 접근 경로 (기본: api-docs)
- 개발/프로덕션 환경에 관계없이 환경변수로 제어 가능

## API 엔드포인트
- 기본 URL: `http://localhost:3000/api`
- API 문서: `http://localhost:3000/{SWAGGER_PATH}` (환경변수로 제어)
- 헬스체크: `http://localhost:3000/api/health`

## Docker
PostgreSQL 16 컨테이너를 제공합니다:

```bash
# PostgreSQL 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f postgres

# 중지
docker-compose down

# 데이터까지 삭제
docker-compose down -v
```

**환경변수**:
- `POSTGRES_CONTAINER_NAME`: 컨테이너 이름
- `POSTGRES_USER`: PostgreSQL 사용자
- `POSTGRES_PASSWORD`: PostgreSQL 비밀번호
- `POSTGRES_DB`: 데이터베이스 이름
- `POSTGRES_HOST`: 호스트 (기본: localhost)
- `POSTGRES_PORT`: 외부 노출 포트 (기본: 5432)
- `POSTGRES_URL`: 전체 연결 URL

**참고**: `POSTGRES_CONTAINER_NAME`은 docker-compose에서만 사용되며, 애플리케이션 코드에서는 사용하지 않습니다.

## 주요 파일 위치
- 환경변수 검증: `src/config/env/env.validation.ts`
- 애플리케이션 부트스트랩: `src/main.ts`
- 데이터베이스 스키마: `prisma/schema.prisma`
- Docker Compose: `docker-compose.yml`
- 공통 Guards: `src/common/guards/`
- 공통 Interceptors: `src/common/interceptors/`
- Swagger 모듈: `src/swagger/`
