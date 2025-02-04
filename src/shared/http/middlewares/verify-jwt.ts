/* eslint-disable consistent-return */
import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';

export async function verifyJwt(req: FastifyRequest, res: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch (err) {
    return res
      .status(401)
      .send({ error: 'Seu token expirou, faça o login novamente' });
  }
}
