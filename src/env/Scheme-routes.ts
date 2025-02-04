/* eslint-disable no-underscore-dangle */
import { z } from 'zod';

export const routesScheme = z.object({
  USER_CREATE: z.string(),
  USER_LIST_ALL: z.string(),
  USER_LIST_BY_ID: z.string(),
  USER_UPDATE: z.string(),
  USER_DELETE: z.string(),
  USER_SESSION: z.string(),
  USER_REFRESH: z.string(),
  USER_CHECK: z.string(),
  USER_RESUMO: z.string(),
  USER_RESET_PASS: z.string(),
  ADM_RELATORIO: z.string(),

  PROFILE: z.string(),
  END: z.string(),

  SEND_FORGOT_MAIL: z.string(),
  SEND_MAIL_CONTACT: z.string(),
  SEND_MAIL_ORDER: z.string(),

  PAY_CARD: z.string(),
  PAY_PIX: z.string(),
  PAY_BOLE: z.string(),
  LIST_ORDER_BY_USER: z.string(),

  HISTORY_LIST_ALL: z.string(),
  HISTORY_CREATE: z.string(),
  HISTORY_LIST_BY_USER: z.string(),
  HISTORY_DELETE: z.string(),

  JANGLE_CREATE: z.string(),
  JANGLE_LIST_ALL: z.string(),
  JANGLE_FIND_BY_CODIGO: z.string(),
  JANGLE_DELETE: z.string(),
  JANGLE_UPDATE: z.string(),
  JANGLE_FIND_BY_ID: z.string(),

  PROVIDER_CREATE: z.string(),
  PROVIDER_LIST_ALL: z.string(),
  PROVIDER_FIND_BY_CODIGO: z.string(),
  PROVIDER_DELETE: z.string(),
  PROVIDER_UPDATE: z.string(),

  PROPRERTY_CREATE: z.string(),
  PROPRERTY_LIST_ALL: z.string(),
  PROPRERTY_FIND_BY_CODIGO: z.string(),
  PROPRERTY_DELETE: z.string(),
  PROPRERTY_UPDATE: z.string(),

  PROJECT_CREATE: z.string(),
  PROJECT_LIST_ALL: z.string(),
  PROJECT_FIND_BY_CODIGO: z.string(),
  PROJECT_DELETE: z.string(),
  PROJECT_UPDATE: z.string(),

  CUSTO_CREATE: z.string(),
  CUSTO_LIST_ALL: z.string(),
  CUSTO_FIND_BY_CODIGO: z.string(),
  CUSTO_DELETE: z.string(),
  CUSTO_UPDATE: z.string(),

  CALCULADORA_CREATE: z.string(),
  CALCULADORA_LIST_ALL: z.string(),
  CALCULADORA_LIST_BY_USER: z.string(),
  CALCULADORA_DELETE: z.string(),
  CALCULADORA_UPDATE: z.string(),

  PAGSEGURO_INSTALLMENTS: z.string(),

  TREEPYCASH_CREATE: z.string(),
  TREEPYCASH_LIST_ALL: z.string(),
  TREEPYCASH_LIST_BY_USER: z.string(),
  TREEPYCASH_DELTE: z.string(),
});

export const _routes = {
  USER_CREATE: '/user',
  USER_LIST_ALL: '/user',
  USER_LIST_BY_ID: '/me',
  USER_UPDATE: '/user/:id',
  USER_DELETE: '/user/:id',
  USER_SESSION: '/user/session',
  USER_REFRESH: '/refresh-token',
  USER_CHECK: '/user/:email/:cpf',
  USER_RESUMO: '/user-resumo',

  PROFILE: '/user-profile',
  END: '/user-end/:id',

  SEND_FORGOT_MAIL: '/mail/forgot-pass',
  SEND_MAIL_CONTACT: '/mail-contact',
  SEND_MAIL_ORDER: '/mail-order',

  PAY_CARD: '/pay-card',
  PAY_PIX: '/pay-pix',
  PAY_BOLE: '/pay-boleto',
  LIST_ORDER_BY_USER: '/order-user',

  HISTORY_LIST_ALL: '/history',
  HISTORY_CREATE: '/history',
  HISTORY_LIST_BY_USER: '/history-by-user/:id',
  HISTORY_DELETE: '/history-delete/:id',

  JANGLE_CREATE: '/jangle-create',
  JANGLE_LIST_ALL: '/jangle-all ',
  JANGLE_FIND_BY_CODIGO: '/jangle-codigo/:id',
  JANGLE_FIND_BY_ID: '/jangle/:id',
  JANGLE_DELETE: '/jangle-delete/:id',
  JANGLE_UPDATE: '/jangle-up/',

  PROVIDER_CREATE: '/provider-create',
  PROVIDER_LIST_ALL: '/provider-all ',
  PROVIDER_FIND_BY_CODIGO: '/provider-codigo/:id',
  PROVIDER_DELETE: '/provider-delete/:id',
  PROVIDER_UPDATE: '/provider-up/:id',

  PROPRERTY_CREATE: '/proprerty-create',
  PROPRERTY_LIST_ALL: '/proprerty-all ',
  PROPRERTY_FIND_BY_CODIGO: '/proprerty-codigo/:id',
  PROPRERTY_DELETE: '/proprerty-delete/:id',
  PROPRERTY_UPDATE: '/proprerty-up/:id',

  PROJECT_CREATE: '/project-create',
  PROJECT_LIST_ALL: '/project-all ',
  PROJECT_FIND_BY_CODIGO: '/project-codigo/:id',
  PROJECT_DELETE: '/project-delete/:id',
  PROJECT_UPDATE: '/project-up/:id',

  CUSTO_CREATE: '/custo-create',
  CUSTO_LIST_ALL: '/custo-all ',
  CUSTO_FIND_BY_CODIGO: '/custo-codigo/:id',
  CUSTO_DELETE: '/custo-delete/:id',
  CUSTO_UPDATE: '/custo-up/:id',

  CALCULADORA_CREATE: '/calc-create',
  CALCULADORA_LIST_ALL: '/calc-all ',
  CALCULADORA_LIST_BY_USER: '/calc-by-user/:id',
  CALCULADORA_DELETE: '/calc-delete/:id',
  CALCULADORA_UPDATE: '/calc-up/:id',

  PAGSEGURO_INSTALLMENTS: '/installments/:value',

  TREEPYCASH_CREATE: '/treepycash-create/:id',
  TREEPYCASH_LIST_ALL: '/treepycash',
  TREEPYCASH_LIST_BY_USER: '/treepycash/:id',
  TREEPYCASH_DELTE: '/treepycash-delete',
};
