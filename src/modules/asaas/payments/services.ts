import { prisma } from '@/lib/prisma';
import { Err } from '@/modules/charges/errors/Err';
import { Metricass } from '@/modules/metricas/service';
import {
  calculatorCo2ToTree,
  calculatorCurrencyToTree,
  removeStrings,
} from '@/utils/unit-formates';
import axios from 'axios';
import { addDays, format } from 'date-fns';
import { v4 as uuid } from 'uuid';

import { api } from './api';
import { schemaCharges, schemaValidatePayment } from './schemas';
import { TCharges, TValidationPayment } from './types';

interface iResponseWeebHook {
  id: string;
  event: string;
  payment: Payment;
}

interface Payment {
  object: string;
  id: string;
}

const metrica = new Metricass();

export class PaymentsService {
  async credentials(userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        profile: true,
        cardToken: true,
        end: true,
      },
    });

    if (!user) {
      throw new Err('user not found');
    }

    if (!user.cpf) {
      throw new Err('Conclua seu perfil');
    }

    let customer = user?.customer ?? null;

    if (!user?.customer) {
      const cpfCnpj = removeStrings(user!.cpf);
      try {
        const { data } = await api.post('customers', {
          name: user.full_name,
          cpfCnpj,
          mobilePhone: `${user.phone_area}${user.phone_number}`,
        });

        customer = data.id;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            customer: data.id,
          },
        });
      } catch (error) {
        if (error instanceof Err) throw new Err(error.error);
      }
    }

    return { user, customer, cardToken: user.cardToken };
  }

  private async createOrder(input: TCharges) {
    const data = schemaCharges.parse(input);

    const jangle = await prisma.jangle.findFirst({
      where: {
        tree: { gt: 0 },
      },
      orderBy: {
        tree: 'asc',
      },
      select: {
        tree: true,
        id: true,
      },
    });

    const tree = calculatorCurrencyToTree(input.value);

    if (!jangle) {
      throw new Err(
        'Não foi possível completar sua compra, no momento não há TreepyCashes disponíveis para compra. Tente novamente mais tarde',
      );
    }

    if (tree > jangle?.tree) {
      throw new Err(
        'Não foi possível completar sua compra, no momento não há TreepyCashes disponíveis para compra. Tente uma quantidade de TreepyCashes menor',
      );
    }

    await prisma.charges.create({
      data: {
        order_id: data.orderId,
        charge_id: uuid(),
        fk_user_id: data.userId,
        customer: '',
        status: 'pendente',
        value: data.value,
        type: data.type,
      },
    });
  }

  public async updatePaymentTransation(input: TValidationPayment) {
    const data = schemaValidatePayment.parse(input);
    const findOrder = await prisma.charges.findFirst({
      where: { order_id: data.orderId },
    });

    if (findOrder) {
      await prisma.charges.update({
        where: { id: findOrder.id },
        data: {
          status: 'pago',
        },
      });
    }

    let jangle = {} as {
      id: string;
      tree: number;
      treepycash: { id: string; treepeycash: number };
    };

    if (input.adm) {
      jangle = await prisma.jangle.findFirst({
        where: { ordem: 3 },
        select: { treepycash: true, id: true, tree: true },
      });

      await prisma.charges.create({
        data: {
          order_id: '001',
          charge_id: uuid(),
          fk_user_id: input.userId!,
          customer: '01',
          status: 'pago',
          value: data.tree,
          type: 'adm',
        },
      });
    }

    if (!input.adm) {
      jangle = await prisma.jangle.findFirst({
        where: {
          AND: [
            {
              tree: {
                gt: 0,
              },
            },

            {
              treepycash: {
                treepeycash: {
                  gte: input.tree,
                },
              },
            },
          ],
        },
        orderBy: {
          ordem: 'asc',
        },
        include: {
          treepycash: true,
        },
      });
    }

    if (!jangle) {
      throw new Err('Jangle not found');
    }

    const { id, tree, treepycash } = jangle;

    const userCache = await prisma.cashe_cliente.findFirst({
      where: { fk_jangle_id: jangle.id },
    });

    const calculadora = await prisma.calculadora.findFirst({
      where: { fk_user_id: findOrder?.fk_user_id ?? input.userId! },
      select: { total: true },
    });

    const meta = calculadora ? calculatorCo2ToTree(calculadora!.total) : 0;

    if (!userCache) {
      await prisma.caches.update({
        where: { id: treepycash!.id },
        data: {
          treepeycash: tree - input.tree,
          cashe_cliente: {
            connectOrCreate: {
              create: {
                fk_user_id: findOrder?.fk_user_id ?? input.userId!,
                fk_jangle_id: id,
                treepycash: input.tree,
                meta,
              },
              where: {
                fk_user_id: findOrder?.fk_user_id ?? input.userId!,
              },
            },
          },
        },
      });
      return null;
    }

    await prisma.caches.update({
      where: { id: treepycash!.id },
      data: {
        treepeycash: treepycash!.treepeycash - input.tree,
        cashe_cliente: {
          update: {
            data: {
              fk_user_id: findOrder?.fk_user_id ?? input.userId!,
              fk_jangle_id: id,
              treepycash: userCache!.treepycash + input.tree!,
              meta,
            },
            where: {
              fk_user_id: findOrder?.fk_user_id ?? input.userId!,
            },
          },
        },
      },
    });

    return null;
  }

  async cardToken(input: TCardToken) {
    const credentials = await this.credentials(input.userId);
    const { customer, end, cardToken } = credentials.user;

    const remotIp = await axios.get('https://api.ipify.org?format=json');

    if (!customer || !end) {
      throw new Err('Finalize seu perfil');
    }

    const dt = {
      customer: credentials.customer,
      remoteIp: remotIp.data.ip,
      creditCard: {
        holderName: input.holderName,
        number: input.card_number,
        expiryMonth: input.expiryMonth,
        expiryYear: input.expiryYear,
        ccv: input.ccv,
      },
      creditCardHolderInfo: {
        name: credentials.user.full_name,
        email: credentials.user.email,
        cpfCnpj: credentials.user.cpf,
        postalCode: end.postal_code,
        addressNumber: end.home_number,
        addressComplement: null,
        phone: credentials.user.phone_number,
        mobilePhone: credentials.user.phone_number,
      },
    };

    try {
      let token = cardToken;
      const { data } = await api.post('creditCard/tokenize', dt);

      if (cardToken) {
        token = await prisma.cardToken.update({
          where: { id: cardToken.id },
          data: {
            userId: input.userId,
            brand: data.creditCardBrand,
            number: data.creditCardNumber,
            token: data.creditCardToken,
          },
        });

        return token;
      }

      if (input.permission) {
        token = await prisma.cardToken.create({
          data: {
            userId: input.userId,
            brand: data.creditCardBrand,
            number: data.creditCardNumber,
            token: data.creditCardToken,
          },
        });
      }

      if (!input.permission) {
        token = data;
      }

      return token;
    } catch (error) {
      if (error instanceof Err) {
        throw new Err(error.error);
      }
    }

    return null;
  }

  async card(input: TCard) {
    const { customer } = await this.credentials(input.userId);

    const dt = {
      billingType: 'CREDIT_CARD',
      creditCardToken: input.cardToken,
      customer,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      value: input.amount / 100,
      description: 'Compra pelo app Geb-cashback',
      externalReference: uuid,
      installmentCount: input.installmentCount,
      installmentValue:
        input.installmentValue === 0
          ? input.amount / 100
          : input.installmentValue,
    };

    try {
      const pay = await api.post('/payments', dt);
      if (pay.data.status === 'CONFIRMED') {
        await this.createOrder({
          userId: input.userId,
          orderId: pay.data.id,
          type: 'cartao',
          value: input.amount,
        });
        await this.updatePaymentTransation({
          orderId: pay.data.id,
          tree: calculatorCurrencyToTree(input.amount),
        });
      }
      return pay.data;
    } catch (error) {
      if (error instanceof Err) {
        throw new Err(error.error);
      } else {
        throw new Err('Erro interno', 500);
      }
    }

    return dt;
  }

  async pix({ value, userId }: TPix) {
    await this.credentials(userId);
    try {
      const dt = {
        addressKey: 'contato@treepy.com.br',
        description: 'Compra de TreepyCaches',
        value: value / 100,
        format: 'ALL',
        expirationDate: addDays(new Date(), 1),
      };

      const { data } = await api.post('/pix/qrCodes/static', dt);

      await this.createOrder({
        userId,
        orderId: data.id,
        type: 'pix',
        value,
      });

      return {
        payload: data.payload,
        image: data.encodedImage,
      };
    } catch (error) {
      if (error instanceof Err) {
        throw new Err(error.error);
      }
    }

    return null;
  }

  async boleto({ value, userId }: TPix) {
    const credentials = await this.credentials(userId);
    const dt = {
      customer: credentials.customer,
      billingType: 'BOLETO',
      value: value / 100,
      dueDate: addDays(new Date(), 5),
    };

    try {
      const { data } = await api.post('/payments', dt);
      const barCode = await api.get(`payments/${data.id}/identificationField`);

      const response = {
        invoiceUrl: data.invoiceUrl,
        barCode: barCode.data.barCode,
        id: data.id,
      };

      await this.createOrder({
        orderId: response.id,
        userId,
        type: 'boleto',
        value,
      });

      return response;
    } catch (error) {
      if (error instanceof Err) {
        throw new Err(error.error);
      }
    }

    return null;
  }

  async responsePix(data: iResponseWeebHook) {
    let order = null;
    if (
      data.event === 'PAYMENT_RECEIVED' ||
      data.event === 'PAYMENT_CONFIRMED'
    ) {
      order = await prisma.charges.findFirst({
        where: {
          AND: [
            {
              status: 'pendente',
            },
            {
              order_id: data.payment.id,
            },
          ],
        },
      });

      if (!order) {
        throw new Err('Order not found');
      }

      await this.updatePaymentTransation({
        orderId: order.id,
        tree: calculatorCurrencyToTree(order.value),
      });
    }
    return order;
  }

  async responseCard() { }

  async registerWebhook() {
    try {
      const dt = {
        name: 'teste-2',
        url: 'https://treepy-server.appcom.dev/asaas/webhook',
        email: 'contato@treepy.com.br',
        enabled: true,
        interrupted: false,
        authToken: null,
        sendType: 'SEQUENTIALLY',
        events: ['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED'],
      };

      await api.post('/webhooks', dt);
    } catch (error) {
      if (error instanceof Err) {
        throw new Err(error.m);
      }
    }
  }

  async registerKeyPix() {
    await api.post('/addressKeys', {
      type: 'EVP',
    });
  }
}
