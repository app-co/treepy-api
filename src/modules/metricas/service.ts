import { prisma } from '@/lib/prisma';
import { _toPtBrNumber, calculatorCo2ToTree } from '@/utils/unit-formates';

import { Err } from '../charges/errors/Err';

export class Metricass {
  async user(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        Calculadora: true,
        cashe_cliente: true,
        Charges: {
          select: {
            status: true,
            updated_at: true,
            value: true,
            type: true,
          },
        },
      },
    });

    if (!user) {
      throw new Err('User not found');
    }

    const caches = user.cashe_cliente ?? [];

    const jangles = await prisma.jangle.findMany({
      where: {
        id: { in: caches.map(h => h.fk_jangle_id) },
      },
      select: {
        id: true,
        codigo: true,
        name: true,
        lat: true,
        log: true,
        tree: true,
      },
    });

    const floresta = jangles.map(h => {
      const tree = caches.find(p => p.fk_jangle_id === h.id);

      return {
        ...h,
        tree: tree?.treepycash ?? 0,
      };
    });

    const history = await prisma.history.findMany({
      where: { fk_user_id: userId },
      take: 10,
      orderBy: { updated_at: 'desc' },
    });

    const treepyCashes = user.cashe_cliente.reduce(
      (ac, item) => ac + item.treepycash,
      0,
    );

    const orders = user.Charges;

    let pagamentos = {};

    orders.forEach(h => {
      const aprovados = orders.filter(p => p.status === 'pago');
      const pendentes = orders.filter(p => p.status === 'pendente');
      const recusado = orders.filter(p => p.status === 'recusado');

      pagamentos = {
        aprovados,
        pendentes,
        recusado,
      };
    });

    const calculadora = {
      eletricidade: _toPtBrNumber(user.Calculadora?.eletricidade ?? '0'),
      gas: _toPtBrNumber(user?.Calculadora?.gas ?? '0'),
      transporte_individual: _toPtBrNumber(
        user.Calculadora?.transporte_individual ?? '0',
      ),
      transporte_coletivo: _toPtBrNumber(
        user.Calculadora?.transporte_coletivo ?? '0',
      ),
      alimentacao: _toPtBrNumber(user.Calculadora?.alimentacao ?? '0'),
      residuos: _toPtBrNumber(user.Calculadora?.residuos ?? '0'),
      total: _toPtBrNumber(user.Calculadora?.total ?? '0'),
    };

    const dt = {
      meta: calculatorCo2ToTree(Number(user.Calculadora?.total) ?? '0'),
      qnt_trepycaches: treepyCashes,
      history,
      calculadora,
      pagamentos,
      floresta,
    };

    return dt;
  }

  async admin() {
    const users = await prisma.user.findMany({
      include: {
        Calculadora: true,
        History: true,
      },
    });

    users.forEach(user => {
      const { History, Calculadora } = user;
    });

    return users;
  }
}
