/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { env } from 'process';

const sdk = require('api')('@devpagbank/v2.2#erwho2celjg5ulpg');

interface props {
  id: string;
}

const urlPageseguro =
  env.NODE_ENV === 'dev'
    ? 'https://sandbox.api.pagseguro.com/'
    : 'https://api.pagseguro.com/';

const baseUrl = axios.create({
  baseURL: urlPageseguro,
});

const token =
  env.NODE_ENV === 'dev' ? env.PAG_DEV_TOKEN : env.PAG_PRODUCTION_TOKEN;

export class PagSeguroUseCases {
  async instalment(value: number): Promise<any> {
    baseUrl.defaults.headers.common.Authorization = `Bearer ${token}`;

    const parcelas = await baseUrl.get(
      `/charges/fees/calculate?payment_methods=credit_card&value=${value}`,
    );

    const rs = parcelas.data;

    return rs;
  }

  async order(order_id: string) {
    baseUrl.defaults.headers.common.Authorization = `Bearer ${token}`;

    await baseUrl.get(`/orders/${order_id}`).catch(err => { });
  }
}
