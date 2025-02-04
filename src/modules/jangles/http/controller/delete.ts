import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { JangleNotFound } from '../../errors/JangleNotFound';
import { makeJangle } from '../../use-cases/factories/make-jangle';

export async function deleteJangle(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({ id: z.string() });

  const { id } = registerScheme.parse(req.params);

  try {
    const make = makeJangle();

    const rs = await make.delete(id);
    return res.status(201).send(rs);
  } catch (err) {
    if (err instanceof JangleNotFound) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
