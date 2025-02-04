import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makePagSeguro } from '../../use-cases/factories';

export async function installments(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({
    value: z.string(),
  });

  const { value } = registerScheme.parse(req.params);

  try {
    const make = makePagSeguro();

    const rs = await make.instalment(Number(value));
    return res.status(201).send(rs);
  } catch (err) {
    return res.status(409).send({ error: err });
  }
}
