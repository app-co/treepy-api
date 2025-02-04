/* eslint-disable prefer-destructuring */
import { env } from '@/env';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { IResponseCard, IResponsePix } from '../charges/dtos';
import { IPropsBoleto } from '../charges/use-cases/dtos';
import { baseUrl } from './service/api';

const reference_id = uuidv4();

export async function PaymentBoleto(data: IPropsBoleto) {
  const urlWebHokk =
    env.NODE_ENV === 'production'
      ? 'https://treepy-server.appcom.dev/web-hook'
      : env.URL_WEB_HOOK;

  const token =
    env.NODE_ENV === 'dev' ? env.PAG_DEV_TOKEN : env.PAG_PRODUCTION_TOKEN;

  baseUrl.defaults.headers.common.Authorization = `Bearer ${token}`;

  let status = null;
  let response = {} as IResponseCard;
  const code = null;
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
            name: 'TreepyCache',
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
        charges: [
          {
            reference_id: data.fk_user_id,
            description: 'Compra de TreepyCache pelo site www.treepy.com.br',
            amount: {
              value: data.amount,
              currency: 'BRL',
            },
            payment_method: {
              type: 'BOLETO',
              boleto: {
                due_date: data.due_date,
                instruction_lines: {
                  line_1: 'Pagamento processado para DESC Fatura',
                  line_2: 'Via Treepy',
                },
                holder: {
                  name: data.name,
                  tax_id: data.tax_id,
                  email: data.email,
                  address: {
                    country: 'Brasil',
                    region: data.region,
                    region_code: data.region_code,
                    city: data.city,
                    postal_code: data.postal_code,
                    street: data.street,
                    number: data.home_number,
                    locality: data.locality,
                  },
                },
              },
            },
          },
        ],
        notification_urls: [urlWebHokk],
      })
      .then(async h => {
        const rs = h.data as IResponseCard;
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
            name: 'TreepyCache',
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
        charges: [
          {
            reference_id: data.fk_user_id,
            description: 'Compra de TreepyCache pelo site www.treepy.com.br',
            amount: {
              value: data.amount,
              currency: 'BRL',
            },
            payment_method: {
              type: 'BOLETO',
              boleto: {
                due_date: data.due_date,
                instruction_lines: {
                  line_1: 'Pagamento processado para DESC Fatura',
                  line_2: 'Via Treepy',
                },
                holder: {
                  name: data.name,
                  tax_id: data.tax_id,
                  email: data.email,
                  address: {
                    country: 'Brasil',
                    region: data.region,
                    region_code: data.region_code,
                    city: data.city,
                    postal_code: data.postal_code,
                    street: data.street,
                    number: data.home_number,
                    locality: data.locality,
                  },
                },
              },
            },
          },
        ],
        notification_urls: [urlWebHokk],
      })
      .then(async h => {
        const rs = h.data as IResponseCard;
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
