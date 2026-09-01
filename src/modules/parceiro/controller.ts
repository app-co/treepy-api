import { CategoriaParceiro } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
	deleteFromS3,
	uploadToS3,
} from "@/shared/providers/s3-upload";
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
	treepyCashe: z.coerce
		.number({ required_error: "treepyCashe é obrigatório" })
		.nonnegative("treepyCashe não pode ser negativo"),
	florestaId: z.coerce
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
	treepyCashe: z.coerce.number().nonnegative().optional(),
	florestaId: z.coerce.number().int().optional(),
	siteUrl: z.string().url().optional(),
});

/**
 * Lê todos os campos e um arquivo opcional de um request multipart.
 * Retorna os campos como Record<string, string> e o arquivo como Buffer (se enviado).
 */
async function parseMultipart(req: FastifyRequest): Promise<{
	fields: Record<string, string>;
	file?: { buffer: Buffer; mimeType: string; filename: string };
}> {
	const parts = req.parts();
	const fields: Record<string, string> = {};
	let file:
		| { buffer: Buffer; mimeType: string; filename: string }
		| undefined;

	for await (const part of parts) {
		if (part.type === "file") {
			const chunks: Buffer[] = [];
			for await (const chunk of part.file) {
				chunks.push(chunk);
			}
			file = {
				buffer: Buffer.concat(chunks),
				mimeType: part.mimetype,
				filename: part.filename,
			};
		} else {
			fields[part.fieldname] = part.value as string;
		}
	}

	return { fields, file };
}

export class Controller {
	async create(req: FastifyRequest, res: FastifyReply) {
		const { fields, file } = await parseMultipart(req);

		const body = createSchema.parse(fields);

		let photoUrl: string | undefined;
		if (file) {
			photoUrl = await uploadToS3(
				file.buffer,
				file.mimeType,
				file.filename,
				"parceiros",
			);
		}

		const parceiro = await serviceParceiro.create({ ...body, photoUrl });
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
		const { fields, file } = await parseMultipart(req);

		const body = updateSchema.parse(fields);

		let photoUrl: string | undefined;
		if (file) {
			// Remove foto antiga do S3 antes de fazer upload da nova
			const existing = await serviceParceiro.findById(id);
			if (existing.photoUrl) {
				await deleteFromS3(existing.photoUrl).catch(() => {
					// Ignora erro ao deletar foto antiga (pode não existir mais)
				});
			}

			photoUrl = await uploadToS3(
				file.buffer,
				file.mimeType,
				file.filename,
				"parceiros",
			);
		}

		const updated = await serviceParceiro.update(id, {
			...body,
			...(photoUrl ? { photoUrl } : {}),
		});
		return res.status(200).send(updated);
	}

	async delete(
		req: FastifyRequest<{ Params: { id: string } }>,
		res: FastifyReply,
	) {
		const { id } = req.params;

		// Remove foto do S3 ao deletar o parceiro
		const existing = await serviceParceiro.findById(id);
		if (existing.photoUrl) {
			await deleteFromS3(existing.photoUrl).catch(() => {
				// Ignora erro ao deletar foto (pode não existir mais no S3)
			});
		}

		await serviceParceiro.delete(id);
		return res.status(204).send();
	}
}
