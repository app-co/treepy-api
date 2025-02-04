import { Err } from '@/modules/charges/errors/Err';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeRegisterUseCase } from '../../use-cases/factories/make-register-use-case';

export async function resumoController(req: FastifyRequest, res: FastifyReply) {
  try {
    const create = makeRegisterUseCase();

    const id = req.user.sub;

    const rs = await create.resumo(id);
    return res.status(201).send(rs);
  } catch (err) {
    if (err instanceof Err) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
