import { ROLE } from '@prisma/client';
import { compare } from 'bcryptjs';

import { IUsersRepository } from '../repositories/IUser-repository';
import { InvalidCredentials } from './errors/invalide-auth-credentials';
import { Err } from '@/modules/charges/errors/Err';

interface IProps {
  email: string;
  password: string;
}
interface IResponse {
  user: {
    id: string;
    full_name: string;
    email: string;
    role: ROLE;
  };
}

export class AuthenticateUseCase {
  constructor(private userRepository: IUsersRepository) { }

  async execute({ email, password }: IProps): Promise<IResponse> {
    const findUser = await this.userRepository.findByEmail(email);

    if (!findUser) {
      throw new Err('Credentiais inválidas');
    }

    const compareHash = await compare(password, findUser.password);

    if (!compareHash) {
      throw new InvalidCredentials();
    }

    const user = {
      user: {
        id: findUser.id,
        full_name: findUser?.full_name,
        email: findUser.email,
        role: findUser.role,
      },
    };

    return user;
  }
}
