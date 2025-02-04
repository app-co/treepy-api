import { Err } from '@/modules/charges/errors/Err';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeRegisterUseCase } from '../../use-cases/factories/make-register-use-case';

export async function checkUser(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({
    email: z.string(),
  });

  const { email } = registerScheme.parse(req.params);
  const create = makeRegisterUseCase();

  const rs = await create.check(email);
  return res.status(201).send(rs);

  // try {
  // } catch (err) {
  //   if (err instanceof Err) {
  //     return res.status(409).send({ error: err.message });
  //   }

  //   throw err;
  // }
}
