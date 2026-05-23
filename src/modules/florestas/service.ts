import { prisma } from "@/lib/prisma";
import { AppError } from "@/shared/app-error/AppError";
import type RedisCacheProvider from "@/shared/providers/redis/redis-provider";
import type { IFloresta } from "./dtos/interfaces";
import type { TCreateFloresta } from "./dtos/types";

export class ServiceFloresta {
	constructor(private redis: RedisCacheProvider) { }

	async create(obj: Omit<TCreateFloresta, "id">) {

		const floresta = await prisma.florestas.findFirst({
			where: { codigo: obj.codigo },
		});

		if (floresta) {
			throw new AppError("Floresta já cadastrada com esse código");
		}

		const create = await prisma.florestas.create({
			data: obj,
		});

		await this.redis.invalidatePrefix(`${obj.projeto}:florestas`);
		await this.redis.invalidate("florestas");

		return create;
	}

	async update(obj: TCreateFloresta) {
		const floresta = await this.byProjeto(obj.projeto);

		if (!floresta) {
			throw new AppError("Floresta não encontrada");
		}

		await prisma.florestas.update({
			where: {
				projeto: floresta.projeto,
			},
			data: obj,
		});

		await this.redis.invalidatePrefix(`${obj.projeto}:florestas`);
		await this.redis.invalidate(`florestas`);
	}

	async byProjeto(projeto: number) {
		const key = `projeto:${projeto}`

		let floresta = await this.redis.recover<TCreateFloresta>(key);

		if (floresta) {
			return floresta
		}


		const find = await prisma.florestas.findUnique({
			where: { projeto },
		});
		await this.redis.save(key, find);

		return find;
	}

	async byId(florestaId: number) {
		const key = `projeto:${florestaId}`
		let floresta = await this.redis.recover<TCreateFloresta>(
			`${florestaId}:florestas`,
		);

		if (floresta) {
			return floresta
		}


		const find = await prisma.florestas.findUnique({
			where: { id: florestaId },
		});
		await this.redis.save(key, find);

		return find;
	}

	async listAll() {
		const key = `projeto:all`
		let florestas = await this.redis.recover<IFloresta[]>(key);

		if (florestas) {
			return florestas
		}

		florestas = await prisma.florestas.findMany();
		await this.redis.save(key, florestas);
		return florestas;
	}

	async deletefloresta(projeto: number) {
		const floresta = await this.byId(projeto);

		if (!floresta) {
			throw new AppError("Floresta não encontrada");
		}

		await prisma.florestas.delete({ where: { projeto } });

		await this.redis.invalidatePrefix(`${projeto}`);
		await this.redis.invalidate(`projeto:all`);
	}
}
