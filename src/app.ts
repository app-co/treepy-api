/* eslint-disable no-underscore-dangle */
import fastify from 'fastify';
import { ZodError } from 'zod';

import cookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import { AppError } from './shared/app-error/AppError';
import { Routes } from './shared/routes';
import cron from 'node-cron'


export const app = fastify()
// .withTypeProvider<ZodTypeProvider>();
// app.setSerializerCompiler(serializerCompiler)
// app.setValidatorCompiler(validatorCompiler)

app.register(Routes);

app.register(fastifyJwt, {
  secret: 'camaleao',
  cookie: {
    cookieName: 'refresh',
    signed: false,
  },
  sign: {
    expiresIn: '10h',
  },
});

app.register(cookie);



app.setErrorHandler((error, request, reply) => {
  console.log(error);
  if (error instanceof ZodError) {
    return reply.status(409).send({
      error: `Erro de validação: ${error.errors[0].path[0]} ${error.errors[0].message}`,
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send(error);
  }

  return reply.status(500).send('Internal server error');
});
