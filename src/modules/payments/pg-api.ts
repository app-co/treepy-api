import { env } from '@/env';
import axios from 'axios';

const urlPageseguro =
  env.NODE_ENV === 'dev'
    ? 'https://sandbox.api.pagseguro.com/'
    : 'https://api.pagseguro.com/';

const pg_api = axios.create({
  baseURL: urlPageseguro,
  headers: {
    Authorization: `Bearer ${env.PAG_PRODUCTION_TOKEN}`,
  },
});

pg_api.interceptors.response.use(
  sucess => sucess,
  error => {
    const obj = error?.response?.data?.error_messages;

    if (obj) {
      return Promise.reject(obj[0]);
    }

    return Promise.reject(error);
  },
);

export { pg_api };
