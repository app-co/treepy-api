import { prisma } from "@/lib/prisma";
import { AppError } from "@/shared/app-error/AppError";

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
    }

    async get() {
        return await prisma.precificacao.findFirst();
    }
}

const precificacaoService = new PrecificacaoService()

export { precificacaoService };