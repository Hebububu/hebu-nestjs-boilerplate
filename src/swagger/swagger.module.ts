import { Module } from '@nestjs/common';
import { SwaggerService } from './swagger.service';
import { SwaggerConfigService } from '@config/swagger/swagger-config.service';

@Module({
  providers: [SwaggerService, SwaggerConfigService],
  exports: [SwaggerService],
})
export class SwaggerModule {}
