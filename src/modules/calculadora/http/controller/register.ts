/* eslint-disable @typescript-eslint/ban-types */
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeCalculadora } from '../../use-cases/factories';

const registerScheme = z.object({
  fk_user_id: z.string(),

  eletricidade: z.number().transform(h => String(h)),
  gas: z.number().transform(h => String(h)),
  transporte_individual: z.number().transform(h => String(h)),
  transporte_coletivo: z.number().transform(h => String(h)),
  residuos: z.number().transform(h => String(h)),
  alimentacao: z.number().transform(h => String(h)),
  total: z.number().transform(h => String(h)),
});

export type TCalcUpdate = z.infer<typeof registerScheme>;

export async function registerCalculadora(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const data = registerScheme.parse(req.body);

  const make = makeCalculadora();

  const rs = await make.create(data);
  return res.status(201).send(rs);
}

export async function updateCalculadora(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const data = registerScheme.parse({
    ...(req.body as object),
    fk_user_id: req.user.sub,
  });

  const make = makeCalculadora();

  const rs = await make.update(data);
  return res.status(201).send(rs);
}
