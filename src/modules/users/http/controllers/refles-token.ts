import { FastifyReply, FastifyRequest } from 'fastify';

export async function refreshToken(req: FastifyRequest, res: FastifyReply) {
  await req.jwtVerify({ onlyCookie: true });

  const { role } = req.user;

  const token = await res.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub: req.user.sub,
        expiresIn: '5s',
      },
    },
  );

  const refresh = await res.jwtSign(
    { role },
    {
      sign: {
        sub: req.user.sub,
        expiresIn: '30s',
      },
    },
  );

  return res
    .setCookie('token-refresh', refresh, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(201)
    .send({
      token,
    });
}
