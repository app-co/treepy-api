import { FastifyReply, FastifyRequest } from "fastify";
import { precificacaoService } from "./service";

const service = precificacaoService

class PrecificacaoController {
    constructor() { }

    async update(req: FastifyRequest, res: FastifyReply) {
        const obj = req.body as { price: number }

        const rs = await service.update(obj.price);
        return res.status(201).send(rs);
    }

    async get(req: FastifyRequest, res: FastifyReply) {
        const rs = await service.get();
        return res.status(200).send(rs);
    }
}

export default new PrecificacaoController();