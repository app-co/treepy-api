import type { FastifyReply, FastifyRequest } from "fastify";
import { service } from "./make";

const make = service();

export class Controller {
	async register(req: FastifyRequest, res: FastifyReply) {
		const id = req.user.sub;
		const rs = await make.user(id);

		return res.status(201).send(rs);
	}

	async admin(req: FastifyRequest, res: FastifyReply) {
		const rs = await make.admin();

		return res.status(201).send(rs);
	}

	async dashUser(req: FastifyRequest, res: FastifyReply) {
		const { ano } = req.query as { ano: string };
		const id = req.user.sub;
		const rs = await make.dashBoardUser(id, Number(ano));

		return res.status(201).send(rs);
	}
}
