import type { FastifyInstance } from "fastify";
import { ControlerTransactions } from "./controler";

const controler = new ControlerTransactions();

export async function routeAppTransaction(app: FastifyInstance) {
	app.post("/webhook", controler.webhook);
}
