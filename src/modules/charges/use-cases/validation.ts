/* eslint-disable no-lonely-if */
import { prisma } from '@/lib/prisma';
import { IRepoJangles } from '@/modules/jangles/repositories/repo-jangles';
import {
  calculatorCo2ToTree,
  calculatorCurrencyToTree,
} from '@/utils/unit-formates';

export class Validation {
  constructor(private repoJangle: IRepoJangles) { }

  async execute(client_id: string, amount: number): Promise<any> {
    const jangle = await this.repoJangle.listall();
    const tree = calculatorCurrencyToTree(amount);
    let error = null;

    const calcu = await prisma.calculadora.findFirst({
      where: { fk_user_id: client_id },
    });

    let meta = 0;

    if (calcu) {
      meta = calculatorCo2ToTree(calcu?.total.co2);
    }

    const cashesMany = await prisma.caches.findMany({
      include: { cashe_cliente: true },
    });

    const cashes = cashesMany
      .filter(h => h.treepeycash > 0)
      .sort((a, b) => {
        if (a.treepeycash < b.treepeycash) {
          return -1;
        }
      })
      .map(h => {
        const cach = h.cashe_cliente.filter(p => p.fk_user_id === client_id);

        return {
          ...h,
          cashe_cliente: cach,
        };
      })[0];

    let response = {};

    if (jangle.length === 0) {
      error =
        'Não foi possível completar sua compra, no momento não há TreepyCashes disponíveis para compra. Tente novamente mais tarde';
    }

    if (cashes) {
      const cashe = cashes.treepeycash - tree;
      if (cashes.cashe_cliente.length === 0) {
        // se o cliente nao tiver treepycashe

        if (cashe >= 0) {
          response = {
            create: {
              tree,
              meta,
              cashesId: cashes.id,
              fk_jangle_id: cashes.fk_jangle_id,
              cashe,
            },
          };
        } else {
          error = `Temos apenas ${cashes.treepeycash} TreepyCashes disponível, favor ajustar sua compra`;
        }
      } else {
        if (cashe >= 0) {
          response = {
            up: {
              tree: tree + cashes.cashe_cliente[0].treepycash,
              meta,
              cashesId: cashes.id,
              fk_jangle_id: cashes.fk_jangle_id,
              cashe,
              casheClientId: cashes.cashe_cliente[0].id,
            },
          };
        } else {
          error = `Temos apenas ${cashes.treepeycash} TreepyCashes disponível, favor ajustar sua compra`;
        }
      }
    } else {
      error =
        'Não foi possível completar sua compra, no momento não há TreepyCashes disponíveis para compra. Tente novamente mais tarde';
    }

    const rs = {
      error,
      response,
    };

    return rs;
  }
}
