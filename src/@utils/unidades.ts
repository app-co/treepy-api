export function _toTreepycash(value: number, treepycashe: number) {
  return value / treepycashe;
}

export function _co2ToTree(co2: number): number {
  let valor = 0;

  valor = (co2 * 5) / 0.9606;

  const [u, c] = String(valor).split('.').map(Number);
  const result = c > 5 ? u + 1 : u;

  return Number(result.toFixed(2));
}

export function _toPorcent(value: number): string | undefined {
  if (!value) return;

  const per = value.toLocaleString('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });

  return per;
}