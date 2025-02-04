export interface ICalculadoraUp {
  id: string;
  eletricidade?: string;
  gas?: string;
  transporte_individual?: string;
  transporte_coletivo?: string;
  alimentacao?: string;
  residuos?: string;
  total?: string;
}

export interface ICalculadora {
  eletricidade: string;
  gas: string;
  transporte_individual: string;
  transporte_coletivo: string;
  alimentacao: string;
  residuos: string;
  total: string;
  fk_user_id: string;
}
