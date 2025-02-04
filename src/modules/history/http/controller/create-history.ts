import { Err } from '@/modules/charges/errors/Err';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeHistory } from '../../use-cases/factory/make-history';

export async function createHistory(req: FastifyRequest, res: FastifyReply) {
  const scheme = z.object({
    fk_user_id: z.string(),
    title: z.string(),
    subtitle: z.string(),
  });

  const data = scheme.parse(req.body);
  try {
    const create = makeHistory();

    const rs = await create.create(data);
    return res.status(201).send(rs);
  } catch (err) {
    if (err instanceof Err) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
