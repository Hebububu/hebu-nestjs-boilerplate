import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfigService } from './app/app-config.service';
import appConfig from './app/app.config';
import { AuthConfigService } from './auth/auth-config.service';
import authConfig from './auth/auth.config';
import { DatabaseConfigService } from './database/database-config.service';
import databaseConfig from './database/database.config';
import { envValidationSchema } from './env/env.validation';
import { SwaggerConfigService } from './swagger/swagger-config.service';
import swaggerConfig from './swagger/swagger.config';

@Global()
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
  providers: [
    AppConfigService,
    AuthConfigService,
    DatabaseConfigService,
    SwaggerConfigService,
  ],
  exports: [
    AppConfigService,
    AuthConfigService,
    DatabaseConfigService,
    SwaggerConfigService,
  ],
})
export class ConfigModule {}
