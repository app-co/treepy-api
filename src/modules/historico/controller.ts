import { FastifyReply, FastifyRequest } from 'fastify';
import { makeService } from './make';

const service = makeService()


export class Controller {
  async register(req: FastifyRequest, res: FastifyReply) {
    const schema = req.body
    const rs = await service.register(schema);

    return res.status(201).send(rs);
  }

  async getByUser(req: FastifyRequest, res: FastifyReply) {
    const userId = req.user.sub
    const rs = await service.getUserById(userId);

    return res.status(201).send(rs);
  }

  async getAll(req: FastifyRequest, res: FastifyReply) {
    const schema = req.body
    const rs = await service.register(schema);

    return res.status(201).send(rs);
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    const schema = req.body
    const rs = await service.register(schema);

    return res.status(201).send(rs);
  }

}