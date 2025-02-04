import { IParseMailTemplateDTO } from '../../templates/dtos/IParseMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}
export interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  cc?: string[];
  subject: string;
  templateData: IParseMailTemplateDTO;
}
