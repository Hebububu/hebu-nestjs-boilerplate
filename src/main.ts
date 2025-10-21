import { SwaggerService } from '@swagger/swagger.service';
import { HttpLoggingInterceptor } from '@common/interceptors/httpLogging.interceptor';
import { AppConfigService } from '@config/app/app-config.service';
import { LoggerService } from '@logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const appConfig = app.get(AppConfigService);
  const logger = app.get(LoggerService);
  const swaggerService = app.get(SwaggerService);

  app.useLogger(logger);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new HttpLoggingInterceptor(logger));

  app.enableCors({
    origin: appConfig.allowedOrigins,
    credentials: true,
  });

  swaggerService.setup(app);

  await app.listen(appConfig.port);
  logger.log(
    `Application is running on: http://localhost:${appConfig.port}/api`,
    'Bootstrap',
  );
}

bootstrap();
