import { z } from 'zod';

import {
  schemaCard,
  schemaCardToken,
  schemaCharges,
  schemaPix,
  schemaValidatePayment,
} from './schemas';

export type TCard = z.infer<typeof schemaCard>;
export type TCardToken = z.infer<typeof schemaCardToken>;
export type TPix = z.infer<typeof schemaPix>;
export type TCharges = z.infer<typeof schemaCharges>;
export type TValidationPayment = z.infer<typeof schemaValidatePayment>;
