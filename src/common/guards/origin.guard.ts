import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AppConfigService } from '@config/app/app-config.service';

@Injectable()
export class OriginGuard implements CanActivate {
  constructor(private readonly appConfig: AppConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const origin = request.headers.origin || request.headers.referer;

    if (!origin) {
      return true;
    }

    const allowedOrigins = this.appConfig.allowedOrigins;
    const isAllowed = allowedOrigins.some((allowed) => origin.startsWith(allowed));

    if (!isAllowed) {
      throw new ForbiddenException('Origin not allowed');
    }

    return true;
  }
}
