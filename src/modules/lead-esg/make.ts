import SESMailProvider from '@/shared/providers/emails/providers/implementations/SESMailProvider';
import HandleBars from '@/shared/providers/emails/templates/implementations/HandleBaars';
import { LeadEsgService } from './service';

export function makeLeadEsg(): LeadEsgService {
  const templateProvider = new HandleBars();
  const mailProvider = new SESMailProvider(templateProvider);
  return new LeadEsgService(mailProvider);
}
