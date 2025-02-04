import { FastifyReply, FastifyRequest } from 'fastify';

import { UserNotFound } from '../../use-cases/errors/user-not-found';
import { makeRegisterUseCase } from '../../use-cases/factories/make-register-use-case';

export async function listById(req: FastifyRequest, res: FastifyReply) {
  try {
    // const token = await req.jwtVerify();

    const create = makeRegisterUseCase();

    const id = req.user.sub;

    const { user } = await create.listById(id);

    return res.status(201).send({
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (err) {
    if (err instanceof UserNotFound) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
