/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
export function calculatorTreeToMoney(arvore: number): string {
  let valor = 0;

  valor = arvore * 39.5;

  const currency = valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return currency;
}

export function calculatorCo2ToTree(co2: number): number {
  let valor = 0;

  valor = (co2 * 5) / 0.9606;

  const [u, c] = String(valor).split('.').map(Number);
  const result = c > 5 ? u + 1 : u;

  return result;
}

export function calculatorPorcent(valor: number) {
  const resul = valor.toLocaleString('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return resul;
}

export function calculatorCurrencyToTree(currency: number): number {
  let valor = 0;

  valor = Number((currency / 100 / 39.5).toFixed(0));

  return valor;
}

export function removeStrings(e: string) {
  let value = String(e);

  value = value.replace(/\D/g, '');
  const valor = value as unknown as number;

  return valor;
}

export function calculatorTreeToCurrency(e: number) {
  return (e / 100) * 39.5;
}

export function _toPtBrNumber(e: string) {
  if (!e) return 0;

  const resul = Number(e).toLocaleString('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return Number(resul.replace(',', '.'));
}
