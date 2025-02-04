import { envRoutes } from '@/env';
import { FastifyInstance } from 'fastify';

import { hotelControl } from '../controller/hotelContrll';

export async function hoteRoutes(app: FastifyInstance) {
  app.post('/hotel', hotelControl);
  // app.get('/hotel');
}
