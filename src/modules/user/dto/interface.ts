export interface IUser {
  id: string
  nome: string
  cpfCnpj: string
  email: string
  senha: string
  customerId: string
  created_at: string
  updated_at: string
  roles: {
    tipo_acesso: number[]
  },
  endereco: {
    id: number,
    rua: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    pais: string
    cep: string
    userId: string
    created_at: string | Date
    updated_at: string | Date
  },
  cardToken: {
    id: number
    token: string
    creditCardNumber: string
    creditCardBrand: string
    userId: string
  }[]
}

export interface ICustumer {
  object: string
  id: string
  dateCreated: string
  name: string
  email: string
  phone: string
  mobilePhone: string
  address: string
  addressNumber: string
  complement: string
  province: string
  city: string
  cityName: string
  state: string
  country: string
  postalCode: string
  cpfCnpj: string
}