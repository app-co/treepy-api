import { envRoutes } from '@/env';
import { FastifyInstance } from 'fastify';

import { deleteJangle } from '../controller/delete';
import { findById } from '../controller/find-by-id';
import { listAllJangle } from '../controller/list-all-jangle';
import { registerJangle } from '../controller/register';
import { updateJangle } from '../controller/update';

export async function jangleRoutes(app: FastifyInstance) {
  app.post(envRoutes.JANGLE_CREATE, registerJangle);
  app.get(envRoutes.JANGLE_LIST_ALL, listAllJangle);
  app.get(envRoutes.JANGLE_FIND_BY_ID, findById);
  app.delete(envRoutes.JANGLE_DELETE, deleteJangle);
  app.put(envRoutes.JANGLE_UPDATE, updateJangle);
}
