import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  VERSION: Joi.string().required(),
  PORT: Joi.number().required(),
  ALLOWED_ORIGINS: Joi.string().required(),

  // PostgreSQL
  POSTGRES_CONTAINER_NAME: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_URL: Joi.string().required(),

  // Auth
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),

  // Swagger
  SWAGGER_ENABLED: Joi.string().valid('true', 'false').required(),
  SWAGGER_TITLE: Joi.string().required(),
  SWAGGER_DESCRIPTION: Joi.string().required(),
  SWAGGER_PATH: Joi.string().required(),
});
