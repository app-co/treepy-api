import { prisma } from "@/lib/prisma";
import { AppError } from "@/shared/app-error/AppError";
import RedisCacheProvider from "@/shared/providers/redis/redis-provider";

const redis = new RedisCacheProvider();

interface IPreco {
	unid_trepycash: number;
	created_at: Date;
	updated_at: Date;
	id: number;
}

class PrecificacaoService {
	async update(price: number) {
		const precificacao = await prisma.precificacao.findFirst();

		if (!precificacao) {
			throw new AppError("Precificação não encontrada");
		}

		await prisma.precificacao.update({
			where: { id: precificacao.id },
			data: { unid_trepycash: price },
		});

		await redis.invalidate("preco");
	}

	async get(): Promise<IPreco> {
		const key = "preco";
		const preco = await redis.recover<IPreco>(key);

		if (preco) return preco;
		const precificacao = await prisma.precificacao.findFirst();

		await redis.save(key, precificacao);

		return precificacao as IPreco;
	}
}

const precificacaoService = new PrecificacaoService();

export { precificacaoService };
