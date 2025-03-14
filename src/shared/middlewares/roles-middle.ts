/* eslint-disable consistent-return */
import { FastifyReply, FastifyRequest } from 'fastify';

type T = number

export function roles(roleType: T) {
  return async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user

    if (!role.includes(roleType)) {
      return res.status(401).send({ message: 'not authorized' })
    }
  };
}
