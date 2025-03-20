import { FastifyReply, FastifyRequest } from "fastify";
import { schemas } from "./dtos/schemas";
import { make } from "./make";

const service = make()

export class ControlerTransactions {
  async card(req: FastifyRequest, res: FastifyReply) {
    const obj = schemas.card.parse(req.body)

    const rs = await service.pay_card(obj);
    return res.status(201).send(rs);
  }
  async pix(req: FastifyRequest, res: FastifyReply) {
    const obj = schemas.pix.parse(req.body)

    const rs = await service.pay_pix(obj);
    return res.status(201).send(rs);
  }
  async boleto(req: FastifyRequest, res: FastifyReply) { 
    const obj = schemas.boleto.parse(req.body)

    const rs = await service.pay_boleto(obj);
    return res.status(201).send(rs);
  }
  async webhook(req: FastifyRequest, res: FastifyReply) {
    const obj = req.body
    const rs = await service.webHooks(obj);
    return res.status(200).send(rs);
  }
}