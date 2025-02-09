type TStatus =
  'PENDING' |
  'RECEIVED' |
  'CONFIRMED' |
  'OVERDUE' |
  'REFUNDED' |
  "RECEIVED_IN_CASH" |
  "REFUND_REQUESTED" |
  "REFUND_IN_PROGRESS" |
  "CHARGEBACK_REQUESTED" |
  "CHARGEBACK_DISPUTE" |
  "AWAITING_CHARGEBACK_REVERSAL" |
  "DUNNING_REQUESTED" |
  "DUNNING_RECEIVED" |
  "AWAITING_RISK_ANALYSIS"

export interface IResultCard {
  object: string
  id: string
  customer: string
  paymentLink: string
  originalValue: string
  interestValue: string
  description: string
  billingType: string
  dateCreated: string | Date
  confirmedDate: string
  value: number
  netValue: number
  creditCard: {
    creditCardNumber: string
    creditCardBrand: string
    creditCardToken: string
  },
  pixTransaction: string
  status: TStatus
  dueDate: string
  originalDueDate: string
  paymentDate: string
  clientPaymentDate: string
  installmentNumber: string
  invoiceUrl: string
  invoiceNumber: string
  externalReference: string
  deleted: string
  anticipated: string
  anticipable: string
  creditDate: string
  estimatedCreditDate: string
  transactionReceiptUrl: string
  nossoNumero: string
  bankSlipUrl: string
  lastInvoiceViewedDate: string
  lastBankSlipViewedDate: string
  postalService: string
  custody: string
  refunds: string
}