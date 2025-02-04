import { UserNotFound } from '@/modules/users/use-cases/errors/user-not-found';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeTreepycash } from '../../use-cases/factories/makeTreepycash';

export async function registerTreepy(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({
    tree: z.number(),
  });

  const schemeId = z.object({
    id: z.string(),
  });

  const { tree } = registerScheme.parse(req.body);
  const { id } = schemeId.parse(req.params);

  const dt = {
    tree,
    fk_user_id: id,
  };

  try {
    const make = makeTreepycash();

    const rs = await make.create(dt);
    return res.status(201).send(rs);
  } catch (err) {
    if (err instanceof UserNotFound) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
