import { _validarCNPJ, _validarCPF } from '@/@utils/validate-cpf';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/shared/app-error/AppError';
import { IMailProvider } from '@/shared/providers/emails/providers/models/IMailProvider';
import RedisCacheProvider from '@/shared/providers/redis/redis-provider';
import { compare, hash } from 'bcryptjs';
import path from 'path';
import { HistoricoService } from '../historico/service';
import { api } from '../transaction/api';
import { IUser } from './dto/interface';
import { TEndereco, TLogin, TRegisterUser } from './dto/types';

const redis = new RedisCacheProvider()

export class UserService {
  constructor(
    private history: HistoricoService,
    private sendMail: IMailProvider,
  ) { }

  async register(obj: TRegisterUser) {
    const user = await prisma.user.findUnique({
      where: {
        email: obj.email,
      },
    })

    const doc = await prisma.user.findUnique({
      where: {
        cpfCnpj: obj.cpfCnpj,
      },
    })

    const cpf = _validarCNPJ(obj.cpfCnpj)

    if (obj.cpfCnpj.length > 11) {
      if (!_validarCNPJ(obj.cpfCnpj)) {
        throw new AppError('CNPJ inválido')
      }
    }

    if (obj.cpfCnpj.length <= 11) {
      if (!_validarCPF(obj.cpfCnpj)) {
        throw new AppError('CPF inválido')
      }
    }


    if (user) {
      throw new AppError('E-mail já cadastrado')
    }

    if (doc) {
      throw new AppError('Documento já cadastrado')
    }
    const pass = await hash(obj.senha, 6)
    let customerId = ''
    try {
      const { data: custumer } = await api.post('/customers', {
        name: obj.nome,
        cpfCnpj: obj.cpfCnpj,
        email: obj.email,
        mobilePhone: '14991290949'
      });

      customerId = custumer.id

    } catch (error) {
      console.log(error)
      throw new AppError('Error')
    }

    const data = {
      ...obj,
      customerId,
      senha: pass,
    }

    const register = await prisma.user.create({ data })


    this.history.create({
      titulo: 'Cadastro realizado',
      descricao: 'Registro na plataforma',
      userId: register.id,
    })

    await prisma.roles.create({
      data: {
        userId: register.id,
        tipo_acesso: [0],
      }
    })

    const bars = path.resolve(__dirname, '..', '..', 'shared', 'view', 'send-wellcome.hbs');

    await this.sendMail.sendMail({
      to: { name: obj.nome, email: obj.email },
      subject: 'Treepy - Boas vindas',
      templateData: {
        file: bars,
        variables: {
          name: data.nome,
        },
      },
    });

    return 'success'
  }

  async getUserById(userId: string) {
    let user = await redis.recover(`${userId}:userId`)

    if (!user) {
      user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          roles: {
            select: {
              tipo_acesso: true,
            },
          },
          endereco: true,
          cardToken: true,
        }
      })

      await redis.save(`${userId}:userId`, user)
    }

    if (!user) {
      throw new AppError('Usuário não encontrado')
    }

    return user as IUser
  }

  async listAll() {

    const list = await prisma.user.findMany();

    return list
  }

  async login({ senha, email }: TLogin) {
    const findUser = await prisma.user.findFirst({
      where: { email },
      include: {
        roles: {
          select: {
            tipo_acesso: true,
          },
        },
      }
    });

    if (!findUser) {
      throw new AppError('Usuário não encontrado');
    }

    const compareHash = await compare(senha, findUser.senha);

    if (!compareHash) {
      throw new AppError('Senha inválida');
    }

    await prisma.historico.create({
      data: {
        titulo: 'Login realizado',
        descricao: 'Login na plataforma',
        userId: findUser.id,
      }
    })

    const user = {
      user: {
        id: findUser.id,
      },
      role: findUser.roles!.tipo_acesso
    };

    return user


  }

  async updateEnd(obj: TEndereco) {
    const end = await prisma.endereco.findUnique({ where: { userId: obj.userId } })

    if (!end) {
      await prisma.endereco.create({
        data: {
          bairro: obj.bairro,
          cep: obj.cep,
          cidade: obj.cidade,
          estado: obj.estado,
          pais: obj.pais,
          numero: obj.numero,
          userId: obj.userId,
          rua: obj.rua,
        }
      })

      this.history.create({
        titulo: 'Alteração de endereço',
        descricao: 'Alterado endereço do usuário',
        userId: obj.userId,
      })


      await redis.invalidatePrefix(obj.userId)

      return 'success'
    }

    await prisma.endereco.update({
      where: {
        id: end.id,
      },
      data: {
        bairro: obj.bairro,
        cep: obj.cep,
        cidade: obj.cidade,
        estado: obj.estado,
        pais: obj.pais,
        numero: obj.numero,
        userId: obj.userId,
        rua: obj.rua,
      }
    });

    this.history.create({
      titulo: 'Alteração de endereço',
      descricao: 'Alterado endereço do usuário',
      userId: obj.userId,
    })

    await redis.invalidatePrefix(obj.userId)

    return 'success'
  }
}
