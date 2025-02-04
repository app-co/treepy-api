import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeHistory } from '../../use-cases/factory/make-history';

export async function listByUserId(req: FastifyRequest, res: FastifyReply) {
  const scheme = z.object({
    id: z.string(),
  });

  const { id } = scheme.parse(req.params);
  try {
    const create = makeHistory();

    const rs = await create.listByUserId(id);
    return res.status(201).send(rs);
  } catch (err) {
    res.send(err).status(401);

    throw err;
  }
}
