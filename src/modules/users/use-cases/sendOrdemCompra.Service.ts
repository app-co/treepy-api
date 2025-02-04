import { IMailProvider } from '@/shared/providers/emails/providers/models/IMailProvider';
import path from 'path';

interface IRequest {
  nome: string;
  payment_type: 'boleto' | 'pix' | 'cartao';
  email: string;
  boleto?: string;
}

export class SendOrdemCompraService {
  constructor(private mailProvider: IMailProvider) {}

  public async execute({
    nome,
    email,
    payment_type,
    boleto,
  }: IRequest): Promise<void> {
    let bars = '';

    if (payment_type === 'boleto') {
      bars = path.resolve(__dirname, '..', 'view', 'sendOrderBoleto.hbs');
    }

    if (payment_type === 'pix') {
      bars = path.resolve(__dirname, '..', 'view', 'sendOrderPix.hbs');
    }

    if (payment_type === 'cartao') {
      bars = path.resolve(__dirname, '..', 'view', 'sendOrderCartao.hbs');
    }

    await this.mailProvider.sendMail({
      to: {
        name: nome,
        email,
      },
      subject: 'Treepy - Pedido de compra - Parabéns pela iniciativa!',
      templateData: {
        file: bars,
        variables: {
          nome,
          boleto,
        },
      },
    });
  }
}
