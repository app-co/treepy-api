import { FastifyReply, FastifyRequest } from 'fastify';

import { makeJangle } from '../../use-cases/factories/make-jangle';

export async function listAllJangle(req: FastifyRequest, res: FastifyReply) {
  try {
    const make = makeJangle();

    const rs = await make.listall();
    return res.status(201).send(rs);
  } catch (err) {
    return res.status(409).send({ error: err });
  }
}
