import { z } from 'zod';

export const schemeConfi = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  PAG_DEV_TOKEN: z.string().optional(),
  PAG_PRODUCTION_TOKEN: z.string().optional(),
  APP_SECRET: z.string().optional(),
  URL_WEB_HOOK: z.string(),
  ACCESS_TOKEN: z.string(),
});
