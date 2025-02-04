import { z } from 'zod';

export interface IEndDto {
  street: string;
  locality: string;
  home_number: string;
  city: string;
  state: string;
  region_code: string;
  postal_code: string;
  complement: string;
}

export interface IEndDtoUpdated {
  id: string;
  street?: string;
  locality?: string;
  home_number?: string;
  city?: string;
  state?: string;
  region_code?: string;
  postal_code?: string;
  complement?: string;
}

export interface IPermission {
  termos: boolean;
  notifications: boolean;
  userId?: string;
}

export const schemeUserUpdate = z.object({
  userId: z.string(),
  email: z.string(),
  cpf: z.string(),
  phone_area: z.string(),
  phone_number: z.string(),
  password: z.string().optional(),
  old_password: z.string().optional(),
});

export const schemeUpdateEnd = z.object({
  userId: z.string(),
  street: z.string(),
  locality: z.string(),
  home_number: z.string(),
  complement: z.string(),
  city: z.string(),
  state: z.string().optional(),
  region_code: z.string(),
  postal_code: z.string(),
});

export type TUserUpdate = z.infer<typeof schemeUserUpdate>;
export type TEndUpdate = z.infer<typeof schemeUpdateEnd>;
