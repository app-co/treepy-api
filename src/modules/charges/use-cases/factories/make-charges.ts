import { ChargePrisma } from '../../repositories/charges-prisma';
import { ChargesCases } from '../cases-charges';

export function makeCharges() {
  const repochart = new ChargePrisma();
  const makechar = new ChargesCases(repochart);

  return makechar;
}
