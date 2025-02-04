import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeRegisterUseCase } from '../../use-cases/factories/make-register-use-case';

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({
    full_name: z.string({ description: 'Nome obrigatorio' }),
    email: z.string(),
    password: z.string().min(6, 'senha deve ter mo mínimo 6 caracteres'),
    // phone_number: z.string().min(9, 'deve ter 9 caracteres'),
    // phone_area: z.string().min(2),
    // cpf: z.string().min(11, 'CPF deve ter 11 caracteres'),
    // street: z.string(),
    // locality: z.string(),
    // home_number: z.string(),
    // region_code: z.string().min(2).max(2),
    // city: z.string(),
    // state: z.string(),
    // postal_code: z.string().min(8).max(9, 'CEP de ter 9 caracteres'),
    // complement: z.string(),
    notifications: z.boolean(),
    termos: z.boolean(),
  });

  const data = registerScheme.parse(req.body);

  const create = makeRegisterUseCase();

  const rs = await create.execute(data);
  return res.status(201).send(rs);
  // try {
  // } catch (err) {
  //   if (err instanceof UserAlredyExist) {
  //     return res.status(409).send({ error: err.message });
  //   }

  //   if (err instanceof CpfAlredyExisteError) {
  //     return res.status(409).send({ error: err.message });
  //   }

  //   if (err instanceof InvalidCpf) {
  //     return res.status(409).send({ error: err.message });
  //   }

  //   throw err;
  // }
}
