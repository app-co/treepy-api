import { Err } from '@/modules/charges/errors/Err';
import { FastifyReply, FastifyRequest } from 'fastify';

import { makeRelatorio } from '../../use-cases/factories/make-relatorio';

export async function relatorioControlerAdm(
  req: FastifyRequest,
  res: FastifyReply,
) {
  try {
    const make = makeRelatorio();

    const rs = await make.execute();
    return res.status(201).send(rs);
  } catch (err) {
    if (err instanceof Err) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
