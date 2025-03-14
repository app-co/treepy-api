import type { FastifyInstance } from "fastify";
import { Controller } from "./controller";

const controler = new Controller();

export async function routesPayment(app: FastifyInstance) {
	app.get("/payment/register", controler.register);
	app.get("/listar", controler.listar);
	app.delete("/deletar/:id", controler.deletar);
	app.put("/atualizar/:id", controler.atualizar);
}
