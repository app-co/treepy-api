import { NotAtuthorized } from '@/modules/payment-method/errors/NotAtuthorized';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { Err } from '../../errors/Err';
import { makeCharges } from '../../use-cases/factories/make-charges';

export async function payCard(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({
    name: z.string({ required_error: 'Falta o nome' }),
    fk_user_id: z.string({ required_error: 'Falta o id do usuário' }),
    email: z
      .string({ required_error: 'Informe seu email' })
      .email('Email inválido'),
    area: z
      .string({ required_error: 'Falta a área do telefone' })
      .min(2)
      .max(2),
    phone_number: z
      .string({ required_error: 'Falta o telefone' })
      .min(9, 'telefone inválido')
      .max(9, 'telefone inválido'),
    tax_id: z
      .string({ required_error: 'Falta o CPF' })
      .max(11, 'CPF inválido, mínimo 11 dígitos'),
    amount: z.number({ required_error: 'Falta o valor da compra' }),
    street: z.string({ required_error: 'Falta o nome da rua' }),
    home_number: z.string({ required_error: 'Falta o número da residência' }),
    complement: z.string({ required_error: 'Falta o complemento' }),
    locality: z.string({ required_error: 'Falta o Bairro' }),
    city: z.string({ required_error: 'Informe a cidade' }),
    region_code: z
      .string({ required_error: 'Informe a UF' })
      .toUpperCase()
      .min(2)
      .max(2),
    postal_code: z
      .string({ required_error: 'Informe o CEP' })
      .max(8, 'CPF inválido, mínimo 8 dígitos'),
    installments: z.number(),
    security_code: z.string(),
    encrypted: z.string({
      invalid_type_error: 'Erro na cripytografia do cartão',
    }),
  });

  const data = registerScheme.parse(req.body);

  try {
    const create = makeCharges();

    const rs = await create.createCard(data);
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
