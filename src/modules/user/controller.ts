import type { FastifyReply, FastifyRequest } from "fastify";
import { schemas } from "./dto/shema";
import { make } from "./make";

const service = make();

export class Controller {
	async register(req: FastifyRequest, res: FastifyReply) {
		const schema = schemas.registerUser.parse(req.body);
		const rs = await service.register(schema);

		return res.status(201).send(rs);
	}

	async getUser(req: FastifyRequest, res: FastifyReply) {
		const userId = req.user.sub;
		const rs = await service.getUserById(userId);

		return res.status(201).send(rs);
	}

	async resetCash(req: FastifyRequest, res: FastifyReply) {
		const rs = await service.resetCashe();
		return res.status(201).send(rs);
	}

	async updateuser(req: FastifyRequest, res: FastifyReply) {
		const userId = req.user.sub;
		const schema = schemas.updateUser.parse({
			...(req.body as any),
			id: userId,
		});

		const rs = await service.updateUser(schema);

		return res.status(201).send(rs);
	}

	async getAll(req: FastifyRequest, res: FastifyReply) {
		const rs = await service.listAll();

		return res.status(201).send(rs);
	}

	async delete(req: FastifyRequest, res: FastifyReply) {}

	async login(req: FastifyRequest, res: FastifyReply) {
		const obj = schemas.login.parse(req.body);
		const { user, role } = await service.login(obj);

		const token = await res.jwtSign(
			{
				role,
			},
			{
				sign: {
					sub: user.id,
				},
			},
		);

		const refreshToken = await res.jwtSign(
			{
				role,
			},
			{
				sign: {
					sub: user.id,
					expiresIn: "1h",
				},
			},
		);

		return res
			.setCookie("refresh", refreshToken, {
				path: "/",
				secure: true,
				sameSite: true,
				httpOnly: true,
			})
			.status(201)
			.send({
				token,
				refreshToken,
				user: {
					...user,
					role,
				},
			});
	}

	async refreshToken(
		req: FastifyRequest,
		res: FastifyReply,
	): Promise<Response> {
		try {
			const { role, sub } = await req.jwtVerify<{
				role: number[];
				sub: string;
			}>({ onlyCookie: true });
			const token = await res.jwtSign(
				{
					role,
				},
				{
					sign: {
						sub: sub,
					},
				},
			);

			const refleshToken = await res.jwtSign(
				{
					role,
				},
				{
					sign: {
						sub: sub,
						expiresIn: "1h",
					},
				},
			);

			const dt = {
				token,
			};

			return res
				.setCookie("refresh", refleshToken, {
					path: "/",
					secure: true,
					sameSite: true,
					httpOnly: true,
				})
				.send(dt)
				.status(201);
		} catch (error) {
			console.log(error);
			return res
				.status(401)
				.send({ error: "Seu token expirou, faça o login novamente" });
		}
	}

	async updateEnd(req: FastifyRequest, res: FastifyReply) {
		const schema = schemas.endereco.parse(req.body);
		const rs = await service.updateEnd(schema);

		return res.status(201).send(rs);
	}

	async acess(req: FastifyRequest, res: FastifyReply) {
		const rs = await service.acess();
		return res.status(201).send(rs);
	}

	async sendEmailResetPass(req: FastifyRequest, res: FastifyReply) {
		const obj = req.body as { email: string };
		const rs = await service.sendEmailforgot(obj);
		return res.status(201).send(rs);
	}

	async resetPass(req: FastifyRequest, res: FastifyReply) {
		const obj = req.body as { token: string; pas: string };
		const rs = await service.resetPass(obj);
		return res.status(201).send(rs);
	}

	async addTreepycashe(req: FastifyRequest, res: FastifyReply) {
		const obj = schemas.addTreepycashe.parse(req.body);

		const rs = await service.adicionarTreepycashe(obj);
		return res.status(201).send(rs);
	}
}
