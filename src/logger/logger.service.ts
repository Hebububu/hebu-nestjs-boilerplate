import {
  HttpErrorLog,
  HttpRequestLog,
  HttpResponseLog,
} from '@/common/interfaces/httpLogging.interface';
import {
  Inject,
  Injectable,
  LoggerService as NestLoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: WinstonLogger,
  ) {}

  // 일반 로그 //
  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // HTTP 로깅 //
  logHttp(logData: HttpRequestLog | HttpResponseLog) {
    this.logger.info(logData);
  }
  errorHttp(errorLog: HttpErrorLog) {
    this.logger.info(errorLog);
  }
}
