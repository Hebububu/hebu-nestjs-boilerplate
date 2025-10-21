import { LoggerService } from '@logger/logger.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  HttpErrorLog,
  HttpRequestLog,
  HttpResponseLog,
} from '../interfaces/httpLogging.interface';
import { ErrorHandler } from '@common/utils/errorHandler.utils';

/**
 * HTTP 요청과 응답을 자동으로 로깅하는 인터셉터
 *
 * @description
 * 모든 HTTP 요청의 메서드, URL, body를 로깅하고, 응답 시 상태 코드와 응답 시간을 측정하여 로깅합니다.
 */
@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  /**
   * HTTP 요청/응답 로깅 처리 메서드
   * @param context - 실행 컨텍스트
   * @param next - 다음 핸들러
   * @returns 응답 Observable
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const body: unknown = request.body;
    const now = Date.now();

    const requestId = randomUUID(); // TODO: requestId 생성 인터셉터 만들어서 분리하기
    const ip = request.ip || request.socket.remoteAddress || 'unknown';
    const userAgent = request.get('user-agent') || 'unknown';

    const requestLog: HttpRequestLog = {
      type: 'HTTP_REQUEST',
      requestId,
      method,
      url,
      ip,
      userAgent,
      body,
    };

    this.logger.logHttp(requestLog);

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          const { statusCode } = response;
          const responseTime = `${Date.now() - now}ms`;

          const responseLog: HttpResponseLog = {
            type: 'HTTP_RESPONSE',
            requestId,
            method,
            url,
            statusCode,
            responseTime,
          };

          this.logger.logHttp(responseLog);
        },
        error: (error) => {
          const responseTime = `${Date.now() - now}ms`;

          // TODO: errorHandler.utils.ts 유틸로 분리하여 error: getErrorMessage(error) 로 변경
          const errorLog: HttpErrorLog = {
            type: 'HTTP_ERROR',
            requestId,
            method,
            url,
            error: ErrorHandler.getMessage(error),
            stack: ErrorHandler.getStack(error),
            responseTime,
          };

          this.logger.errorHttp(errorLog);
        },
      }),
    );
  }
}
