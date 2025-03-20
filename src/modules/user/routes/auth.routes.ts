import { Auth } from "@/shared/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";
import { Controller } from "../controller";

const controler = new Controller();

export async function authUser(app: FastifyInstance) {
	app.addHook("onRequest", Auth);
	app.get("/user", controler.getUser);
	app.post("/user/endereco", controler.updateEnd);
	app.put("/user", controler.updateuser);
}
