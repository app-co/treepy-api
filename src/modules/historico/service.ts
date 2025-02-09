import { prisma } from '@/lib/prisma';
import { AppError } from '@/shared/app-error/AppError';


export class HistoricoService {

  async create(data: { titulo: string, descricao: string, userId: string }) {
    const historico = await prisma.historico.create({
      data,
    });

    return historico;
  }

  async getUserById(userId: string) {
    const find = await prisma.historico.findUnic({ where: { id: userId } });

    if (!find) {
      throw new AppError('Not found');
    }
    return find
  }

  async listAll() {

    const list = await prisma.historico.findMany();

    return list
  }
}