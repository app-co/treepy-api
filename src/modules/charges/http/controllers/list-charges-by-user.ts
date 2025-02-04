import { NotAtuthorized } from '@/modules/payment-method/errors/NotAtuthorized';
import { UserAlredyExist } from '@/modules/users/use-cases/errors/user-alredy-existes-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeCharges } from '../../use-cases/factories/make-charges';

export async function ListChargesByUserId(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const id = req.user.sub;

  try {
    const create = makeCharges();

    const rs = await create.listByUserId(id);
    return res.status(201).send(rs);
  } catch (err) {
    if (err instanceof NotAtuthorized) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
