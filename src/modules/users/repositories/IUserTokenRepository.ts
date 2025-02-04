import { User_tokens } from '@prisma/client';

export default interface IUserTokenRepository {
  generate(user_id: string): Promise<User_tokens>;
  findByToken(token: string): Promise<User_tokens | null>;
}
