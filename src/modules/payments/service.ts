/* eslint-disable no-restricted-syntax */
import { prisma } from '@/lib/prisma';
import { removeStrings } from '@/utils/unit-formates';
import { v4 as uuidv4 } from 'uuid';

import { Err } from '../charges/errors/Err';
import { pg_api } from './pg-api';
import { TCard } from './schema';

interface ICredentials {
  userId: string;
  amount: number;
}

const errorsPayment: any = {
  region: 'Estado inválido',
  city: 'Cidade inválida',
  postal_code: 'CEP inválido',
  number: 'Numero da redidencia inválido',
  locality: 'Localidade inválida',
  street: 'Rua inválida',
  name: 'Nome inválido',
  tax_id: 'CPF inválido',
  email: 'Email inválido',
  unit_amount: 'Valor mínimo de compra deve ser maior ou igual que R$26,90',
  complement: 'Complemento inválido',
  card: 'Cartão inválido, verefique se cartão e tente novamente',
  security_code: 'Código de segurança inválid',
};

const reference_id = uuidv4();

export class PaymentService {
  private async credentials(input: ICredentials) {
    const user = await prisma.user.findFirst({
      where: { id: input.userId },
      include: { end: true },
    });

    if (!user) {
      throw new Err('Usuário não encontrado.');
    }

    if (!user.end) {
      throw new Err('Configure seu endereço.');
    }

    const { end } = user;

    for (const key in end) {
      if (!end[key]) {
        throw new Err('Configure seu endereço.');
      }
    }
    const customer = {
      name: user?.full_name,
      email: user.email,
      tax_id: removeStrings(user.cpf ?? ''),
    };

    const itens = [
      {
        reference_id,
        name: 'Compra de Treepycaches',
        quantity: 1,
        unit_amount: input.amount,
      },
    ];

    const phones = [
      {
        area: user.phone_area,
        number: user.phone_number,
        country: '55',
        type: 'MOBILE',
      },
    ];

    const address = {
      street: end.street,
      number: end.home_number,
      complement: end.complement,
      locality: end.locality,
      city: end.city,
      region_code: end.region_code,
      country: 'BRA',
      postal_code: removeStrings(end.postal_code),
    };

    return {
      customer,
      itens,
      address,
      phones,
    };
  }

  async instalment(value: number): Promise<any> {
    const parcelas = await pg_api.get(
      `/charges/fees/calculate?payment_methods=credit_card&value=${value}`,
    );

    const installment = parcelas.data;

    return installment;
  }

  async card(input: TCard) {
    const credentials = await this.credentials({
      userId: input.userId,
      amount: input.amount,
    });

    try {
      await pg_api.post('/orders', {
        reference_id,
        customer: {
          name: credentials.customer.name,
          email: credentials.customer.email,
          tax_id: credentials.customer.tax_id,
          phones: credentials.phones,
        },
        items: credentials.itens,
        shipping: {
          address: credentials.address,
        },
        notification_urls: ['https://treepy-server.appcom.dev/web-hook'],
        charges: [
          {
            reference_id,
            description: 'Compra de TreepyCache pelo site www.treepy.com.br',
            amount: {
              value: input.amount,
              currency: 'BRL',
            },
            payment_method: {
              type: 'CREDIT_CARD',
              installments: input.installments,
              capture: true,

              card: {
                encrypted: input.encrypted,
                security_code: 347,
                holder: {
                  name: credentials.customer.name,
                },
                store: false,
              },
            },
          },
        ],
      });
    } catch (error: any) {
      const pg_error = error;
      const parameterError = error?.parameter_name.split('.').map(String);

      const errorPayment = parameterError.find((h: any) => errorsPayment[h]);

      throw new Err(errorsPayment[errorPayment]);
    }
  }

  async pix() { }

  async boleto() { }
}
