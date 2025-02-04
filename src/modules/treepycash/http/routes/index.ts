import { envRoutes } from '@/env';
import { FastifyInstance } from 'fastify';

import { deleteTreepy } from '../controller/delete-treepy';
import { listAllTreepy } from '../controller/list-all-treepycash';
import { listByUserTreepy } from '../controller/list-by-user';
import { registerTreepy } from '../controller/register';

export async function treepyCashRoutes(app: FastifyInstance) {
  app.post(envRoutes.TREEPYCASH_CREATE, registerTreepy);
  app.get(envRoutes.TREEPYCASH_LIST_ALL, listAllTreepy);
  app.delete(envRoutes.TREEPYCASH_DELTE, deleteTreepy);
  app.get(envRoutes.TREEPYCASH_LIST_BY_USER, listByUserTreepy);
}
