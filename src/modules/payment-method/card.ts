/* eslint-disable prefer-destructuring */
import { env } from '@/env';
import { v4 as uuidv4 } from 'uuid';

import { IResponseCard } from '../charges/dtos';
import { baseUrl } from './service/api';

interface I {
  fk_user_id: string;
  name: string;
  email: string;
  area: string;
  phone_number: string;
  tax_id: string;
  amount: number;
  street: string;
  home_number: string;
  complement: string;
  locality: string;
  city: string;
  region_code: string;
  postal_code: string;
  installments: number;
  security_code: string;
  encrypted: string;
}

const errorsEdress = {
  region: 'Estado inválido',
  city: 'Cidade inválida',
  postal_code: 'Cep inválido',
  number: 'Numero da redidencia inválido',
  locality: 'Localidade inválida',
  street: 'Rua inválida',
  name: 'Nome inválido',
  tax_id: 'CPF inválido',
  email: 'Email inválido',
  unit_amount: 'Valor total de compra deve ser maior que R$5,00',
};

const reference_id = uuidv4();

export async function PaymentCard(data: I) {
  const urlWebHokk =
    env.NODE_ENV === 'production'
      ? 'https://treepy-server.appcom.dev/web-hook'
      : env.URL_WEB_HOOK;

  const token =
    env.NODE_ENV === 'dev' ? env.PAG_DEV_TOKEN : env.PAG_PRODUCTION_TOKEN;

  baseUrl.defaults.headers.common.Authorization = `Bearer ${token}`;

  let status = null;
  let response = {} as IResponseCard;
  let code = null;

  let errors = null;

  if (env.NODE_ENV === 'production') {
    await baseUrl
      .post('/orders', {
        reference_id: data.fk_user_id,
        customer: {
          name: data.name,
          email: data.email,
          tax_id: data.tax_id,
          phones: [
            {
              country: '55',
              area: data.area,
              number: data.phone_number,
              type: 'MOBILE',
            },
          ],
        },
        items: [
          {
            reference_id,
            name: 'Treepycache',
            quantity: 1,
            unit_amount: data.amount,
          },
        ],
        shipping: {
          address: {
            street: data.street,
            number: data.home_number,
            complement: data.complement,
            locality: data.locality,
            city: data.city,
            region_code: data.region_code,
            country: 'BRA',
            postal_code: data.postal_code,
          },
        },
        notification_urls: [urlWebHokk],
        charges: [
          {
            reference_id: '123',
            description: 'Compra de TreepyCache pelo site www.treepy.com.br',
            amount: {
              value: data.amount,
              currency: 'BRL',
            },
            payment_method: {
              type: 'CREDIT_CARD',
              installments: data.installments,
              capture: true,

              card: {
                encrypted: data.encrypted,
                security_code: data.security_code,
                holder: {
                  name: data.name,
                },
                store: false,
              },
            },
          },
        ],
      })
      .then(async h => {
        const rs = h.data as IResponseCard;
        status = rs.charges[0].status;
        code = rs.charges[0].payment_response.code;
        response = rs;
      })
      .catch(h => {
        const err = h?.response?.data?.error_messages;

        if (err[0].code === '40002') {
          status = err[0].code;
          errors = err[0];
        }
      });
  }

  if (env.NODE_ENV === 'dev') {
    await baseUrl
      .post('/orders', {
        reference_id: data.fk_user_id,
        customer: {
          name: data.name,
          email: data.email,
          tax_id: data.tax_id,
          phones: [
            {
              country: '55',
              area: data.area,
              number: data.phone_number,
              type: 'MOBILE',
            },
          ],
        },
        items: [
          {
            reference_id: data.fk_user_id,
            name: 'Treepycache',
            quantity: 1,
            unit_amount: data.amount,
          },
        ],
        shipping: {
          address: {
            street: data.street,
            number: data.home_number,
            complement: data.complement,
            locality: data.locality,
            city: data.city,
            region_code: data.region_code,
            country: 'BRA',
            postal_code: data.postal_code,
          },
        },
        notification_urls: [urlWebHokk],
        charges: [
          {
            reference_id: '123',
            description: 'Compra de TreepyCache pelo site www.treepy.com.br',
            amount: {
              value: data.amount,
              currency: 'BRL',
            },
            payment_method: {
              type: 'CREDIT_CARD',
              installments: 1,
              capture: false,
              soft_descriptor: 'My Store',
              card: {
                number: '524008297562245',
                exp_month: '03',
                exp_year: '2026',
                security_code: '123',
                holder: {
                  name: 'Jose da Silva',
                },
              },
            },
          },
        ],
      })
      .then(async h => {
        const rs = h.data as IResponseCard;
        status = rs.charges[0].status;
        code = rs.charges[0].payment_response.code;
        response = rs;
      })
      .catch(h => {
        const err = h?.response?.data?.error_messages;
        if (err[0].code === '40002') {
          status = err[0].code;
          errors = err[0];
        }
      });
  }

  return { status, response, code, errors };
}
