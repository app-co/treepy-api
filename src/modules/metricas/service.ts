import { _co2ToTree, _toPorcent } from "@/@utils/unidades";
import { prisma } from "@/lib/prisma";
import { subYears } from "date-fns";
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
		const enusStatusJangle: { [key: number]: string } = {
			1: "Início da plantação",
			2: "Plantação realizada",
			3: "Manutenção inicial",
			4: "Manutenção de crescimento",
			5: "Manutenção de preservação",
			6: "Plantação finalizada",
		};

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
					status: enusStatusJangle[h.status],
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
}
