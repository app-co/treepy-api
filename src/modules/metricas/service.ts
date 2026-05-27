import { _co2ToTree, _toCurrency, _toPorcent } from "@/@utils/unidades";
import { prisma } from "@/lib/prisma";
import { format, getMonth, subYears } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ServiceCalculadora } from "../calculadora/service";
import type { ServiceFloresta } from "../florestas/service";
import { precificacaoService } from "../precificacao/service";

interface IJangle {
	codigo: string;
	treepycash: number;
	nome: string;
	lat: number;
	long: number;
	status: number;
}

interface IFloresta {
	mes: number;
	name: string;
	value: number;
}

/*{

	const pagamentos = tpyAtivos.map((h) => {
		const mes = getMonth(new Date(h.updated_at)) + 1;
		const qntMes = tpyAtivos.filter(
			(h) => getMonth(new Date(h.updated_at)) === mes - 1,
		);
		const qnt = Number(qntMes.reduce((ac, h) => ac + h.qnt, 0).toFixed(3));
		return {
			mes,
			Mes: format(new Date(h.updated_at), "MMM", { locale: ptBR }),
			qnt,
			color: "red",
		};
	});

	const charts = React.useMemo(() => {
		const response: T[] = [];
		month.forEach((m) => {
			let dt = {
				mes: m,
				name: "",
				value: 0,
				color: "",
			};
			const find = pagamentos.find((h) => h.mes === m);

			if (find) {
				dt = {
					mes: m,
					name: find.Mes,
					value: find.qnt,
					color: find.color,
				};
			} else {
				dt = {
					mes: m,
					name: format(new Date(2023, m - 1), "MMM", { locale: ptBR }),
					value: 0,
					color: "red",
				};
			}

			response.push(dt);
		});

		return response;
	}, [pagamentos]);
}*/

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
				tree: (h.valo_compra / unidade?.unid_trepycash).toFixed(4),
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

	async dashBoardUser(userId: string, ano: number) {
		const months = Array.from({ length: 12 }, (_, i) => i + 1);
		const umAnoAtras = subYears(new Date(), 1);
		const precoTRY = await precificacaoService.get();
		// Atualiza para falso os treepycaches com mais de 1 ano
		await prisma.treepycaches.updateMany({
			where: {
				userId,
				updated_at: { lte: umAnoAtras },
				isValid: true,
			},
			data: {
				isValid: false,
			},
		});

		const tpy = await prisma.treepycaches.findMany({
			where: {
				userId: userId,
				created_at: {
					gte: new Date(ano, 1, 1),
					lte: new Date(ano, 12, 31),
				},
			},
			include: {
				floresta: true,
			},
		});

		const validos = tpy.filter((item) => item.isValid);
		const invalidos = tpy.filter((item) => !item.isValid);

		const totalArvoresPlantadas = tpy.reduce(
			(ac, curr) => ac + curr.qnt,
			0,
		);

		const totalInvestido = totalArvoresPlantadas * precoTRY?.unid_trepycash;
		const co_netralizado = (totalArvoresPlantadas * 0.9606) / 5;

		const florestas: IFloresta[] = [];

		const tpys = tpy.map((h) => {
			const mes = getMonth(h.updated_at) + 1;
			const qntMes = tpy.filter(
				(h) => getMonth(h.updated_at) === mes - 1,
			);

			return {
				mes,
				qntMes: Number(
					qntMes.reduce((acc, curr) => acc + curr.qnt, 0).toFixed(3),
				),
				mesName: format(new Date(ano, mes - 1), "MMM", {
					locale: ptBR,
				}),
			};
		});

		months.forEach((m) => {
			const find = tpys.find((t) => t.mes === m);
			if (find) {
				florestas.push({
					mes: m,
					name: find.mesName,
					value: find.qntMes,
				});
			}

			florestas.push({
				mes: m,
				name: format(new Date(ano, m - 1), "MMM", { locale: ptBR }),
				value: 0,
			});
		});

		return {
			treepycashesValidos: validos,
			treepycashesInativos: invalidos,
			totalInvestido,
			totalArvoresPlantadas,
			co_netralizado,
			florestas,
			months,
		};
	}

	async dashAdmin(ano: number) {
		const months = Array.from({ length: 12 }, (_, i) => i + 1);
		const precoTRY = await precificacaoService.get();


		const tpy = await prisma.treepycaches.findMany({
			where: {
				created_at: {
					gte: new Date(ano, 1, 1),
					lte: new Date(ano, 12, 31),
				},
			},
			select: {id: true, qnt: true, updated_at: true}
		});

		const tpys = tpy.map((h) => {
			const mes = getMonth(h.updated_at) + 1;
			const qntMes = tpy.filter(
				(h) => getMonth(h.updated_at) === mes - 1,
			);

			return {
				mes,
				qntMes: Number(
					qntMes.reduce((acc, curr) => acc + curr.qnt, 0).toFixed(3),
				),
				mesName: format(new Date(ano, mes - 1), "MMM", {
					locale: ptBR,
				}),
			};
		});

		const tpyVendidos = tpy.reduce((ac, h) => ac + h.qnt, 0)
		const receita = tpyVendidos * precoTRY?.unid_trepycash

		
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

		const TreepycashesDisponiveisTotal =
			totalTreepycashesDisponiveis.reduce(
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
