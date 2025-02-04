import { Calculadora } from '@prisma/client';

import { ICalculadora, ICalculadoraUp } from '../dtos';

export interface IRepoCalculadora {
  create(data: ICalculadora): Promise<Calculadora>;
  findById(id: string): Promise<Calculadora | null>;
  findByUser(fk_user_id: string): Promise<Calculadora[]>;
  listall(): Promise<Calculadora[]>;
  delete(id: string): Promise<Calculadora>;
  update(id: ICalculadoraUp): Promise<Calculadora>;
}
