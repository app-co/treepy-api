export interface ICalculadora {
  gas: number
  eletricidade: number
  transporte_individual: number
  transporte_coletivo: number
  alimentacao: number
  residuos: number
  total: number
  id: number
  userId: string
  created_at: Date
  updated_at: Date
}