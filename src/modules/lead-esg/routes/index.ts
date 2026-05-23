import type { FastifyInstance } from 'fastify';
import { LeadEsgController } from '../controller';

const controller = new LeadEsgController();

export async function routesLeadEsg(app: FastifyInstance) {
  app.post('/lead/esg', controller.create.bind(controller));
}
