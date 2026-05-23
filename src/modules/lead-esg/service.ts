import path from 'path';
import { PrismaClient } from '@prisma/client';
import { IMailProvider } from '@/shared/providers/emails/providers/models/IMailProvider';
import { AppError } from '@/shared/app-error/AppError';
import type { ICreateLeadEsgDTO } from './dto/ICreateLeadEsgDTO';

const prisma = new PrismaClient();

const INDUSTRIA_LABEL: Record<string, string> = {
  TECNOLOGIA_SAAS: 'Tecnologia & SaaS',
  AGRONEGOCIO: 'Agronegócio',
  INDUSTRIA: 'Indústria',
  FINANCEIRO: 'Financeiro',
  VAREJO: 'Varejo',
  SAUDE: 'Saúde',
  EDUCACAO: 'Educação',
  ENERGIA: 'Energia',
  LOGISTICA: 'Logística',
  OUTROS: 'Outros',
};

const TAMANHO_LABEL: Record<string, string> = {
  ATE_100: '1 – 100 funcionários',
  DE_101_A_500: '101 – 500 funcionários',
  DE_501_A_2000: '501 – 2.000 funcionários',
  ACIMA_2000: 'Acima de 2.000 funcionários',
};

export class LeadEsgService {
  constructor(private mailProvider: IMailProvider) {}

  async execute(data: ICreateLeadEsgDTO): Promise<void> {
    // 1. Persiste o lead no banco
    const leadExistente = await prisma.leadEsg.findUnique({
      where: { emailCorporativo: data.emailCorporativo },
    });

    if (leadExistente) {
      throw new AppError('Este e-mail corporativo já foi cadastrado.', 409);
    }

    await prisma.leadEsg.create({ data });

    // Templates de email
    const templateConfirmacao = path.resolve(
      __dirname,
      '..',
      '..',
      'shared',
      'view',
      'lead-esg-confirmacao.hbs',
    );

    const templateInterno = path.resolve(
      __dirname,
      '..',
      '..',
      'shared',
      'view',
      'lead-esg-interno.hbs',
    );

    // Monta lista de interesses para os templates
    const interesses: string[] = [];
    if (data.reflorestamentoNativo) interesses.push('Reflorestamento Nativo');
    if (data.neutralizacaoCO2) interesses.push('Neutralização de CO₂');
    if (data.biodiversidadeAuditada) interesses.push('Biodiversidade Auditada');

    const interessesTexto = interesses.length > 0
      ? interesses.join(', ')
      : 'Nenhum interesse selecionado';

    const industriaLabel = INDUSTRIA_LABEL[data.industria] ?? data.industria;
    const tamanhoLabel = TAMANHO_LABEL[data.tamanhoEmpresa] ?? data.tamanhoEmpresa;

    // 2. Envia email de confirmação para o lead
    await this.mailProvider.sendMail({
      to: {
        name: data.nomeCompleto,
        email: data.emailCorporativo,
      },
      subject: 'Treepy ESG – Recebemos o seu cadastro!',
      templateData: {
        file: templateConfirmacao,
        variables: {
          nomeCompleto: data.nomeCompleto,
          cargoFuncao: data.cargoFuncao,
          nomeEmpresa: data.nomeEmpresa,
          industria: industriaLabel,
          tamanhoEmpresa: tamanhoLabel,
          interesses: interessesTexto,
          objetivosEstrategicos: data.objetivosEstrategicos ?? 'Não informado',
        },
      },
    });

    // 3. Envia email interno para a equipe Treepy
    await this.mailProvider.sendMail({
      to: {
        name: 'Equipe Treepy',
        email: 'contato@treepy.com.br',
      },
      subject: `[NOVO LEAD ESG] ${data.nomeCompleto} – ${data.nomeEmpresa}`,
      templateData: {
        file: templateInterno,
        variables: {
          nomeCompleto: data.nomeCompleto,
          emailCorporativo: data.emailCorporativo,
          cargoFuncao: data.cargoFuncao,
          nomeEmpresa: data.nomeEmpresa,
          industria: industriaLabel,
          tamanhoEmpresa: tamanhoLabel,
          interesses: interessesTexto,
          objetivosEstrategicos: data.objetivosEstrategicos ?? 'Não informado',
        },
      },
    });
  }
}
