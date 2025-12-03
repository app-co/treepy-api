import { subYears } from "date-fns";
import { _co2ToTree, _toCurrency, _toPorcent } from "@/@utils/unidades";
import { prisma } from "@/lib/prisma";
import type { ServiceCalculadora } from "../calculadora/service";
import type { ServiceFloresta } from "../florestas/service";

interface IJangle {
	codigo: string;
	treepycash: number;
	nome: string;
	lat: number;
	long: number;
	status: number;
}

export class ServiceMetricas {
	constructor(
		private calc: ServiceCalculadora,
		private jangle: ServiceFloresta,
	) {}

	async user(userId: string) {
		const umAnoAtras = subYears(new Date(), 1);
		const unidade = await prisma.precificacao.findFirst();

		const treepycashes = await prisma.treepycaches.findMany({
			where: {
				userId: userId,
				updated_at: {
					gte: umAnoAtras,
				},
			},
			include: {
				floresta: true,
			},
			orderBy: { updated_at: "asc" },
		});

		const treepycashesInativos = await prisma.treepycaches.findMany({
			where: {
				userId: userId,
				updated_at: {
					lte: umAnoAtras,
				},
			},
			include: {
				floresta: true,
			},
			orderBy: { updated_at: "asc" },
		});

		const transactions = await prisma.transacoesUser.findMany({
			where: {
				userId,
			},
			orderBy: { id: "desc" },
		});

		const florestas = await this.jangle.listAll();

		const calculadora = await this.calc.getCalcById(userId);

		const totalTreepycash = treepycashes
			.filter((h) => h.isValid)
			.reduce((acc, curr) => acc + curr.qnt, 0);
		const meta = _co2ToTree(calculadora?.total ?? 0);
		const porcentagemAtingida = calculadora
			? Number((totalTreepycash / meta).toFixed(2))
			: 0;
		const trans = transactions.map((h) => {
			return {
				...h,
				tree: (h.valo_compra / unidade?.unid_trepycash).toFixed(2),
			};
		});
		const jangle: IJangle[] = [];

		florestas.forEach((h) => {
			const calculo = treepycashes
				.filter((t) => t.florestaId === h.id && t.isValid)
				.reduce((ac, item) => ac + item.qnt, 0);

			const calc = Number(calculo.toFixed(3));
			if (calculo) {
				jangle.push({
					codigo: h.codigo,
					treepycash: calc,
					nome: h.nome,
					lat: Number(h.lat),
					long: Number(h.long),
					status: h.status,
				});
			}
		});

		return {
			compensacao: {
				co2Anual: calculadora?.total ?? 0,
				treepy: totalTreepycash,
				meta,
				isValid: calculadora ? true : false,
				porcentagemAtingida: _toPorcent(porcentagemAtingida),
				metaAtingida: porcentagemAtingida,
			},
			floresta: jangle,
			treepycashesAtivos: treepycashes,
			treepycashesInativos: treepycashesInativos,
			transactions: trans,
		};
	}

	async admin() {
		const totalUsuarios = await prisma.user.count();
		const totalFlorestas = await prisma.florestas.count();
		const totalParceiros = await prisma.prestador.count();

		const totalTreepycashesV = await prisma.treepycaches.findMany();

		const totalTreepycashesVendidos = totalTreepycashesV.reduce(
			(ac, h) => ac + h.qnt,
			0,
		);

		const totalTreepycashesDisponiveis = await prisma.florestas.findMany({
			where: { projetoAtivo: true },
			select: { treepycash_disponivel: true },
		});

		const TreepycashesDisponiveisTotal = totalTreepycashesDisponiveis.reduce(
			(acc, curr) => acc + curr.treepycash_disponivel,
			0,
		);

		const valor = await prisma.transacoes.findMany();

		const totalCompraPj = 0;
		const totalCompraCpf = 0;

		const valorInicial = 369 * 39.9;

		const totalVenda = totalTreepycashesVendidos * 39.9 + valorInicial;

		const valorBrutoTotal = valor.reduce((acc, curr) => {
			return acc + curr.valorBruto;
		}, valorInicial);

		const valorLiquidoTotal = valor.reduce(
			(ac, h) => ac + h.valorLiquido,
			valorInicial,
		);

		return {
			usuarios: totalUsuarios,
			florestas: totalFlorestas,
			parceiros: totalParceiros,
			treepycashesVendidos: totalTreepycashesVendidos,
			treepycashesDisponiveis: TreepycashesDisponiveisTotal,
			valorBrutoTotal: {
				value: valorBrutoTotal,
				currency: _toCurrency(valorBrutoTotal),
			},
			totalVenda: _toCurrency(totalVenda),
			valorLiquidoTotal: _toCurrency(valorLiquidoTotal),
		};
	}

	async() {}
}
