/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { prisma } from '@/lib/prisma';
import { Err } from '@/modules/charges/errors/Err';
import { IRepoHistory } from '@/modules/history/repositories/repo-historory';
import { IMailProvider } from '@/shared/providers/emails/providers/models/IMailProvider';
import RedisCacheProvider from '@/shared/providers/redis/redis-provider';
import {
  calculatorCo2ToTree,
  calculatorCurrencyToTree,
  calculatorPorcent,
} from '@/utils/unit-formates';
import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import path from 'path';

import { TEndUpdate, TUserUpdate } from '../dtos';
import { IUsersRepository } from '../repositories/IUser-repository';
import { UserNotFound } from './errors/user-not-found';

interface Props {
  full_name: string;
  email: string;
  password: string;
  termos: boolean;
  notifications: boolean;
}

interface IUpUser {
  id: string;
  email?: string;
  cpf?: string;
  phone_area?: string;
  password?: string;
  old_password?: string;
  phone_number?: string;
  street?: string;
  locality?: string;
  home_number?: string;
  city?: string;
  state?: string;
  region_code?: string;
  postal_code?: string;
  complement?: string;
  termos?: boolean;
  notifications?: boolean;
  avatar?: string;
}

interface IResponse {
  user: any;
}

const redis = new RedisCacheProvider();

export class RegisterUseCase {
  constructor(
    private userRepository: IUsersRepository,
    private repoHistory: IRepoHistory,
    private mailProvider: IMailProvider,
  ) { }

  async execute(data: Props): Promise<IResponse> {
    const find = await this.userRepository.findByEmail(data.email);

    if (find) {
      throw new Err('Usuário já cadastrado');
    }

    const bars = path.resolve(__dirname, '..', 'view', 'send-wellcome.hbs');

    const has = await hash(data.password, 8);

    const user = {
      full_name: data.full_name,
      email: data.email,
      password: has,
    };

    const permissions = {
      notifications: data.notifications,
      termos: data.termos,
    };

    const create = await this.userRepository.create(user, permissions);

    await this.repoHistory.create({
      fk_user_id: create.id,
      title: 'Abertura de conta',
      subtitle: 'Criação da conta Treepy',
    });

    const calc = await prisma.calculadora.findFirst({
      where: { fk_user_id: create.id },
    });

    if (!calc) {
      await prisma.calculadora.create({
        data: {
          fk_user_id: create.id,
          alimentacao: '0',
          eletricidade: '0',
          gas: '0',
          transporte_coletivo: '0',
          transporte_individual: '0',
          residuos: '0',
          total: '0',
        },
      });
    }

    await this.mailProvider.sendMail({
      to: { name: data.full_name, email: data.email },
      subject: 'Treepy - Boas vindas',
      templateData: {
        file: bars,
        variables: {
          name: data.full_name,
        },
      },
    });

    // const user = { user: 'user' };

    return {
      user,
    };
  }

  async listById(id: string): Promise<IResponse> {
    const find = await this.userRepository.findById(id);

    if (!find) {
      throw new UserNotFound();
    }

    return { user: find };
  }

  async check(email: string): Promise<void> {
    const mail = await this.userRepository.findByEmail(email);

    if (mail) {
      throw new Err('Email já cadastrado');
    }
  }

  async listAll(): Promise<User[]> {
    const list = await this.userRepository.listAll();

    return list;
  }

  async resumo(id: string): Promise<any> {
    const calculator = await prisma.calculadora.findFirst({
      where: { fk_user_id: id },
    });

    const cashe_client = await prisma.cashe_cliente.findMany({
      where: { fk_user_id: id },
    });

    let meta = 0;

    if (calculator) {
      meta = calculatorCo2ToTree(calculator.total.co2);
    }

    const janlge = await prisma.jangle.findMany();

    const jng = [];

    janlge.forEach(h => {
      const find = cashe_client.find(p => h.id === p.fk_jangle_id);

      if (find) {
        const dt = {
          name: h.name,
          lat: Number(h.lat),
          lon: Number(h.log),
          true: h.tree,
          codigo: h.codigo,
          descripton: h.description,
          cashes: find?.treepycash || 0,
          status: h.status,
        };

        jng.push(dt);
      }
    });

    let porcentMeta = '0,0';
    let treepyCashe = 0;

    if (cashe_client.length > 0) {
      treepyCashe = cashe_client.reduce((ac, i) => {
        return ac + i.treepycash;
      }, 0);

      porcentMeta = calculatorPorcent(treepyCashe / meta);
    }

    const extrato = await prisma.charges.findMany({
      where: { fk_user_id: id },
    });

    const filExt = extrato.map(h => {
      const tree = calculatorCurrencyToTree(h.value);

      const dt = {
        tree,
        data: h.updated_at,
        status: h.status,
      };

      return dt;
    });

    const response = {
      meta,
      treepyCashe,
      jangle: jng,
      porcentMeta,
      extrato: filExt,
    };

    return response;
  }

  async profile(id: string, avatar: string | undefined): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    const profile = user?.profile;

    if (profile?.avatar) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { avatar },
      });
    } else {
      await prisma.profile.create({ data: { fk_user_id: id, avatar } });
    }
  }

  async updateEnd(data: TEndUpdate): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      include: { end: true },
    });

    if (!user) {
      throw new Err('User not found');
    }

    if (!user.end) {
      await prisma.end.create({
        data: {
          city: data.city!,
          complement: data.complement!,
          home_number: data.home_number!,
          locality: data.locality!,
          postal_code: data.postal_code!,
          region_code: data.region_code!,
          state: data.state!,
          street: data.street!,
          user: {
            connect: { id: user.id },
          },
        },
      });
    }

    if (user.end) {
      await prisma.end.update({
        where: { id: user.end.id },
        data: {
          city: data.city!,
          complement: data.complement!,
          home_number: data.home_number!,
          locality: data.locality!,
          postal_code: data.postal_code!,
          region_code: data.region_code!,
          state: data.state!,
          street: data.street!,
          user: {
            connect: { id: user.id },
          },
        },
      });
    }
  }

  async updateUser(data: TUserUpdate): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      include: { end: true, profile: true },
    });

    if (!user) {
      throw new Err('Usuário não encontrado');
    }

    const findByCPF = await this.userRepository.findByCPF(data.cpf!);

    const findEmail = await this.userRepository.findByEmail(data.email!);

    if (findEmail && findEmail.id !== data.userId) {
      throw new Err('Email já cadastrado');
    }

    if (user.cpf !== data.cpf && findByCPF) {
      throw new Err('CPF já cadastrado', 409);
    }

    let pass;

    if (data.password) {
      pass = await hash(data.password, 6);
    }

    if (data.old_password) {
      const checkPass = await compare(data.old_password, user.password);

      if (!checkPass) {
        throw new Err('Sua senha antiga etá incorreta');
      }
    }

    const userUp = {
      email: data.email,
      cpf: data.cpf,
      phone_area: data.phone_area,
      phone_number: data.phone_number,
      password: pass,
    };

    await prisma.user.update({
      where: { id: user.id },
      data: userUp,
    });
  }

  async refe() {
    let user = await redis.recover<any[]>('user');
    let jangle = await redis.recover<any[]>('jangle');
    let treeCashes = await redis.recover<any[]>('tree');
    let transacions = await redis.recover<any[]>('transa');

    if (!user) {
      user = await prisma.user.findMany({
        include: { end: true, profile: true },
      });
      await redis.save('user', user);
    }

    if (!jangle) {
      jangle = await prisma.jangle.findMany({ orderBy: { ordem: 'asc' } });
      await redis.save('jangle', jangle);
    }

    if (!treeCashes) {
      treeCashes = await prisma.cashe_cliente.findMany();
      await redis.save('tree', treeCashes);
    }

    if (!transacions) {
      transacions = await prisma.charges.findMany();
      await redis.save('trans', transacions);
    }

    const us = user.map(h => {
      const cpf = h.cpf ? h.cpf.replace(/\D/g, '') : null;
      return {
        id: h.id,
        email: h.email,
        nome: h.full_name,
        senha: h.password,
        cpfCnpj: cpf,
        photUrl: h.profile?.avatar,
        customerId: h.customer,
      };
    });

    const end = user
      .filter(h => h.end)
      .map(h => {
        return {
          rua: h.end?.street,
          numero: h.end?.home_number,
          bairro: h.end?.locality,
          cidade: h.end?.city,
          estado: h.end?.region_code.toUpperCase(),
          pais: 'BRASIL',
          cep: h.end?.postal_code.replace(/\D/g, ''),
          userId: h.end?.fk_user_id,
        };
      });

    const floresta = jangle.map((h, i) => {
      const st: { [key: string]: number } = {
        Incio_plantacao: 0,
        Plantacao_realizada: 1,
        Manutencao_inicial: 2,
        Manutencao_crescimento: 3,
        Manutencao_preservacao: 4,
        Planta_finalizada: 5,
      };
      return {
        id: i,
        oldId: h.id,
        nome: h.name,
        qnt_arvores: h.quantity_tree,
        treepycash_disponivel: h.tree,
        projeto: h.ordem,
        codigo: h.codigo,
        lat: h.lat,
        long: h.log,
        status: st[h.status],
      };
    });

    const tree = treeCashes.map(h => {
      const fl = floresta.find(j => j.oldId === h.fk_jangle_id);
      return {
        qnt: h.treepycash,
        isValid: true,
        florestaId: fl?.id ?? '',
        userId: h.fk_user_id,
      };
    });

    const trans = transacions
      .filter(h => !!h.charge_id)
      .map(h => {
        const st = {
          recusado: 0,
          pendente: 2,
          pago: 1,
        };

        return {
          metodo: 'PIX',
          status: st[h.status],
          orderId: h.order_id,
          valo_compra: h.value / 100,
          userId: h.fk_user_id,
        };
      });

    const prestador = jangle.map(h => {
      const fl = floresta.find(j => j.oldId === h.id);

      return {
        nome: h.provider_name,
        cpfCnpj: h.cpf.replace(/\D/g, ''),
        crea: h.crea,
        nomeFantasia: h.work_name,
        IE_IM: h.IE_IM,
        cep: h.postal_code,
        numero: h.home_number,
        complemento: h.complement,
        cidade: h.city,
        uf: h.region,
        email: h.email,
        contato: h.cell_phone,
        rua: h.street,
        florestasId: fl!.id,
      };
    });

    const proprietario = jangle.map(h => {
      const fl = floresta.find(j => j.oldId === h.id);
      return {
        matricula: h.matricula,
        dataExpedicao: h.expedition_date,
        nomeProprietario: h.proprerty_name,
        nomeBenificiario: h.beneficiary_planting_name,
        totalArea: h.total_area,
        areaPlantada: h.planting_area,
        florestaId: fl!.id,
      };
    });

    const projeto = jangle.map(h => {
      const fl = floresta.find(j => j.oldId === h.id);
      return {
        nomeProjeto: h.project_name,
        nomeResponsavel: h.response_name,
        authorization: h.authorization,
        plant: h.plant,
        observacoes: h.observacoes,
        qntAvarore: h.quantity_tree,
        valorProjeto: h.project_value,
        valorMediaArvore: h.tree_media_value,
        florestaId: fl!.id,
      };
    });

    return { prestador, proprietario, projeto };
  }
}
