import { _co2ToTree, _toPorcent } from '@/@utils/unidades';
import { prisma } from '@/lib/prisma';
import { subYears } from 'date-fns';
import { ServiceCalculadora } from '../calculadora/service';
import { ServiceFloresta } from '../florestas/service';

interface IJangle {
  codigo: string
  treepycash: number
  nome: string
}


export class ServiceMetricas {
  constructor(
    private calc: ServiceCalculadora,
    private jangle: ServiceFloresta,
  ) { }

  async user(userId: string) {
    const umAnoAtras = subYears(new Date(), 1);

    const treepycashes = await prisma.treepycaches.findMany({
      where: {
        userId: userId,
        updated_at: {
          gte: umAnoAtras,
        },
      },
      include: {
        floresta: true,
      },
      orderBy: { updated_at: 'asc' }
    })

    const treepycashesInativos = await prisma.treepycaches.findMany({
      where: {
        userId: userId,
        updated_at: {
          lte: umAnoAtras,
        },
      },
      include: {
        floresta: true,
      },
      orderBy: { updated_at: 'asc' }
    })

    const transactions = await prisma.transacoesUser.findMany({
      where: {
        userId
      }
    })

    const florestas = await this.jangle.listAll()

    const calculadora = await this.calc.getCalcById(userId)

    const totalTreepycash = treepycashes.filter(h => h.isValid).reduce((acc, curr) => acc + curr.qnt, 0);
    const meta = _co2ToTree(calculadora?.total ?? 0);
    const porcentagemAtingida = calculadora ? Number((totalTreepycash / meta).toFixed(2)) : 0

    let jangle: IJangle[] = []

    florestas.forEach(h => {
      const calculo = treepycashes.find(t => t.florestaId === h.id)
      if (calculo && calculo.isValid) {
        jangle.push({
          codigo: h.codigo,
          treepycash: calculo.qnt,
          nome: h.nome,
        })
      }
    })

    return {
      compensacao: {
        co2Anual: calculadora?.total ?? 0,
        treepy: totalTreepycash,
        meta,
        isValid: calculadora ? true : false,
        porcentagemAtingida: _toPorcent(porcentagemAtingida)
      },
      floresta: jangle,
      treepycashesAtivos: treepycashes,
      treepycashesInativos: treepycashesInativos,
      transactions
    }
  }
}