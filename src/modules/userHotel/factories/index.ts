import { PrismaUserHotel } from '../repositories/PrismaUserHotel';
import { UserHotelUseCases } from '../use-cases/userHotel-cases';

export function makeUserHotel() {
  const repoHotel = new PrismaUserHotel();

  const make = new UserHotelUseCases(repoHotel);
  return make;
}
