import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private configService: ConfigService) {}

  get jwtSecret(): string {
    return this.configService.get<string>('auth.jwtSecret')!;
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('auth.jwtExpiresIn')!;
  }
}
