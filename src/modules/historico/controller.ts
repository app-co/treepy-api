import { FastifyReply, FastifyRequest } from 'fastify';
import { make } from '../user/make';

const service = make()


export class Controller {
  async register(req: FastifyRequest, res: FastifyReply) {
    const schema = req.body
    const rs = await service.register(schema);

    return res.status(201).send(rs);
  }

  async getUser(req: FastifyRequest, res: FastifyReply) {
    const schema = req.body
    const rs = await service.register(schema);

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