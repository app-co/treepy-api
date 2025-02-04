import { UserNotFound } from '@/modules/users/use-cases/errors/user-not-found';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeTreepycash } from '../../use-cases/factories/makeTreepycash';

export async function listByUserTreepy(req: FastifyRequest, res: FastifyReply) {
  const schemeId = z.object({
    id: z.string(),
  });

  const { id } = schemeId.parse(req.params);

  try {
    const make = makeTreepycash();

    const rs = await make.findByUser(id);
    return res.status(201).send(rs);
  } catch (err) {
    if (err instanceof UserNotFound) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
