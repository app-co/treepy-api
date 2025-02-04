import { Country, StatusJangle } from '@prisma/client';

export interface ICashes {
  id: string;
  fk_jangle_id: string;
  jangle: string;
  treepeycash: number;

  created_at: Date | string;
  updated_at: Date | string;
  cashe_client_id: string;
  cashe_cliente: string;
}

export interface ICasheClient {
  id: string;
  treepycash: number;
  meta: number;
  fk_user_id: string;

  cashesId: string;
  cashe_jangle: string;
  user: string;

  created_at: Date | string;
  updated_at: Date | string;
}

export interface ICasheJangle {
  id: string;
  treepycashe: number;
  fk_jangle_id: string;
  jangle: string;
  cashe_client: ICasheClient[];

  created_at: Date | string;
  updated_at: Date | string;
}

export interface IJangle {
  id: string;
  name: string;
  codigo: string;
  description: string;
  lat: string;
  log: string;
  tree: number;
  country: Country;
  status: StatusJangle;

  // prestador
  provider_name: string;
  cpf: string;
  crea: string;
  work_name: string;
  IE_IM: string;
  postal_code: string;
  home_number: string;
  complement: string;
  city: string;
  region: string;
  email: string;
  cell_phone: string;
  phone: string;

  // proprietário
  matricula: string;
  expedition_date: string;
  proprerty_name: string;
  beneficiary_planting_name: string;
  total_area: string;
  planting_area: string;

  // projeto
  project_name: string;
  response_name: string;
  aprovation_ambiental_name: string;
  authorization: string;
  plant: string;

  // custo
  quantity_tree: number;
  project_value: number;
  tree_media_value: number;

  observacoes?: string;

  created_at: Date | Date | string;
  updated_at: Date | Date | string;
}

export interface ICharge {
  charge_id: string;
  order_id: string;
  customer: {
    name: string;
    email: string;
    tax_id: string;
    phones: {
      type: string;
      country: string;
      area: string;
      number: string;
    }[];
  };
  fk_user_id: string;
  type: string;
  status: string;
  value: number;
}

type T = {
  item: string;
  co2: number;
  porcent: number;
};

export interface ICalculadora {
  id: string;
  eletricidade: T;
  gas: T;
  transporte_individual: T;
  transporte_coletivo: T;
  alimentacao: T;
  residuos: T;
  total: T;
  fk_user_id: string;
}
