import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeRegisterUseCase } from '../../use-cases/factories/make-register-use-case';

export async function listAllUserController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  try {
    const make = makeRegisterUseCase();

    const rs = await make.listAll();
    return res.status(201).send(rs);
  } catch (err: any) {
    return res.status(409).send({ error: err.message });
  }
}
