import { IMailProvider } from "@/shared/providers/emails/providers/models/IMailProvider";
import path from "path";

export class Notification {
  constructor(
    private mail: IMailProvider
  ) { }

  async sendMail(type: 'register' | 'pagamento', data: any) {
    const bars = path.resolve(__dirname, '..', 'view', 'send-wellcome.hbs');

    switch (type) {
      case 'register':
        await this.mail.sendMail({
          to: { name: data.full_name, email: data.email },
          subject: 'Treepy - Boas vindas',
          templateData: {
            file: bars,
            variables: {
              name: data.full_name,
            },
          },
        });

        break;

      default:
        break;
    }

  }
}