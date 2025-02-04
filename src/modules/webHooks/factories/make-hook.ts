import { ChargePrisma } from '@/modules/charges/repositories/charges-prisma';
import SESMailProvider from '@/shared/providers/emails/providers/implementations/SESMailProvider';
import HandleBars from '@/shared/providers/emails/templates/implementations/HandleBaars';

import { WebHooksPrismaRepository } from '../repositories/models/Orders_MessagePrismaRepository';
import { CreateWebhook } from '../services/create-web-hook';

export function makeHook() {
  const repo = new WebHooksPrismaRepository();
  const charges = new ChargePrisma();
  const repoMail = new HandleBars();
  const mail = new SESMailProvider(repoMail);
  const make = new CreateWebhook(repo, charges, mail);

  return make;
}
