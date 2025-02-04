import { FastifyReply, FastifyRequest } from 'fastify';

import { makeHistory } from '../../use-cases/factory/make-history';

export async function listAllHistory(req: FastifyRequest, res: FastifyReply) {
  try {
    const create = makeHistory();

    const rs = await create.listAll();
    return res.status(201).send(rs);
  } catch (err) {
    res.send(err).status(401);

    throw err;
  }
}
