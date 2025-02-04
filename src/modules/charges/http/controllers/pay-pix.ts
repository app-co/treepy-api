import { NotAtuthorized } from '@/modules/payment-method/errors/NotAtuthorized';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { Err } from '../../errors/Err';
import { makeCharges } from '../../use-cases/factories/make-charges';

const registerScheme = z.object({
  name: z.string({ required_error: 'Informe seu nome' }),
  fk_user_id: z.string({ required_error: 'Falta o id do usuário' }),
  email: z
    .string({ required_error: 'Informe seu email' })
    .email('Email inválido'),
  area: z
    .string({ required_error: 'Informe a área da sua região' })
    .min(2, 'DDD inválido')
    .max(2, 'DDD inválido'),
  phone_number: z.string({ required_error: 'Informe seu telefone' }),
  tax_id: z
    .string({ required_error: 'Informe seu CPF' })
    .max(11, 'CPF inválido, mínimo 11 dígitos'),
  amount: z.number({ required_error: 'Informe valor da compra' }),
  street: z.string({ required_error: 'Informe o nome da rua' }),
  home_number: z.string({ required_error: 'Informe o número da residência' }),
  complement: z.string(),
  locality: z.string({ required_error: 'Informe seu bairro' }),
  city: z.string({ required_error: 'Informe sua cidade' }),
  region_code: z
    .string({ required_error: 'Informe a UF' })
    .toUpperCase()
    .min(2)
    .max(2),
  postal_code: z
    .string({ required_error: 'Informe seu CEP' })
    .max(8, 'CPF inválido, mínimo 11 dígitos'),
});

export type TPixInput = z.infer<typeof registerScheme>;

export async function payPix(req: FastifyRequest, res: FastifyReply) {
  const data = registerScheme.parse(req.body);

  try {
    const create = makeCharges();

    const rs = await create.createPix(data);
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
