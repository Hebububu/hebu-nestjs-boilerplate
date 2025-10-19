# NestJS Boilerplate

NestJS 기반의 백엔드 보일러플레이트입니다.

## 주요 기능

- **NestJS**: 프레임워크
- **Prisma**: ORM (PostgreSQL)
- **Winston**: 로깅 (파일 로테이션 포함)
- **Config Module**: 환경변수 관리 및 검증 (Joi)
- **Swagger**: API 문서 자동 생성 (모듈화)
- **Health Check**: 헬스체크 엔드포인트
- **Docker**: PostgreSQL 16 docker-compose 제공
- **Path Alias**: `@/`, `@common/`, `@modules/`, `@config/`, `@logger/`, `@swagger/`

## 프로젝트 구조

```
src/
├── common/              # 공통 유틸리티
│   ├── guards/         # Guards
│   ├── interceptors/   # Interceptors
│   └── prisma/         # Prisma 서비스
├── config/             # 설정 모듈
│   ├── app/           # 앱 설정
│   ├── auth/          # 인증 설정
│   ├── database/      # 데이터베이스 설정
│   ├── swagger/       # Swagger 설정
│   ├── env/           # 환경변수 검증
│   └── logger/        # 로거 설정
├── logger/            # 로거 모듈
├── swagger/           # Swagger 모듈
├── modules/           # 기능 모듈
│   └── health/       # 헬스체크
├── app.module.ts
└── main.ts
```

## 시작하기

### 1. 환경변수 설정

```bash
cp .env.example .env
# .env 파일을 수정하여 필요한 값들을 설정하세요
```

**주요 환경변수:**

- `NODE_ENV`: 실행 환경 (development, production, test)
- `VERSION`: 애플리케이션 버전
- `PORT`: 서버 포트
- `POSTGRES_*`: PostgreSQL 연결 정보
- `JWT_SECRET`: JWT 시크릿 키
- `SWAGGER_ENABLED`: Swagger 활성화 여부 (true/false)

⚠️ **모든 환경변수는 필수입니다.** 누락 시 애플리케이션 시작이 실패합니다.

### 2. 의존성 설치

```bash
npm install
```

### 3. PostgreSQL 실행 (Docker)

```bash
# PostgreSQL 컨테이너 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f postgres

# 컨테이너 중지
docker-compose down

# 데이터까지 삭제
docker-compose down -v
```

### 4. Prisma 초기화

```bash
# Prisma Client 생성
npm run prisma:generate

# 데이터베이스 스키마 동기화
npm run prisma:db-push

# 시드 데이터 삽입 (선택사항)
npm run prisma:seed
```

### 5. 개발 서버 실행

```bash
npm run dev
```

서버는 `http://localhost:3000` 에서 실행됩니다.

## 스크립트

- `npm run dev` - 개발 모드 실행 (watch 모드)
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 모드 실행
- `npm run format` - 코드 포맷팅
- `npm run format:check` - 포맷팅 검사
- `npm run lint` - ESLint 실행
- `npm run tsc` - 타입 체크
- `npm run test` - 테스트 실행
- `npm run test:watch` - 테스트 watch 모드
- `npm run test:cov` - 테스트 커버리지
- `npm run prisma:studio` - Prisma Studio 실행
- `npm run prisma:generate` - Prisma Client 생성
- `npm run prisma:db-push` - 데이터베이스 스키마 동기화
- `npm run prisma:seed` - 시드 데이터 삽입

## API 문서

Swagger는 환경변수(`SWAGGER_ENABLED`)로 제어됩니다.

기본 경로: `http://localhost:3000/api-docs` (환경변수로 변경 가능)

- `SWAGGER_ENABLED=true`: Swagger 활성화
- `SWAGGER_TITLE`: API 문서 제목
- `SWAGGER_DESCRIPTION`: API 문서 설명
- `SWAGGER_PATH`: Swagger 경로

## 헬스체크

`http://localhost:3000/api/health` 에서 헬스체크를 확인할 수 있습니다.

- 메모리 사용량
- 데이터베이스 연결 상태

## Path Alias

tsconfig.json에 다음과 같은 경로 별칭이 설정되어 있습니다:

- `@/*` → `src/*`
- `@common/*` → `src/common/*`
- `@modules/*` → `src/modules/*`
- `@config/*` → `src/config/*`
- `@logger/*` → `src/logger/*`
- `@swagger/*` → `src/swagger/*`

**사용 예시:**

```typescript
import { LoggerService } from '@logger/logger.service';
import { PrismaService } from '@common/prisma/prisma.service';
import { SwaggerService } from '@swagger/swagger.service';
```

## 로깅

Winston을 사용하여 로깅을 구현했습니다:

- 콘솔 로그 (개발 환경)
- 파일 로그 (일별 로테이션)
- 로그 레벨별 파일 분리 (error, info, debug)
- HTTP 요청/응답 자동 로깅 (`HttpLoggingInterceptor`)
- 로그는 `logs/` 디렉토리에 저장됩니다

**사용 예시:**

```typescript
constructor(private readonly logger: LoggerService) {}

this.logger.log('메시지', 'Context');
this.logger.error('에러 메시지', 'trace', 'Context');
```

## 환경변수 관리

모든 환경변수는 Joi를 사용하여 검증됩니다:

- **엄격한 검증**: 모든 환경변수는 required (기본값 없음)
- **타입 안전성**: ConfigService를 통한 타입 안전한 접근
- **도메인별 분리**: app, auth, database, swagger로 설정 분리

**새 환경변수 추가 시:**

1. `src/config/env/env.validation.ts`에 Joi 스키마 추가
2. 해당 도메인 `*.config.ts`에 로드 로직 추가
3. `*-config.service.ts`에 getter 메서드 추가
4. `.env.example`에 예시 값 추가

## Docker

PostgreSQL 16 컨테이너를 제공합니다:

```bash
# 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f postgres

# 중지
docker-compose down

# 데이터 삭제
docker-compose down -v
```

환경변수 `.env` 파일에서 자동으로 읽어옵니다.

## 라이센스

UNLICENSED
