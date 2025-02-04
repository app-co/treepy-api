/* eslint-disable consistent-return */
import { FastifyReply, FastifyRequest } from 'fastify';

type T = 'ADMIN' | 'USER';

export function rolesMeddle(roleType: T) {
  return (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user;

    if (role !== roleType) {
      return res
        .status(401)
        .send({ message: 'Apenas admin podem acessar essa rota' });
    }
  };
}
