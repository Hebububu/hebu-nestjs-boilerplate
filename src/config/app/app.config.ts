import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV!,
  version: process.env.VERSION!,
  port: parseInt(process.env.PORT!, 10),
  allowedOrigins: process.env.ALLOWED_ORIGINS!.split(','),
}));
