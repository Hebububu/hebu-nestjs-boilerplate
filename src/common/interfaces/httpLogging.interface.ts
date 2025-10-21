/**
 * HTTP 로깅 인터페이스 정의
 *
 * @description
 * 어플리케이션 전반에서 사용되는 구조회된 HTTP 로깅 인터페이스 모음입니다.
 * - HTTP 요청 로그: HttpRequestLog
 * - HTTP 응답 로그: HttpResponseLog
 * - HTTP 에러 로그: HttpErrorLog
 */

/**
 * HTTP 요청 로그
 *
 * @property {'HTTP_REQUEST'} type - 로그 타입 (항상 'HTTP_REQUEST')
 * @property {string} requestId - 요청 추적 ID (UUID)
 * @property {string} method - HTTP 메서드 (GET, POST, PUT, DELETE 등)
 * @property {string} url - 요청 URL 경로
 * @property {string} ip - 클라이언트 IP 주소
 * @property {string} userAgent - User-Agent 헤더 정보
 * @property {unknown} body - 요청 body (구조화된 객체)
 */
export interface HttpRequestLog {
  type: 'HTTP_REQUEST';
  requestId: string;
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  body: unknown;
}

/**
 * HTTP 응답 로그
 *
 * @property {'HTTP_RESPONSE'} type - 로그 타입 (항상 'HTTP_RESPONSE')
 * @property {string} requestId - 요청 추적 ID (UUID)
 * @property {string} method - HTTP 메서드 (GET, POST, PUT, DELETE 등)
 * @property {string} url - 요청 URL 경로
 * @property {number} statusCode - HTTP 응답 상태 코드 (200, 201, 400, 500 등)
 * @property {string} responseTime - 응답 처리 시간 (예: "123ms")
 */
export interface HttpResponseLog {
  type: 'HTTP_RESPONSE';
  requestId: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: string;
}

/**
 * HTTP 에러 로그
 *
 * @property {'HTTP_ERROR'} type - 로그 타입 (항상 'HTTP_ERROR')
 * @property {string} requestId - 요청 추적 ID (UUID)
 * @property {string} method - HTTP 메서드 (GET, POST, PUT, DELETE 등)
 * @property {string} url - 요청 URL 경로
 * @property {string} error - 에러 메시지
 * @property {string} [stack] - 스택 트레이스 (에러 발생 위치 추적용, 선택사항)
 * @property {string} responseTime - 응답 처리 시간 (예: "123ms")
 */
export interface HttpErrorLog {
  type: 'HTTP_ERROR';
  requestId: string;
  method: string;
  url: string;
  error: string;
  stack?: string[];
  responseTime: string;
}

/**
 * HTTP 로그 유니온 타입
 *
 * @description
 * 모든 HTTP 로그는 요청(HttpRequestLog), 응답(HttpResponseLog), 에러(HttpErrorLog) 중 하나입니다.
 * type 필드로 타입을 구분할 수 있습니다 (Discriminated Union).
 */
export type HttpLog = HttpRequestLog | HttpResponseLog | HttpErrorLog;
