/**
 * HTTP 로깅을 위한 인터페이스
 * nest-winston의 log 메서드 시그니처에 맞춰 설계
 * TODO
 */

/**
 * HTTP 요청 로그 데이터
 * @description logger.log()로 전달되는 객체
 */
export interface HttpRequestLog {
  level: 'HttpRequest';
  message: string;
  requestId?: string;
  method: string;
  url: string;
  ip?: string;
  userAgent?: string;
  body?: unknown;
  query?: unknown;
  params?: unknown;
  headers?: Record<string, string | string[] | undefined>;
}

/**
 * HTTP 응답 로그 데이터
 * @description logger.log()로 전달되는 객체
 */
export interface HttpResponseLog {
  level: 'HttpResponse';
  message: string;
  requestId?: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: string;
}

/**
 * HTTP 에러 로그 데이터
 * @description logger.error()로 전달되는 데이터
 */
export interface HttpErrorLog {
  level: 'HttpError';
  message: string;
  requestId?: string;
  method: string;
  url: string;
  statusCode?: number;
  error: string;
  stack?: string;
  responseTime: string;
}
