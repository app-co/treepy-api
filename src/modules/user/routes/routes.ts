import type { FastifyInstance } from "fastify";
import { Controller } from "../controller";

const controler = new Controller();

export async function RouteUser(app: FastifyInstance) {
	app.post("/user", controler.register);
	app.post("/login", controler.login);
	app.patch("/refresh-token", controler.refreshToken);
	app.get("/", controler.acess);
}
