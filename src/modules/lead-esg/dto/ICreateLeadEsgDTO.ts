export type IndustriaESG =
  | 'TECNOLOGIA_SAAS'
  | 'AGRONEGOCIO'
  | 'INDUSTRIA'
  | 'FINANCEIRO'
  | 'VAREJO'
  | 'SAUDE'
  | 'EDUCACAO'
  | 'ENERGIA'
  | 'LOGISTICA'
  | 'OUTROS';

export type TamanhoEmpresa =
  | 'ATE_100'
  | 'DE_101_A_500'
  | 'DE_501_A_2000'
  | 'ACIMA_2000';

export interface ICreateLeadEsgDTO {
  // Dados pessoais
  nomeCompleto: string;
  emailCorporativo: string;
  cargoFuncao: string;

  // Dados da organização
  nomeEmpresa: string;
  industria: IndustriaESG;
  tamanhoEmpresa: TamanhoEmpresa;

  // Interesses ESG
  reflorestamentoNativo: boolean;
  neutralizacaoCO2: boolean;
  biodiversidadeAuditada: boolean;
  objetivosEstrategicos?: string;
}
