/* eslint-disable no-underscore-dangle */
import 'dotenv/config';

import { z } from 'zod';

const envSche = z.object({
  NODE_ENV: z.enum(['dev', 'tst', 'prd']).default('dev'),
  PORT: z.coerce.number().default(3333),
  ACESS_TOKEN_SANDBOX: z.string(),
  API_URL_SANDBOX: z.string(),
  ACESS_TOKEN: z.string(),
  API_URL: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
  ONE_SIGNAL_API_URL: z.string(),
  ONE_SIGNAL_API_KEY: z.string(),
  ONE_SIGNAL_APP_ID: z.string(),
  NOTIFICATION_URL_TST: z.string(),
  NOTIFICATION_URL: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  KEY_PIX_SANDBOX: z.string(),
  KEY_PIX: z.string(),
  WEB_HOOKS_SANDBOX_URL: z.string(),
  WEB_HOOKS_URL: z.string(),
});

const _env = envSche.safeParse(process.env);

if (_env.success === false) {
  console.error('Invalid environment', _env.error.format());
  throw new Error('Invalid environment');
}

export const env = _env.data;
