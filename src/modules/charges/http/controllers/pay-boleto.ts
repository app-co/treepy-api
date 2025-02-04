import { NotAtuthorized } from '@/modules/payment-method/errors/NotAtuthorized';
import { UserAlredyExist } from '@/modules/users/use-cases/errors/user-alredy-existes-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { Err } from '../../errors/Err';
import { makeCharges } from '../../use-cases/factories/make-charges';

export async function payBoleto(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({
    name: z.string(),
    fk_user_id: z.string(),
    email: z.string().email(),
    area: z.string().min(2).max(2),
    phone_number: z
      .string()
      .min(9, 'TELEFONE INVÁLIDO')
      .max(9, 'TELEFONE INVÁLIDO'),
    tax_id: z.string().max(11, 'CPF inválido, mínimo 11 dígitos'),
    amount: z.number(),
    street: z.string(),
    home_number: z.string(),
    complement: z.string(),
    locality: z.string(),
    city: z.string(),
    region: z.string(),
    region_code: z.string().toUpperCase().min(2).max(2),
    postal_code: z.string().max(8, 'CEP inválido, máximo 8 dígitos'),
    due_date: z.string(),
  });

  const data = registerScheme.parse(req.body);

  try {
    const create = makeCharges();

    const rs = await create.createBoleto(data);
    return res.status(201).send(rs);
  } catch (err) {
    if (err instanceof NotAtuthorized) {
      return res.status(409).send({ error: err.message });
    }

    if (err instanceof Err) {
      return res.status(409).send({ error: err.error });
    }

    throw err;
  }
}
