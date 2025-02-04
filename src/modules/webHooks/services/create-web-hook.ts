/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma';
import { Err } from '@/modules/charges/errors/Err';
import { IRepoCharge } from '@/modules/charges/repositories/IRepoCharges';
import { Validation } from '@/modules/charges/use-cases/validation';
import { PrismaJangles } from '@/modules/jangles/repositories/PrismaJangles';
import { IMailProvider } from '@/shared/providers/emails/providers/models/IMailProvider';
import { hooks } from '@prisma/client';
import path from 'path';

import { IWebhookRepository } from '../repositories/IRepository/IWebhook-repository';

interface props {
  id: string;
}

const repo = new PrismaJangles();
const validation = new Validation(repo);

export class CreateWebhook {
  constructor(
    private repoOrders_Message: IWebhookRepository,
    private repoCharges: IRepoCharge,
    private repoMail: IMailProvider,
  ) { }

  async create(object: any): Promise<void> {
    const { customer, charges } = object;

    const statusOrder = {
      PAID: 'Pagamento confirmado',
      AUTHORIZED: 'Pagamento confirmado',
      WAITING: 'Aguardando pagamento',
      CANCELED: 'Cancelado',
      DECLINED: 'Não foi possível completar o seu pagamento',
    };

    const order = await this.repoCharges.findByOrderId(object.id);

    if (order) {
      await this.repoCharges.update(
        {
          ...order,
          status: charges[0].status,
        },
        order.id,
      );
    }

    const bar = path.resolve(
      __dirname,
      '..',
      '..',
      'users',
      'view',
      'aproved.hbs',
    );

    const { status } = charges[0];

    const confirmation = {
      PAID: 'PAID',
      AUTHORIZED: 'AUTHORIZED',
    };

    if (
      status === confirmation[status] &&
      charges[0].payment_method.type !== 'CREDIT_CARD'
    ) {
      const vali = await validation.execute(
        object.reference_id,
        Number(object.items[0].unit_amount),
      );

      if (vali.response.create) {
        const dt = vali.response.create;
        await prisma.cashe_cliente.create({
          data: {
            treepycash: dt.tree,
            cachesId: dt.cashesId,
            meta: dt.meta,
            fk_user_id: object.reference_id,
            fk_jangle_id: dt.fk_jangle_id,
          },
        });

        await prisma.caches.update({
          where: { fk_jangle_id: dt.fk_jangle_id },
          data: {
            treepeycash: dt.cashe,
          },
        });
      }

      if (vali.response.up) {
        const dt = vali.response.up;
        await prisma.cashe_cliente.update({
          where: { id: dt.casheClientId },
          data: {
            treepycash: dt.tree,
            cachesId: dt.cashesId,
          },
        });

        await prisma.caches.update({
          where: { fk_jangle_id: dt.fk_jangle_id },
          data: {
            treepeycash: dt.cashe,
          },
        });
      }
    }

    await this.repoMail.sendMail({
      to: {
        name: customer?.name,
        email: customer?.email,
      },
      subject: 'Treepy - Status da sua compra - Parabéns pela iniciativa!',
      templateData: {
        file: bar,
        variables: {
          name: customer.name,
          status: statusOrder[status],
        },
      },
    });
  }

  async findById({ id }: props): Promise<hooks> {
    const list = await this.repoOrders_Message.findById(id);

    if (!list) {
      throw new Err('Nada encontrado');
    }

    return list;
  }

  async listMany(): Promise<any[]> {
    const list = await this.repoOrders_Message.listMany();
    const charges = await this.repoCharges.listAll();

    const lis = list.map(h => {
      let data = {};

      if (h.object) {
        const charge = h?.object?.charges[0];
        const updated = charge.paid_at;
        const { type } = charge.payment_method;
        const { status } = charge;
        const valor = charge.amount.summary.paid;
        data = {
          order: h.object.id,
          updated,
          type,
          status,
          valor,
        };
      }

      return data;
    });
    const char = [];

    charges.forEach(charge => {
      lis.forEach(hook => {
        if (charge.order_id === hook.order) {
          const dt = {
            ...hook,
            fk_user_id: charge.fk_user_id,
          };
          char.push(dt);
        } else {
          const dt = {
            order: charge.order_id,
            updated: charge.created_at,
            type: '',
            status: 'PENDENTE',
            valor: 'PROCESSANDO',
          };

          char.push(dt);
        }
      });
    });

    return char;
  }
}
