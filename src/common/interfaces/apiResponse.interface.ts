/**@
 * API 응답 인터페이스 정의
 *
 * @description
 * 모든 API 응답을 표준화된 형식으로 변환하기 위한 인터페이스 모음입니다.
 * - 성공 응답: SuccessResponse
 * - 에러 응답: ErrorResponse
 * - Validation 에러: ValidationError
 */

/**
 * 성공 응답 인터페이스
 *
 * @template T - 응답 데이터의 타입
 *
 * @description
 * Controller에서 반환한 데이터를 표준화된 성공 응답으로 감싸서 반환합니다.
 * Transform Interceptor에서 자동으로 변환됩니다.
 *
 * @property {true} success - 요청 성공 여부 (항상 true)
 * @property {number} statusCode - HTTP 상태 코드 (200, 201 등)
 * @property {string} timestamp - 응답 생성 시간 (ISO 8601 형식)
 * @property {string} path - 요청 경로
 * @property {T} data - 실제 응답 데이터
 */
export interface SuccessResponse<T = any> {
  success: true;
  statusCode: number;
  timestamp: string;
  path: string;
  data: T;
}

/**
 * 에러 응답 인터페이스
 *
 * @description
 * 애플리케이션에서 발생한 모든 예외를 표준화된 에러 응답으로 변환합니다.
 * Exception Filter에서 자동으로 변환됩니다.
 *
 * @property {false} success - 요청 성공 여부 (항상 false)
 * @property {number} statusCode - HTTP 상태 코드 (400, 404, 500 등)
 * @property {string} timestamp - 응답 생성 시간 (ISO 8601 형식)
 * @property {string} path - 요청 경로
 * @property {string[]} message - 에러 메시지 배열
 * @property {string} error - 에러 이름/타입 (예: "Not Found", "Bad Request", "Internal Server Error")
 * @property {string} [code] - 에러 코드 (선택사항, Prisma 에러 코드 등 특정 에러 식별용)
 * @property {ValidationError[]} [errors] - Validation 에러 상세 정보 (선택사항, class-validator의 검증 실패 시 필드별 에러 목록)
 *
 * @example
 * ```typescript
 * // 일반 에러
 * const errorResponse: ErrorResponse = {
 *   success: false,
 *   statusCode: 404,
 *   timestamp: '2025-01-18T12:34:56.789Z',
 *   path: '/api/users/999',
 *   message: ['User not found'],
 *   error: 'Not Found'
 * };
 *
 * // Prisma 에러
 * const prismaError: ErrorResponse = {
 *   success: false,
 *   statusCode: 409,
 *   timestamp: '2025-01-18T12:34:56.789Z',
 *   path: '/api/users',
 *   message: ['email already exists'],
 *   error: 'Database Error',
 *   code: 'P2002'
 * };
 *
 * // Validation 에러
 * const validationError: ErrorResponse = {
 *   success: false,
 *   statusCode: 400,
 *   timestamp: '2025-01-18T12:34:56.789Z',
 *   path: '/api/users',
 *   message: ['Validation failed'],
 *   error: 'Bad Request',
 *   errors: [
 *     { field: 'email', errors: ['email must be an email'] }
 *   ]
 * };
 * ```
 */
export interface ErrorResponse {
  success: false;
  statusCode: number;
  timestamp: string;
  path: string;
  message: string[];
  error: string;
  code?: string;
  errors?: ValidationError[];
}

/**
 * Validation 에러 상세 정보
 *
 * @description
 * class-validator의 검증 에러를 구조화하여 어느 필드에서
 * 어떤 에러가 발생했는지 명확히 전달합니다.
 *
 * @property {string} field - 에러가 발생한 필드명 (예: "email", "password", "age")
 * @property {string[]} errors - 해당 필드의 에러 메시지 목록
 * @property {any} [value] - 잘못 전달된 값 (선택사항, 디버깅 용도로 사용)
 */
export interface ValidationError {
  field: string;
  errors: string[];
  value?: any;
}

/**
 * API 응답 유니온 타입
 *
 * @template T - 성공 시 응답 데이터의 타입
 *
 * @description
 * 모든 API 응답은 성공(SuccessResponse) 또는 에러(ErrorResponse) 중 하나입니다.
 * success 필드로 타입을 구분할 수 있습니다 (Discriminated Union).
 */
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;
