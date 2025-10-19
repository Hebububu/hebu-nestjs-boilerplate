// TODO jsdoc 추가

import { AppConfigService } from '@config/app/app-config.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class OriginGuard implements CanActivate {
  constructor(private readonly appConfig: AppConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const origin = request.headers.origin || request.headers.referer;

    if (!origin) {
      return true;
    }

    const allowedOrigins = this.appConfig.allowedOrigins;
    const isAllowed = allowedOrigins.some((allowed) =>
      origin.startsWith(allowed),
    );

    if (!isAllowed) {
      throw new ForbiddenException('Origin not allowed');
    }

    return true;
  }
}
