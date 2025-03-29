import { roles } from "@/shared/middlewares/roles-middle";
import { Auth } from "@/shared/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";
import { Controller } from "./controller";

const controler = new Controller();

export async function routesFloresta(app: FastifyInstance) {
	app.addHook("onRequest", Auth);
	app.addHook("onRequest", roles(0));

	app.post("/florestas/register", controler.register);
	app.get("/florestas/byProjeto", controler.byProjeto);

	app.get("/florestas", controler.getAll);
	app.delete("/florestas/delete", controler.delete);
}
