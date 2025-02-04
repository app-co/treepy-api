/* eslint-disable prefer-destructuring */
import { env } from '@/env';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { IResponsePix } from '../charges/dtos';
import { TPixInput } from '../charges/http/controllers/pay-pix';
import { baseUrl } from './service/api';

const reference_id = uuidv4();

const urlWebHokk =
  env.NODE_ENV === 'production'
    ? 'https://treepy-server.appcom.dev/web-hook'
    : env.URL_WEB_HOOK;

export async function PaymentPix(data: TPixInput) {
  const token =
    env.NODE_ENV === 'dev' ? env.PAG_DEV_TOKEN : env.PAG_PRODUCTION_TOKEN;

  baseUrl.defaults.headers.common.Authorization = `Bearer ${token}`;

  let status = null;
  let response = {} as IResponsePix;
  const code = null;
  let errors = null;
  const expiration_date = moment().isLocal;

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
        qr_codes: [
          {
            amount: {
              value: data.amount,
            },
            expiration_date,
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
      })
      .then(async h => {
        const rs = h.data as IResponsePix;
        status = 200;
        response = rs;
      })
      .catch(h => {
        const err = h?.response?.data?.error_messages;

        if (err[0]?.code === '40002') {
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
        qr_codes: [
          {
            amount: {
              value: data.amount,
            },
            expiration_date,
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
      })
      .then(async h => {
        const rs = h.data as IResponsePix;
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
