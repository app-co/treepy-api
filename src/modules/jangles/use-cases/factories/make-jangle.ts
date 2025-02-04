import { PrismaJangles } from '../../repositories/PrismaJangles';
import { JanglesUseCases } from '../jangles-cases';

export function makeJangle() {
  const repoJangle = new PrismaJangles();
  const make = new JanglesUseCases(repoJangle);

  return make;
}
