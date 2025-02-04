import { FastifyReply, FastifyRequest } from "fastify";
import { make } from "./make";
import { schemas } from "./mox/schemas";

const service = make()

export class ControlerTransactions {
  async card(req: FastifyRequest, res: FastifyReply) {
    const obj = schemas.card.parse(req.body)

    const rs = await service.pay_card(obj);
    return res.status(201).send(rs);
  }
  async pix(req: FastifyRequest, res: FastifyReply) {
    const obj = req.body

    const rs = await service.pay_pix(obj);
    return res.status(201).send(rs);
  }
  async boleto(req: FastifyRequest, res: FastifyReply) { }
}