import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '@logger/logger.service';
import { Request, Response } from 'express';

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

    this.logger.log(
      `Incoming Request: ${method} ${url} - Body: ${JSON.stringify(body ?? {})}`,
      'HttpLoggingInterceptor',
    );

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        const { statusCode } = response;
        const responseTime = Date.now() - now;

        this.logger.log(
          `Outgoing Response: ${method} ${url} - Status: ${statusCode} - ${responseTime}ms`,
          'HttpLoggingInterceptor',
        );
      }),
    );
  }
}
