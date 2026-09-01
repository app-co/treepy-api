import { routesCalculadora } from "@/modules/calculadora/routes";
import { routesFloresta } from "@/modules/florestas/routes";
import { routesHistorico } from "@/modules/historico/routes";
import { routesLeadEsg } from "@/modules/lead-esg/routes";
import { routesMetrica } from "@/modules/metricas/routes";
import { routesParceiro } from "@/modules/parceiro/routes";
import { routesPayment } from "@/modules/payment/routes";
import { routesPrecificacao } from "@/modules/precificacao/routes";
import { routeAppTransaction } from "@/modules/transaction/app.routes";
import { routeTransaction } from "@/modules/transaction/routes";
import { routesUpload } from "@/modules/upload/routes";
import { authUser } from "@/modules/user/routes/auth.routes";
import { RouteUser } from "@/modules/user/routes/routes";
import type { FastifyInstance } from "fastify";

export async function Routes(app: FastifyInstance) {
	app.register(RouteUser);
	app.register(authUser);
	app.register(routeTransaction);
	app.register(routeAppTransaction);
	app.register(routesFloresta);
	app.register(routesCalculadora);
	app.register(routesMetrica);
	app.register(routesPayment);
	app.register(routesHistorico);
	app.register(routesUpload);
	app.register(routesPrecificacao);
	app.register(routesLeadEsg);
	app.register(routesParceiro)
}
