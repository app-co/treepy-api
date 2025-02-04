import { PrismaCalculadora } from '../../repositories/PrismaCalculadora';
import { CalculadoraUseCases } from '../calculadora-cases';

export function makeCalculadora() {
  const repo = new PrismaCalculadora();
  const make = new CalculadoraUseCases(repo);

  return make;
}
