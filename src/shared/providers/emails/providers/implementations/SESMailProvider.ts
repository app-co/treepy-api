/* eslint-disable @typescript-eslint/no-unused-vars */
import mail from '@/config/mail';
import { SendRawEmailCommand, SESClient } from "@aws-sdk/client-ses";

import nodemailer, { Transporter } from 'nodemailer';

import { env } from '@/env';
import { IMailTemplateProvider } from '../../templates/models/IMailTemplateProvider';
import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../models/IMailProvider';


export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(private mailTemplateProvider: IMailTemplateProvider) {

    const ses = new SESClient({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    this.client = nodemailer.createTransport({
      SES: {
        ses,
        aws: { SendRawEmailCommand }
      }
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
    cc,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mail.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      cc,
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}
