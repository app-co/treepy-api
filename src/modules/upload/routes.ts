import { Auth } from "@/shared/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";
import { UploadController } from "./controller";

const controller = new UploadController();

export async function routesUpload(app: FastifyInstance) {
	app.addHook("onRequest", Auth);

	app.post("/upload", controller.upload);
}
