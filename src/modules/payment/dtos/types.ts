
type creditCard = {
  holderName: string
  number: string
  expiryMonth: string
  expiryYear: string
  ccv: string
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
}