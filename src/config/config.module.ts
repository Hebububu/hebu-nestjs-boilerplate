import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from './app/app.config';
import authConfig from './auth/auth.config';
import databaseConfig from './database/database.config';
import swaggerConfig from './swagger/swagger.config';
import { AppConfigService } from './app/app-config.service';
import { AuthConfigService } from './auth/auth-config.service';
import { DatabaseConfigService } from './database/database-config.service';
import { SwaggerConfigService } from './swagger/swagger-config.service';
import { envValidationSchema } from './env/env.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, swaggerConfig],
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [AppConfigService, AuthConfigService, DatabaseConfigService, SwaggerConfigService],
  exports: [AppConfigService, AuthConfigService, DatabaseConfigService, SwaggerConfigService],
})
export class ConfigModule {}
