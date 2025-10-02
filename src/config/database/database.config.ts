import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  user: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
  host: process.env.POSTGRES_HOST!,
  port: parseInt(process.env.POSTGRES_PORT!, 10),
  url: process.env.POSTGRES_URL!,
}));
