import { roles } from "@/shared/middlewares/roles-middle";
import { Auth } from "@/shared/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";
import { Controller } from "./controller";

const controler = new Controller();

export async function routesMetrica(app: FastifyInstance) {
	app.addHook("onRequest", Auth);

	app.get("/metricas/user", controler.register);
	app.get("/metricas/admin", { onRequest: roles(0) }, controler.admin);
}
