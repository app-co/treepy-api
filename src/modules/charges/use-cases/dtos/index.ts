export interface IPropsCard {
  fk_user_id: string;
  name: string;
  email: string;
  area: string;
  phone_number: string;
  tax_id: string;
  amount: number;
  street: string;
  home_number: string;
  complement: string;
  locality: string;
  city: string;
  region_code: string;
  postal_code: string;
  installments: number;
  security_code: string;
  encrypted: string;
}

export interface IPropsPix {
  fk_user_id: string;
  name: string;
  email: string;
  area: string;
  phone_number: string;
  tax_id: string;
  amount: string;
  street: string;
  home_number: string;
  complement: string;
  locality: string;
  city: string;
  region_code: string;
  postal_code: string;
}

export interface IPropsBoleto {
  fk_user_id: string;
  name: string;
  email: string;
  area: string;
  phone_number: string;
  tax_id: string;
  amount: number;
  street: string;
  home_number: string;
  complement: string;
  locality: string;
  city: string;
  region_code: string;
  postal_code: string;
  due_date: string;
  region: string;
}
