import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  CORS_ORIGIN: Joi.string().default('https://instagram-agend.vercel.app/'),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  OPENAI_KEY: Joi.string().required(),
  GOOGLE_AI_API_KEY: Joi.string().required(),
});
