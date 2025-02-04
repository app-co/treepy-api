import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeJangle } from '../../use-cases/factories/make-jangle';

export async function findById(req: FastifyRequest, res: FastifyReply) {
  const scheme = z.object({
    id: z.string(),
  });
  try {
    const { id } = scheme.parse(req.params);
    const make = makeJangle();

    const rs = await make.findById(id);
    return res.status(201).send(rs);
  } catch (err) {
    return res.status(409).send({ error: err });
  }
}
