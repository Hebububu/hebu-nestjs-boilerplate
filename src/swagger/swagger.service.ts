import { Injectable } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SwaggerConfigService } from '@config/swagger/swagger-config.service';
import { AppConfigService } from '@config/app/app-config.service';
import { LoggerService } from '@logger/logger.service';

@Injectable()
export class SwaggerService {
  constructor(
    private readonly swaggerConfig: SwaggerConfigService,
    private readonly appConfig: AppConfigService,
    private readonly logger: LoggerService,
  ) {}

  setup(app: INestApplication): void {
    if (!this.swaggerConfig.enabled) {
      this.logger.log('Swagger is disabled', 'SwaggerService');
      return;
    }

    const config = new DocumentBuilder()
      .setTitle(this.swaggerConfig.title)
      .setDescription(this.swaggerConfig.description)
      .setVersion(this.appConfig.version)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(this.swaggerConfig.path, app, document);

    this.logger.log(
      `Swagger is running on: http://localhost:${this.appConfig.port}/${this.swaggerConfig.path}`,
      'SwaggerService',
    );
  }
}