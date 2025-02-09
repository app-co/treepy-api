import { FastifyReply, FastifyRequest } from 'fastify';
import { service } from './make';

const make = service()

export class Controller {
  async register(req: FastifyRequest, res: FastifyReply) {
    const id = req.user.sub
    const rs = await make.user(id);

    return res.status(201).send(rs);
  }

  async getUser(req: FastifyRequest, res: FastifyReply) {
    const schema = req.body
    const rs = await make.register(schema);

    return res.status(201).send(rs);
  }

  async getAll(req: FastifyRequest, res: FastifyReply) {
    const schema = req.body
    const rs = await make.register(schema);

    return res.status(201).send(rs);
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    const schema = req.body
    const rs = await make.register(schema);

    return res.status(201).send(rs);
  }

}