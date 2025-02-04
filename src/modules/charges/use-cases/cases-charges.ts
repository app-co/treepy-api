import { prisma } from '@/lib/prisma';
import { PrismaJangles } from '@/modules/jangles/repositories/PrismaJangles';
import { PaymentBoleto } from '@/modules/payment-method/boleto';
import { PaymentCard } from '@/modules/payment-method/card';
import { InvalidCredentials } from '@/modules/payment-method/errors/InvalidCredentials';
import { NotAtuthorized } from '@/modules/payment-method/errors/NotAtuthorized';
import { PaymentPix } from '@/modules/payment-method/pix';
import { _validarCPF } from '@/utils/validate-cpf';
import { Charges } from '@prisma/client';

import { ChargeNotFound } from '../errors/ChargeNotFound';
import { Err } from '../errors/Err';
import { TPixInput } from '../http/controllers/pay-pix';
import { IRepoCharge } from '../repositories/IRepoCharges';
import { IPropsBoleto, IPropsCard } from './dtos';
import { Validation } from './validation';

const repo = new PrismaJangles();
const validation = new Validation(repo);

const errorsPayment: any = {
  region: 'Estado inválido',
  city: 'Cidade inválida',
  postal_code: 'Cep inválido',
  number: 'Numero da redidencia inválido',
  locality: 'Localidade inválida',
  street: 'Rua inválida',
  name: 'Nome inválido',
  tax_id: 'CPF inválido',
  email: 'Email inválido',
  unit_amount: 'Valor mínimo de compra deve ser maior ou igual que R$26,90',
  complement: 'Complemento inválido',
  card: 'Cartão inválido',
  security_code: 'Código de segurança inválid',
};

export class ChargesCases {
  constructor(private repoCharges: IRepoCharge) { }

  async createCard(data: IPropsCard): Promise<Charges> {
    const cpf = _validarCPF(data.tax_id);

    if (!cpf) {
      throw new Err('CPF inválido');
    }
    const vali = await validation.execute(data.fk_user_id, data.amount);

    if (vali.error) {
      throw new Err(vali.error, 409);
    }

    const { response, status, errors } = await PaymentCard(data);

    if (errors) {
      const parameterError = errors?.parameter_name.split('.').map(String);

      const errorPayment = parameterError.find((h: any) => errorsPayment[h]);

      throw new Err(errorsPayment[errorPayment]);
    }

    if (status === 'DECLINED') {
      throw new NotAtuthorized();
    }

    if (status === '40002') {
      throw new InvalidCredentials();
    }

    const dt = {
      charge_id: response.charges[0].id,
      order_id: response.id,
      customer: response.customer,
      fk_user_id: data.fk_user_id,
      type: 'CARD',
      value: response.charges[0].amount.value,
      status: 'PAID',
    };

    await this.repoCharges.create(dt);

    if (vali.response.create) {
      const resp = vali.response.create;
      await prisma.cashe_cliente.create({
        data: {
          treepycash: resp.tree,
          cachesId: resp.cashesId,
          meta: resp.meta,
          fk_user_id: data.fk_user_id,
          fk_jangle_id: resp.fk_jangle_id,
        },
      });

      await prisma.caches.update({
        where: { fk_jangle_id: resp.fk_jangle_id },
        data: {
          treepeycash: resp.cashe,
        },
      });
    }

    if (vali.response.up) {
      const resp = vali.response.up;
      await prisma.cashe_cliente.update({
        where: { id: resp.casheClientId },
        data: {
          treepycash: resp.tree,
          cachesId: resp.cashesId,
        },
      });

      await prisma.caches.update({
        where: { fk_jangle_id: resp.fk_jangle_id },
        data: {
          treepeycash: resp.cashe,
        },
      });
    }
    return dt;
  }

  async createPix(data: TPixInput) {
    const cpf = _validarCPF(data.tax_id);

    if (!cpf) {
      throw new Err('CPF inválido');
    }

    const vali = await validation.execute(data.fk_user_id, Number(data.amount));

    if (vali.error) {
      throw new Err(vali.error);
    }

    const { response, status, errors } = await PaymentPix(data);

    if (errors) {
      const parameterError = errors?.parameter_name.split('.').map(String);

      const errorPayment = parameterError.find((h: any) => errorsPayment[h]);

      throw new Err(errorsPayment[errorPayment]);
    }

    if (status === 'DECLINED') {
      throw new Err('Compra não autorizada');
    }

    const dt = {
      charge_id: 'PIX',
      order_id: response.id,
      customer: response.customer,
      fk_user_id: data.fk_user_id,
      img: response.qr_codes[0].links[0].href,
      type: 'PIX',
      value: response.items[0].unit_amount,
      status: 'PENDENTE',
    };

    const res = {
      img: response.qr_codes[0].links[0].href,
      text: response.qr_codes[0].text,
    };

    await this.repoCharges.create(dt);
    return res;
  }

  async createBoleto(data: IPropsBoleto): Promise<any> {
    const { response, status, errors } = await PaymentBoleto(data);

    if (errors) {
      const parameterError = errors?.parameter_name.split('.').map(String);

      const errorPayment = parameterError.find((h: any) => errorsPayment[h]);

      throw new Err(errorsPayment[errorPayment]);
    }

    if (status === 'DECLINED') {
      throw new NotAtuthorized();
    }

    const dt = {
      charge_id: response.charges[0].id,
      order_id: response.id,
      customer: response.customer,
      fk_user_id: data.fk_user_id,
      type: 'BOLETO',
      value: response.charges[0].amount.value,
      status: 'PENDENTE',
    };

    await this.repoCharges.create(dt);
    const rs = {
      pdf: response.charges[0].links[0].href,
      img: response.charges[0].links[1].href,
    };

    return rs;
  }

  async listByChargeId(chard_id: string): Promise<Charges> {
    const find = await this.repoCharges.findByChargeId(chard_id);

    if (!find) {
      throw new ChargeNotFound();
    }

    return find;
  }

  async listAll(): Promise<Charges> {
    const lis = await this.listAll();
    return lis;
  }

  async listByOrderId(order_id: string): Promise<Charges> {
    const list = await this.listByOrderId(order_id);
    return list;
  }

  async listByUserId(fk_user_id: string): Promise<Charges[]> {
    const fin = await this.repoCharges.findByUser(fk_user_id);
    return fin;
  }

  async deleteCharges(id: string): Promise<Charges> {
    const del = await this.repoCharges.delete(id);

    return del;
  }
}
