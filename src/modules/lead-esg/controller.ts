import { z } from 'zod';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { makeLeadEsg } from './make';

const IndustriaESGEnum = z.enum([
  'TECNOLOGIA_SAAS',
  'AGRONEGOCIO',
  'INDUSTRIA',
  'FINANCEIRO',
  'VAREJO',
  'SAUDE',
  'EDUCACAO',
  'ENERGIA',
  'LOGISTICA',
  'OUTROS',
]);

const TamanhoEmpresaEnum = z.enum([
  'ATE_100',
  'DE_101_A_500',
  'DE_501_A_2000',
  'ACIMA_2000',
]);

const leadEsgSchema = z.object({
  // Dados pessoais
  nomeCompleto: z
    .string({ required_error: 'Nome completo é obrigatório' })
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),

  emailCorporativo: z
    .string({ required_error: 'E-mail corporativo é obrigatório' })
    .email('Formato de e-mail inválido'),

  cargoFuncao: z
    .string({ required_error: 'Cargo/Função é obrigatório' })
    .min(2, 'Cargo deve ter pelo menos 2 caracteres'),

  // Dados da organização
  nomeEmpresa: z
    .string({ required_error: 'Nome da empresa é obrigatório' })
    .min(2, 'Nome da empresa deve ter pelo menos 2 caracteres'),

  industria: IndustriaESGEnum,

  tamanhoEmpresa: TamanhoEmpresaEnum,

  // Interesses ESG (ao menos um deve ser true)
  reflorestamentoNativo: z.boolean().default(false),
  neutralizacaoCO2: z.boolean().default(false),
  biodiversidadeAuditada: z.boolean().default(false),

  objetivosEstrategicos: z.string().optional(),
}).refine(
  (data) =>
    data.reflorestamentoNativo ||
    data.neutralizacaoCO2 ||
    data.biodiversidadeAuditada,
  {
    message: 'Selecione ao menos um tipo de projeto ESG',
    path: ['reflorestamentoNativo'],
  },
);

export class LeadEsgController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = leadEsgSchema.parse(request.body);

    const service = makeLeadEsg();
    await service.execute(body);

    return reply.status(201).send({
      message: 'Cadastro ESG realizado com sucesso! Em breve nossa equipe entrará em contato.',
    });
  }
}
