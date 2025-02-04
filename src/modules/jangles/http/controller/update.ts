import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { JangleNotFound } from '../../errors/JangleNotFound';
import { makeJangle } from '../../use-cases/factories/make-jangle';

export async function updateJangle(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    codigo: z.string().optional(),
    lat: z.string().optional(),
    log: z.string().optional(),
    tree: z.number().optional(),
    country: z.string().optional(),
    id: z.string(),
    status: z.string().optional(),

    provider_name: z.string().optional(),
    cpf: z.string().optional(),
    crea: z.string().optional(),
    work_name: z.string().optional(),
    IE_IM: z.string().optional(),
    postal_code: z.string().optional(),
    home_number: z.string().optional(),
    complement: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    email: z.string().optional(),
    cell_phone: z.string().optional(),
    phone: z.string().optional(),

    matricula: z.string().optional(),
    expedition_date: z.string().optional(),
    proprerty_name: z.string().optional(),
    beneficiary_planting_name: z.string().optional(),
    total_area: z.string().optional(),
    planting_area: z.string().optional(),

    project_name: z.string().optional(),
    response_name: z.string().optional(),
    aprovation_ambiental_name: z.string().optional(),
    authorization: z.string().optional(),
    plant: z.string().optional(),
    observacoes: z.string().optional(),

    quantity_tree: z.number().optional(),
    project_value: z.number().optional(),
    tree_media_value: z.number().optional(),
  });

  const data = registerScheme.parse(req.body);

  try {
    const make = makeJangle();

    const rs = await make.update(data);
    return res.status(201).send(rs);
  } catch (err) {
    if (err instanceof JangleNotFound) {
      return res.status(409).send({ error: err.message });
    }

    throw err;
  }
}
