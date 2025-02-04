import { prisma } from '@/lib/prisma';
import { IRepoJangles } from '@/modules/jangles/repositories/repo-jangles';
import { calculatorCurrencyToTree } from '@/utils/unit-formates';

import { IUsersRepository } from '../repositories/IUser-repository';

interface IRelatorioJangle {
  name: string;
  codigo: string;
  cashe_total: number;
  restant: number;
}

interface IRelatorioCharges {
  cashePaid: number;
  cashePeding: number;
  month: number;
}

interface IRelatorioUser {
  qntUser: number;
}

const moth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export class RelatorioAdm {
  constructor(
    private repoJangle: IRepoJangles,
    private repoUsers: IUsersRepository,
  ) { }

  async execute(): Promise<any> {
    const jangleList = await this.repoJangle.listall();
    const userList = await this.repoUsers.listAll();
    const caches = await prisma.caches.findMany();
    const chargesList = await prisma.charges.findMany();

    const charges = chargesList.map(charge => {
      let cashePaid = 0;
      let cashePeding = 0;

      const getMonth = charge.updated_at.getMonth() + 1;

      if (charge.status === 'PAID' || charge.status === 'AUTHORIZED') {
        cashePaid = calculatorCurrencyToTree(charge.value);
      } else {
        cashePeding = calculatorCurrencyToTree(charge.value);
      }

      return {
        cashePaid,
        cashePeding,
        getMonth,
      };
    });

    const relatorioUser: IRelatorioUser[] = [];
    moth.forEach(month => {
      let relatorio = {
        qntUser: 0,
      };
      userList.forEach(h => {
        const qntUser = 0;
        const getMonth = h.created_at.getMonth();
        const getYear = h.created_at.getFullYear();

        const currentyYear = new Date(Date.now()).getFullYear();

        if (getMonth === month && currentyYear === getYear) {
          relatorio = {
            qntUser: relatorio.qntUser + 1,
          };
        }
      });

      relatorioUser.push(relatorio);
    });

    const relatorioCharges: IRelatorioCharges[] = [];
    moth.forEach(month => {
      let relatorio = {
        cashePaid: 0,
        cashePeding: 0,
        month,
      };

      charges.forEach(charge => {
        if (month === charge.getMonth) {
          relatorio = {
            cashePaid: relatorio.cashePaid + charge.cashePaid,
            cashePeding: relatorio.cashePeding + charge.cashePeding,
            month,
          };
        }
      });
      relatorioCharges.push(relatorio);
    });

    const relatorioJangle: IRelatorioJangle[] = [];
    caches.forEach(cashe => {
      jangleList.forEach(jangle => {
        if (cashe.fk_jangle_id === jangle.id) {
          const relatorio = {
            name: jangle.name,
            codigo: jangle.codigo,
            cashe_total: jangle.tree,
            restant: jangle.tree - cashe.treepeycash,
          };

          relatorioJangle.push(relatorio);
        }
      });
    });

    return {
      relatorioJangle,
      relatorioCharges,
      relatorioUser,
    };
  }
}
