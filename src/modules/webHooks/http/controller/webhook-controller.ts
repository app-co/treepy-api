/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { FastifyReply, FastifyRequest } from 'fastify';

import { makeHook } from '../../factories/make-hook';

const make = makeHook();

export class WebhookController {
  async createWebHook(
    req: FastifyRequest,
    res: FastifyReply,
  ): Promise<FastifyReply> {
    const object = req.body;

    try {
      const rs = await make.create(object);
      return res.status(201).send(rs);
    } catch (err) {
      return res.status(409).send({ error: err });
    }
  }

  async listMany(
    req: FastifyRequest,
    res: FastifyReply,
  ): Promise<FastifyReply> {
    const list = await make.listMany();

    return res.send(list);
  }

  // async findById(req: Request, res: Response): Promise<Response> {
  //   const service = container.resolve(createWebhook);
  //   const id = req.params;

  //   const list = await service.findById({ id: String(id) });

  //   return res.json(list);
  // }
}
