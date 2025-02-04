import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { InvalidCredentials } from '../../use-cases/errors/invalide-auth-credentials';
import { makeAuth } from '../../use-cases/factories/make-auth-use';

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = registerScheme.parse(req.body);

  try {
    const create = makeAuth();

    const { user } = await create.execute({ email, password });
    const token = await res.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    );

    const refreshToken = await res.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: '1d',
        },
      },
    );

    const rs = {
      ...user,
      password: undefined,
    };
    return res
      .setCookie('token-refresh', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(201)
      .send({
        token,
        refreshToken,
        user: rs,
      });
  } catch (err) {
    if (err instanceof InvalidCredentials) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
