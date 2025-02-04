import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { CpfAlredyExisteError } from '../../use-cases/errors/cpf-alredy-existe-error';
import { InvalidCpf } from '../../use-cases/errors/invalid-cpf';
import { UserNotFound } from '../../use-cases/errors/user-not-found';
import { MakeSendMail } from '../../use-cases/factories/make-send-mail';

export async function sendMailContact(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({
    email: z.string().email(),
    message: z.string(),
    nome: z.string(),
    assunto: z.string(),
  });

  const data = registerScheme.parse(req.body);

  try {
    const create = MakeSendMail();

    const rs = await create.sendContacMail.execute(data);
    return res.status(201).send(rs);
  } catch (err) {
    if (err instanceof UserNotFound) {
      return res.status(409).send({ error: err.message });
    }

    if (err instanceof CpfAlredyExisteError) {
      return res.status(409).send({ error: err.message });
    }

    if (err instanceof InvalidCpf) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
