import { FastifyReply, FastifyRequest } from "fastify";
import { makeRegisterUseCase } from "../../use-cases/factories/make-register-use-case";

export async function refe(req: FastifyRequest, res: FastifyReply) {
    const create = makeRegisterUseCase();
    const rs = await create.refe()


    return res.status(201).send(rs);
}
