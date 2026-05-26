export function _toTreepycash(value: number, treepycashe: number) {
	return value / treepycashe;
}

export function _co2ToTree(co2: number): number {
	let valor = 0;

	valor = (co2 * 5) / 0.9606;

	return Number(valor.toFixed(4));
}

export function _toPorcent(value: number): string | undefined {
	if (!value) return;

	const per = value.toLocaleString("pt-BR", {
		style: "percent",
		minimumFractionDigits: 1,
		maximumFractionDigits: 2,
	});

	return per;
}

export function _toCurrency(value: number) {
	if (!value) return;

	const currency = value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

	return currency;
}
