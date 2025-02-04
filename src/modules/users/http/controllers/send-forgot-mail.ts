import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { UserNotFound } from '../../use-cases/errors/user-not-found';
import { MakeSendMail } from '../../use-cases/factories/make-send-mail';

export async function sendForgotPass(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({
    email: z.string().email(),
  });

  const data = registerScheme.parse(req.body);

  try {
    const create = MakeSendMail();

    const rs = await create.sendForgotPass.execute(data);
    return res.status(201).send(rs);
  } catch (err) {
    if (err instanceof UserNotFound) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
