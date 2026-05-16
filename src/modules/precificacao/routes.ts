import { FastifyInstance } from "fastify";
import controller from "./controll";
import { Auth } from "@/shared/middlewares/verify-jwt";

export async function routesPrecificacao(app: FastifyInstance) {
    app.addHook('onRequest', Auth)
    app.put('/precificacao', controller.update)
    app.get('/precificacao', controller.get)
}
