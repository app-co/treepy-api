import { FastifyReply, FastifyRequest } from 'fastify';

import * as sc from './schemas';
import { PaymentsService } from './services';

const service = new PaymentsService();
export class Controller {
  async payCard(req: FastifyRequest, res: FastifyReply) {
    const userId = req.user.sub;
    const scheme = sc.schemaCard.parse({
      ...(req.body as any),
      userId,
    });

    const execute = await service.card(scheme);

    return res.status(201).send(execute);
  }

  async cardToken(req: FastifyRequest, res: FastifyReply) {
    const userId = req.user.sub;
    const scheme = sc.schemaCardToken.parse({
      ...(req.body as any),
      userId,
    });

    const exec = await service.cardToken(scheme);

    return res.status(201).send(exec);
  }

  async payPix(req: FastifyRequest, res: FastifyReply) {
    const userId = req.user.sub;
    const scheme = sc.schemaPix.parse({
      ...(req.body as any),
      userId,
    });

    const pay = await service.pix(scheme);

    return res.status(201).send(pay);
  }

  async boleto(req: FastifyRequest, res: FastifyReply) {
    const userId = req.user.sub;
    const scheme = sc.schemaPix.parse({
      ...(req.body as any),
      userId,
    });

    const pay = await service.boleto(scheme);

    return res.status(201).send(pay);
  }

  async responsePix(req: FastifyRequest, res: FastifyReply) {
    const send = await service.responsePix(req.body);

    return res.status(201).send(send);
  }

  async registerWebHook(req: FastifyRequest, res: FastifyReply) {
    const send = await service.registerWebhook();

    return res.status(201).send(send);
  }

  async keypix(req: FastifyRequest, res: FastifyReply) {
    const send = await service.registerKeyPix();

    return res.status(201).send(send);
  }

  async responseCard(req: FastifyRequest, res: FastifyReply) {
    const scheme = sc.schemaCard.parse();
  }

  async transferTreepycaches(req: FastifyRequest, res: FastifyReply) {
    const obj = sc.schemaValidatePayment.parse(req.body);

    const ex = await service.updatePaymentTransation(obj);

    return res.status(200).send(ex);
  }
}
