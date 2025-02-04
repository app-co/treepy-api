/* eslint-disable no-underscore-dangle */
import 'dotenv/config';

import { z } from 'zod';

import { schemeConfi } from './scheme-config';
import { routesScheme } from './Scheme-routes';

const _env = schemeConfi.safeParse(process.env);
const _routes = routesScheme.safeParse(process.env);

if (_env.success === false) {
  console.error('Invalid environment', _env.error.format());
  throw new Error('Invalid environment');
}

if (_routes.success === false) {
  console.error('Invalid environment', _routes.error.format());
  throw new Error('Invalid environment');
}

export const env = _env.data;
export const envRoutes = _routes.data;
