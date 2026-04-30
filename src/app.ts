/* eslint-disable no-underscore-dangle */
import fastify from "fastify";
import { ZodError } from "zod";

import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { AppError } from "./shared/app-error/AppError";
import { Routes } from "./shared/routes";

import path from "node:path";
import formbody from "@fastify/formbody";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";

export const app = fastify();
app.register(formbody);

app.register(fastifyMultipart, {
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
});

app.register(fastifyStatic, {
	root: path.resolve(__dirname, "../../uploads"),
	prefix: "/uploads/",
});

app.register(cors, {
	origin: "*",
	methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
});

app.register(Routes);

app.register(fastifyJwt, {
	secret: "camaleao",
	cookie: {
		cookieName: "refresh",
		signed: false,
	},
	sign: {
		expiresIn: "10d",
	},
});

app.register(cookie);

app.setErrorHandler((error, request, reply) => {
	if (error instanceof ZodError) {
		return reply.status(409).send({
			error: `Erro de validação: ${error.errors[0].path[0]} ${error.errors[0].message}`,
		});
	}

	if (error instanceof AppError) {
		return reply.status(error.statusCode).send(error);
	}

	console.log(error);

	return reply.status(500).send({
		error: "Ocorreu um erro inesperado",
	});
});
