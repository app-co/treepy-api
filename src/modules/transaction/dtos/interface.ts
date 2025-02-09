interface iResponseWeebHook {
  id: string;
  event: 'PAYMENT_RECEIVED' | 'PAYMENT_CONFIRMED';
  payment: Payment;
}

interface Payment {
  object: string;
  id: string;
  value: number
  netValue: number
}