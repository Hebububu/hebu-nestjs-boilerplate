import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env(): string {
    return this.configService.get<string>('app.env')!;
  }

  get version(): string {
    return this.configService.get<string>('app.version')!;
  }

  get port(): number {
    return this.configService.get<number>('app.port')!;
  }

  get allowedOrigins(): string[] {
    return this.configService.get<string[]>('app.allowedOrigins')!;
  }

  get isDevelopment(): boolean {
    return this.env === 'development';
  }

  get isProduction(): boolean {
    return this.env === 'production';
  }
}
