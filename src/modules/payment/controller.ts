import type { FastifyReply, FastifyRequest } from "fastify";
import { ServicePayment } from "./service";

const make = new ServicePayment();

export class Controller {
	async register(req: FastifyRequest, res: FastifyReply) {
		const schema = req.body;
		const rs = await make.registerWebhook();

		return res.status(201).send(rs);
	}

	async listar(req: FastifyRequest, res: FastifyReply) {
		const rs = await make.listarWebHooks();

		return res.status(201).send(rs);
	}

	async deletar(req: FastifyRequest, res: FastifyReply) {
		const { id } = req.params as { id: string };
		const rs = await make.deletarWebhook(id);

		return res.status(201).send(rs);
	}

	async atualizar(req: FastifyRequest, res: FastifyReply) {
		const { id } = req.params as { id: string };
		const rs = await make.atualizarWebhook(id);

		return res.status(201).send(rs);
	}
}
