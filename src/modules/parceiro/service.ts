import { prisma } from "@/lib/prisma";
import { AppError } from "@/shared/app-error/AppError";
import type { CategoriaParceiro } from "@prisma/client";

export interface ICreateParceiroDTO {
	nomeEmpresa: string;
	minDescription: string;
	fullDescription: string;
	photoUrl?: string;
	treepyCashe: number;
	florestaId: number;
	siteUrl?: string;
	userId: string;
	categoria: CategoriaParceiro;
}

export interface IUpdateParceiroDTO {
	nomeEmpresa?: string;
	minDescription?: string;
	fullDescription?: string;
	photoUrl?: string;
	treepyCashe?: number;
	florestaId?: number;
	siteUrl?: string;
}

export class Service {
	async create(data: ICreateParceiroDTO) {
		const existing = await prisma.parceiro.findUnique({
			where: { userId: data.userId },
		});

		if (existing) {
			throw new AppError(
				"Usuário já possui um parceiro cadastrado.",
				409,
			);
		}

		const parceiro = await prisma.parceiro.create({ data });

		return parceiro;
	}

	async findById(id: string) {
		const parceiro = await prisma.parceiro.findFirst({
			where: { id },
			include: {
				user: {
					select: {
						id: true,
						nome: true,
						email: true,
						photUrl: true,
					},
				},
				floresta: {
					select: { id: true, nome: true, codigo: true },
				},
			},
		});

		if (!parceiro) {
			throw new AppError("Parceiro não encontrado.", 404);
		}

		return parceiro;
	}

	async listAll() {
		const list = await prisma.parceiro.findMany({
			include: {
				user: {
					select: {
						id: true,
						nome: true,
						email: true,
						photUrl: true,
					},
				},
				floresta: {
					select: { id: true, nome: true, codigo: true },
				},
			},
			orderBy: { created_at: "desc" },
		});

		return list;
	}

	async update(id: string, data: IUpdateParceiroDTO) {
		await this.findById(id);

		const updated = await prisma.parceiro.update({
			where: { id },
			data,
		});

		return updated;
	}

	async delete(id: string) {
		await this.findById(id);

		await prisma.parceiro.delete({ where: { id } });
	}
}

export const serviceParceiro = new Service();
