import { Err } from '@/modules/charges/errors/Err';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { UserNotFound } from '../../use-cases/errors/user-not-found';
import { makeResePass } from '../../use-cases/factories/make-reset-pass';

export async function resetPass(req: FastifyRequest, res: FastifyReply) {
  try {
    // const token = await req.jwtVerify();

    const scheme = z.object({
      token: z.string(),
      password: z.string().min(6),
    });

    const reset = makeResePass();

    const data = scheme.parse(req.body);

    const profile = await reset.execute(data);

    return res.status(201).send(profile);
  } catch (err) {
    if (err instanceof UserNotFound) {
      return res.status(409).send({ error: err.message });
    }

    if (err instanceof Err) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
