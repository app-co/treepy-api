import { FastifyReply, FastifyRequest } from 'fastify';
import { validation } from './dtos/validations';
import { make } from './make';

const service = make()

export class Controller {
  async register(req: FastifyRequest, res: FastifyReply) {
    const schema = validation.create.omit({ id: true }).parse(req.body)
    const rs = await service.create(schema);

    return res.status(201).send(rs);
  }

  async byProjeto(req: FastifyRequest, res: FastifyReply) {
    const { projeto } = req.params as { projeto: string }

    const rs = await service.byProjeto(Number(projeto));

    return res.status(201).send(rs);
  }

  async getAll(req: FastifyRequest, res: FastifyReply) {
    const rs = await service.listAll();

    return res.status(201).send(rs);
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    const projeto = req.query
    const rs = await service.deletefloresta(Number(projeto));

    return res.status(201).send(rs);
  }

}