import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeCalculadora } from '../../use-cases/factories';

export async function listByUser(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({
    id: z.string(),
  });

  const { id } = registerScheme.parse(req.params);

  try {
    const make = makeCalculadora();

    const rs = await make.findByUser(id);
    return res.status(201).send(rs);
  } catch (err) {
    return res.status(409).send({ error: err });
  }
}
