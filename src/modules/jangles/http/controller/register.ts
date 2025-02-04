import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { JangleAlredyExist } from '../../errors/JangleAlredyExist';
import { makeJangle } from '../../use-cases/factories/make-jangle';

export async function registerJangle(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({
    name: z.string(),
    description: z.string(),
    codigo: z.string(),
    lat: z.string(),
    log: z.string(),
    tree: z.number(),
    provider_name: z.string(),
    cpf: z.string(),
    crea: z.string(),
    work_name: z.string(),
    IE_IM: z.string(),
    postal_code: z.string(),
    home_number: z.string(),
    complement: z.string(),
    city: z.string(),
    region: z.string(),
    email: z.string(),
    cell_phone: z.string(),
    phone: z.string(),
    street: z.string(),
    matricula: z.string(),
    expedition_date: z.string(),
    proprerty_name: z.string(),
    beneficiary_planting_name: z.string(),
    total_area: z.string(),
    planting_area: z.string(),
    project_name: z.string(),
    response_name: z.string(),
    aprovation_ambiental_name: z.string(),
    authorization: z.string(),
    plant: z.string(),
    observacoes: z.string().optional(),
    quantity_tree: z.number(),
    project_value: z.string(),
    tree_media_value: z.string(),
  });

  const data = registerScheme.parse(req.body);

  try {
    const make = makeJangle();

    const rs = await make.create(data);

    return res.status(201).send(rs);
  } catch (err) {
    if (err instanceof JangleAlredyExist) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
