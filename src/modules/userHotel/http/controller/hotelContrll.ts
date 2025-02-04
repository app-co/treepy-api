import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeUserHotel } from '../../factories';

export async function hotelControl(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({
    full_name: z.string(),
    email: z.string(),
    phone_number: z.string(),
    tree: z.number(),
  });

  const data = registerScheme.parse(req.body);

  try {
    const make = makeUserHotel();

    const rs = await make.create(data);
    return res.status(201).send(rs);
  } catch (err) {
    if (err instanceof Err) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
