/* eslint-disable @typescript-eslint/no-unused-vars */
import mail from '@/config/mail';
import aws from 'aws-sdk';

import nodemailer, { Transporter } from 'nodemailer';

import { IMailTemplateProvider } from '../../templates/models/IMailTemplateProvider';
import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../models/IMailProvider';


export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(private mailTemplateProvider: IMailTemplateProvider) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-2',
      }),
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
