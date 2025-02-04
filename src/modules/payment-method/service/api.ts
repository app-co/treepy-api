import { env } from '@/env';
import axios from 'axios';


const urlPageseguro =
  env.NODE_ENV === 'dev'
    ? 'https://sandbox.api.pagseguro.com/'
    : 'https://api.pagseguro.com/';

const baseUrl = axios.create({
  baseURL: urlPageseguro,
});

baseUrl.interceptors.response.use(
  sucess => sucess,
  error => {
    const obj = error?.response.data.error_messages;
    // const message = keyJson(obj);

    return Promise.reject(error);
  },
);

export { baseUrl };
