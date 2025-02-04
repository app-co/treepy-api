import { User } from '@prisma/client';

import { IUsersRepository } from '../repositories/IUser-repository';
import { ResorceNotFoundError } from './errors/resouce-not-found-error';

interface IProps {
  userId: string;
}
interface IResponse {
  user: User;
}

export class GetUserProfile {
  constructor(private userRepository: IUsersRepository) {}

  async execute({ userId }: IProps): Promise<IResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ResorceNotFoundError();
    }

    return {
      user,
    };
  }
}
