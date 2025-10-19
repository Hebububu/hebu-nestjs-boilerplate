import { Module } from '@nestjs/common';
import { ConfigModule } from '@config/config.module';
import { LoggerModule } from '@logger/logger.module';
import { PrismaModule } from '@prisma/prisma.module';
import { SwaggerModule } from '@/swagger/swagger.module';
import { HealthModule } from '@modules/health/health.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    PrismaModule,
    SwaggerModule,
    HealthModule,
  ],
})
export class AppModule {}
