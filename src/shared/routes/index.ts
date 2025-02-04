import { paymentAsaasRoute } from '@/modules/asaas/payments/routes';
import { calculadoraRoutes } from '@/modules/calculadora/http/routes';
import { chargesRoutes } from '@/modules/charges/http/routes';
import { historyRoutes } from '@/modules/history/http/routes';
import { jangleRoutes } from '@/modules/jangles/http/routes';
import { metricaRoute } from '@/modules/metricas/routes';
import { pagseguroRoutes } from '@/modules/pagSeguro/http/routes';
import { paymentRoutes } from '@/modules/payments/routes';
import { treepyCashRoutes } from '@/modules/treepycash/http/routes';
import { hoteRoutes } from '@/modules/userHotel/http/routes';
import { userRoutes } from '@/modules/users/http/routes';
import { hookRoutes } from '@/modules/webHooks/http/routes';
import { FastifyInstance } from 'fastify';

export async function Routes(app: FastifyInstance) {
  app.register(userRoutes);

  app.register(chargesRoutes);
  app.register(historyRoutes);
  app.register(jangleRoutes);
  app.register(calculadoraRoutes);
  app.register(pagseguroRoutes);
  app.register(treepyCashRoutes);
  app.register(hookRoutes);
  app.register(hoteRoutes);
  app.register(paymentRoutes);
  app.register(paymentAsaasRoute);
  app.register(metricaRoute);
}
