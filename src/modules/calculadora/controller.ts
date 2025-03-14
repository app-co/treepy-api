import { FastifyReply, FastifyRequest } from 'fastify';
import { validation } from './dtos/validation';
import { service } from './make';

const make = service()

export class Controller {
  async register(req: FastifyRequest, res: FastifyReply) {
    const schema = validation.registerCalculadora.parse(req.body)
    const rs = await make.register(schema);

    return res.status(201).send(rs);
  }

  async byUserId(req: FastifyRequest, res: FastifyReply) {
    const id = req.user.sub
    const rs = await make.getCalcById(id);

    return res.status(201).send(rs);
  }

  async getAll(req: FastifyRequest, res: FastifyReply) {
    const id = req.user.sub
    const rs = await make.getAllByUserId(id);

    return res.status(201).send(rs);
  }


}