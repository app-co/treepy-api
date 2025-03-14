
type creditCard = {
  holderName: string
  number: string
  expiryMonth: string
  expiryYear: string
  ccv: string
}

export type TPaymentCardToken = {
  billingType: string
  customer: string
  dueDate: string
  creditCardToken: string
  remoteIp: string
  value: number
}
type holderInfo = {
  name: string
  email: string
  cpfCnpj: string
  postalCode: string
  addressNumber: string
  phone: string
  mobilePhone: string
}

export type TInfo = {
  customer: string
  billingType: "CREDIT_CARD",
  value: number,
  dueDate: string
  creditCard: creditCard
  creditCardHolderInfo: holderInfo
  remoteIp: string
  installmentCount: number
  installmentValue: number
}

export type TPixInfo = {
  value: number
  userId: string
}

export type TBoletoInfo = {
  value: number
  userId: string
  customerId: string
}