import { envRoutes } from '@/env';
import { verifyJwt } from '@/shared/http/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';

import { createHistory } from '../controller/create-history';
import { deletHistory } from '../controller/del-history';
import { listAllHistory } from '../controller/list-all';
import { listByUserId } from '../controller/list-by-userId';

export async function historyRoutes(app: FastifyInstance) {
  app.get(envRoutes.HISTORY_LIST_ALL, listAllHistory);
  app.get(envRoutes.HISTORY_LIST_BY_USER, listByUserId);
  app.delete(envRoutes.HISTORY_DELETE, deletHistory);
  app.post(envRoutes.HISTORY_CREATE, createHistory);
}
