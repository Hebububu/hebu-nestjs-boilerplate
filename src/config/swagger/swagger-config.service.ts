import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SwaggerConfigService {
  constructor(private configService: ConfigService) {}

  get enabled(): boolean {
    return this.configService.get<boolean>('swagger.enabled')!;
  }

  get title(): string {
    return this.configService.get<string>('swagger.title')!;
  }

  get description(): string {
    return this.configService.get<string>('swagger.description')!;
  }

  get path(): string {
    return this.configService.get<string>('swagger.path')!;
  }
}
