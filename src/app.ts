import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import { fastifyJwt } from '@fastify/jwt';
import fastify from 'fastify';
import { ZodError } from 'zod';

import { env } from './env';
import { Err } from './modules/charges/errors/Err';
import { Routes } from './shared/routes';

export const app = fastify();
app.register(formbody);

app.register(cors, {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
});

app.register(fastifyJwt, {
  secret: env.APP_SECRET,
  // cookie: {
  //   cookieName: 'token-refresh',
  //   signed: false,
  // },
  sign: {
    expiresIn: '1d',
  },
});

app.register(fastifyCookie);

app.register(Routes);

app.setErrorHandler((error, _, reply) => {
  console.log(error, 'erro');

  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: `Erro de validação: ${error.errors[0].path[0]} ${error.errors[0].message}`,
    });
  }

  if (error instanceof Err) {
    return reply.status(401).send(error);
  }

  // if (error instanceof Err) {
  //   return reply.status(409).send({ error });
  // }

  if (env.NODE_ENV !== 'production') {
    console.error(error, 'erro');
  }

  return reply.status(500).send({ error: 'Interl server error' });
});
