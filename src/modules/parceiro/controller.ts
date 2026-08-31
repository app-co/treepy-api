import { CategoriaParceiro } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { serviceParceiro } from "./service";

const createSchema = z.object({
	nomeEmpresa: z
		.string({ required_error: "Nome da empresa é obrigatório" })
		.min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
	minDescription: z
		.string({ required_error: "Descrição curta é obrigatória" })
		.min(10, "Descrição curta deve ter pelo menos 10 caracteres"),
	fullDescription: z
		.string({ required_error: "Descrição completa é obrigatória" })
		.min(20, "Descrição completa deve ter pelo menos 20 caracteres"),
	photoUrl: z.string().url("URL da foto inválida").optional(),
	treepyCashe: z
		.number({ required_error: "treepyCashe é obrigatório" })
		.nonnegative("treepyCashe não pode ser negativo"),
	florestaId: z
		.number({ required_error: "florestaId é obrigatório" })
		.int("florestaId deve ser um inteiro"),
	siteUrl: z.string().url("URL do site inválida").optional(),
	userId: z
		.string({ required_error: "userId é obrigatório" })
		.uuid("userId inválido"),
	categoria: z.nativeEnum(CategoriaParceiro),
});

const updateSchema = z.object({
	nomeEmpresa: z.string().min(2).optional(),
	minDescription: z.string().min(10).optional(),
	fullDescription: z.string().min(20).optional(),
	photoUrl: z.string().url().optional(),
	treepyCashe: z.number().nonnegative().optional(),
	florestaId: z.number().int().optional(),
	siteUrl: z.string().url().optional(),
});

export class Controller {
	async create(req: FastifyRequest, res: FastifyReply) {
		const body = createSchema.parse(req.body);
		const parceiro = await serviceParceiro.create(body);
		return res.status(201).send(parceiro);
	}

	async findById(
		req: FastifyRequest<{ Params: { id: string } }>,
		res: FastifyReply,
	) {
		const { id } = req.params;
		const parceiro = await serviceParceiro.findById(id);
		return res.status(200).send(parceiro);
	}

	async listAll(req: FastifyRequest, res: FastifyReply) {
		const list = await serviceParceiro.listAll();
		return res.status(200).send(list);
	}

	async update(
		req: FastifyRequest<{ Params: { id: string } }>,
		res: FastifyReply,
	) {
		const { id } = req.params;
		const body = updateSchema.parse(req.body);
		const updated = await serviceParceiro.update(id, body);
		return res.status(200).send(updated);
	}

	async delete(
		req: FastifyRequest<{ Params: { id: string } }>,
		res: FastifyReply,
	) {
		const { id } = req.params;
		await serviceParceiro.delete(id);
		return res.status(204).send();
	}
}
