import type { FastifyInstance } from "fastify";
import { Controller } from "./controller";

const controller = new Controller();

export async function routesParceiro(app: FastifyInstance) {
	// Criar parceiro
	app.post("/parceiro", controller.create.bind(controller));

	// Listar todos os parceiros
	app.get("/parceiro", controller.listAll.bind(controller));

	// Buscar parceiro por ID
	app.get("/parceiro/:id", controller.findById.bind(controller));

	// Atualizar parceiro
	app.put("/parceiro/:id", controller.update.bind(controller));

	// Remover parceiro
	app.delete("/parceiro/:id", controller.delete.bind(controller));
}
