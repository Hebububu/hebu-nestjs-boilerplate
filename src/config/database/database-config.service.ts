import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  get user(): string {
    return this.configService.get<string>('database.user')!;
  }

  get password(): string {
    return this.configService.get<string>('database.password')!;
  }

  get database(): string {
    return this.configService.get<string>('database.database')!;
  }

  get host(): string {
    return this.configService.get<string>('database.host')!;
  }

  get port(): number {
    return this.configService.get<number>('database.port')!;
  }

  get url(): string {
    return this.configService.get<string>('database.url')!;
  }
}
