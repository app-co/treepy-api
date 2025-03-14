import { z } from "zod";

const registerUser = z.object({
  nome: z.string({ message: 'nome obrigatório' }),
  email: z.string({ message: 'email obrigatório' }).email(),
  senha: z.string({ message: 'senha obrigatório' }).min(6, 'mínimo de 6 digitos').transform(h => h.trim()),
  cpfCnpj: z.string().optional().transform(h => h ? h.replace(/\D/g, ''.trim()) : null),
  photoUrl: z.string().optional()
})

const updateUser = z.object({
  id: z.string(),
  nome: z.string({ message: 'nome obrigatório' }),
  email: z.string({ message: 'email obrigatório' }).email(),
  senha: z.string({ message: 'senha obrigatório' }).optional().transform(h => h ? h.trim() : null),
  photoUrl: z.string().optional(),
  cpfCnpj: z.string({ message: 'cpf ou cnpj obrigatório' }).min(11, 'cpf ou cnpj inválido').transform(h => h.replace(/\D/g, ''.trim())),
})

const login = z.object({
  email: z.string({ message: 'email obrigatório' }).email('Email inválido'),
  senha: z.string({ message: 'senha obrigatório' }).min(6, 'Senha deve conter mínimo 6 dígitos'),
})

const endereco = z.object({
  bairro: z.string(),
  cep: z.string(),
  cidade: z.string(),
  estado: z.string(),
  pais: z.string(),
  numero: z.string(),
  userId: z.string(),
  rua: z.string(),
})

export const schemas = {
  registerUser,
  login,
  endereco,
  updateUser,
}