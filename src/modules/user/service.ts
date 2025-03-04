import path from "path";
import { _validarCNPJ, _validarCPF } from "@/@utils/validate-cpf";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/shared/app-error/AppError";
import type { IMailProvider } from "@/shared/providers/emails/providers/models/IMailProvider";
import RedisCacheProvider from "@/shared/providers/redis/redis-provider";
import { compare, hash } from "bcryptjs";
import type { HistoricoService } from "../historico/service";
import { api } from "../payment/api";
import type { ICustumer, IUser } from "./dto/interface";
import type {
	TEndereco,
	TLogin,
	TRegisterUser,
	TUpdateUser,
} from "./dto/types";

const redis = new RedisCacheProvider();

export class UserService {
	constructor(
		private history: HistoricoService,
		private sendMail: IMailProvider,
	) {}

	async register(obj: TRegisterUser) {
		const user = await prisma.user.findUnique({
			where: {
				email: obj.email,
			},
		});

		if (obj.cpfCnpj) {
			const doc = await prisma.user.findUnique({
				where: {
					cpfCnpj: obj.cpfCnpj,
				},
			});

			if (doc) {
				throw new AppError("Documento já cadastrado");
			}

			const cnpj = _validarCNPJ(obj.cpfCnpj.replace(/\D/g, ""));
			const cpf = _validarCPF(obj.cpfCnpj);

			if (obj.cpfCnpj.length > 11) {
				if (!cnpj) {
					throw new AppError("CNPJ inválido");
				}
			}
			//025.784.411-20
			if (obj.cpfCnpj.length <= 11) {
				if (!cpf) {
					throw new AppError("CPF inválido");
				}
			}
		}

		if (user) {
			throw new AppError("E-mail já cadastrado");
		}

		const pass = await hash(obj.senha, 6);

		const data = {
			...obj,
			senha: pass,
		};

		const register = await prisma.user.create({ data });

		this.history.create({
			titulo: "Cadastro realizado",
			descricao: "Registro na plataforma",
			userId: register.id,
		});

		await prisma.roles.create({
			data: {
				userId: register.id,
				tipo_acesso: [0],
			},
		});

		const bars = path.resolve(
			__dirname,
			"..",
			"..",
			"shared",
			"view",
			"send-wellcome.hbs",
		);

		await this.sendMail.sendMail({
			to: { name: obj.nome, email: obj.email },
			subject: "Treepy - Boas vindas",
			templateData: {
				file: bars,
				variables: {
					name: data.nome,
				},
			},
		});

		return "success";
	}

	async updateUser(obj: TUpdateUser) {
		const user = await this.getUserById(obj.id);
		const findEmail = await prisma.user.findUnique({
			where: {
				email: obj.email,
				NOT: {
					email: user.email,
				},
			},
		});

		if (findEmail) {
			throw new AppError("E-mail já sendo utilizado por outro usuário");
		}

		if (!user) {
			throw new AppError("Usuário não encontrado");
		}

		let pass = user.senha;

		if (obj.senha) {
			pass = await hash(obj.senha, 6);
		}

		const doc = await prisma.user.findUnique({
			where: {
				cpfCnpj: obj.cpfCnpj,
				NOT: {
					cpfCnpj: user.cpfCnpj,
				},
			},
		});

		if (doc) {
			throw new AppError("Documento já cadastrado");
		}

		const cnpj = _validarCNPJ(obj.cpfCnpj.replace(/\D/g, ""));
		const cpf = _validarCPF(obj.cpfCnpj);

		if (obj.cpfCnpj.length > 11) {
			if (!cnpj) {
				throw new AppError("CNPJ inválido");
			}
		}
		if (obj.cpfCnpj.length <= 11) {
			if (!cpf) {
				throw new AppError("CPF inválido");
			}
		}

		let customer = null;

		if (!user?.customerId) {
			customer = await this.registerCustumer({
				nome: obj.nome,
				email: obj.email,
				cpfCnpj: obj.cpfCnpj!,
			});
		}

		const update = await prisma.user.update({
			where: {
				id: obj.id,
			},
			data: {
				...obj,
				senha: pass,
				customerId: customer?.id,
			},
		});

		await redis.invalidatePrefix(obj.id);

		return update;
	}

	async registerCustumer({
		nome,
		email,
		cpfCnpj,
	}: { nome: string; email: string; cpfCnpj: string }) {
		try {
			const { data: custumer } = await api.post<ICustumer>("/customers", {
				name: nome,
				cpfCnpj: cpfCnpj,
				email: email,
				mobilePhone: "14991290949",
			});

			return custumer;
		} catch (error) {
			console.log(error);
			if (error instanceof AppError) {
				throw new AppError("Error");
			}
		}
	}

	async getUserById(userId: string) {
		let user = await redis.recover(`${userId}:userId`);

		if (!user) {
			user = await prisma.user.findUnique({
				where: {
					id: userId,
				},
				include: {
					roles: {
						select: {
							tipo_acesso: true,
						},
					},
					endereco: true,
					cardToken: true,
				},
			});

			await redis.save(`${userId}:userId`, user);
		}

		if (!user) {
			throw new AppError("Usuário não encontrado");
		}

		return user as IUser;
	}

	async listAll() {
		const list = await prisma.user.findMany();

		return list;
	}

	async login({ senha, email }: TLogin) {
		const findUser = await prisma.user.findFirst({
			where: { email },
			include: {
				roles: {
					select: {
						tipo_acesso: true,
					},
				},
			},
		});

		if (!findUser) {
			throw new AppError("Usuário não encontrado");
		}

		const compareHash = await compare(senha, findUser.senha);

		if (!compareHash) {
			throw new AppError("Senha inválida");
		}

		await prisma.historico.create({
			data: {
				titulo: "Login realizado",
				descricao: "Login na plataforma",
				userId: findUser.id,
			},
		});

		const user = {
			user: {
				id: findUser.id,
			},
			role: findUser.roles!.tipo_acesso,
		};

		return user;
	}

	async updateEnd(obj: TEndereco) {
		const end = await prisma.endereco.findUnique({
			where: { userId: obj.userId },
		});

		if (!end) {
			await prisma.endereco.create({
				data: {
					bairro: obj.bairro,
					cep: obj.cep,
					cidade: obj.cidade,
					estado: obj.estado,
					pais: obj.pais,
					numero: obj.numero,
					userId: obj.userId,
					rua: obj.rua,
				},
			});

			this.history.create({
				titulo: "Alteração de endereço",
				descricao: "Alterado endereço do usuário",
				userId: obj.userId,
			});

			await redis.invalidatePrefix(obj.userId);

			return "success";
		}

		await prisma.endereco.update({
			where: {
				id: end.id,
			},
			data: {
				bairro: obj.bairro,
				cep: obj.cep,
				cidade: obj.cidade,
				estado: obj.estado,
				pais: obj.pais,
				numero: obj.numero,
				userId: obj.userId,
				rua: obj.rua,
			},
		});

		this.history.create({
			titulo: "Alteração de endereço",
			descricao: "Alterado endereço do usuário",
			userId: obj.userId,
		});

		await redis.invalidatePrefix(obj.userId);

		return "success";
	}
}
