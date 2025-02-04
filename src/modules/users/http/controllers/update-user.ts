/* eslint-disable @typescript-eslint/ban-types */
import { FastifyReply, FastifyRequest } from 'fastify';

import { schemeUpdateEnd, schemeUserUpdate } from '../../dtos';
import { makeRegisterUseCase } from '../../use-cases/factories/make-register-use-case';

export async function UpdateUser(req: FastifyRequest, res: FastifyReply) {
  const create = makeRegisterUseCase();
  const body = req.body as object;

  const data = schemeUserUpdate.parse({
    ...body,
    userId: req.user.sub,
  });

  const id = req.user.sub;

  const dt = {
    ...data,
    id,
  };

  const profile = await create.updateUser(data);

  return res.status(201).send(profile);
}

export async function UpdatEnd(req: FastifyRequest, res: FastifyReply) {
  const create = makeRegisterUseCase();

  const data = schemeUpdateEnd.parse({
    ...(req.body as object),
    userId: req.user.sub,
  });

  const profile = await create.updateEnd(data);

  return res.status(201).send(profile);
}
