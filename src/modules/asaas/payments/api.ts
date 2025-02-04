import { env } from '@/env';
import { Err } from '@/modules/charges/errors/Err';
import axios, { AxiosError } from 'axios';

// const baseURL = 'https://sandbox.asaas.com/api/v3';
const baseURL = 'https://api.asaas.com/v3';

const api = axios.create({
  baseURL,
  headers: {
    access_token: env.ACCESS_TOKEN,
  },
});

api.interceptors.response.use(
  success => success,
  (error: AxiosError) => {
    console.log({ api: error?.response?.data });
    const res = error?.response?.data?.errors[0];

    if (res) {
      return Promise.reject(new Err(`${res.code}, ${res.description}`));
    }

    return Promise.reject(error);
  },
);

export { api };
