import { env } from "@/env";
import { AppError } from "@/shared/app-error/AppError";
import axios, { type AxiosError } from "axios";

const baseURL = env.NODE_ENV === "tst" ? env.API_URL_SANDBOX : env.API_URL;

const access_token =
	env.NODE_ENV === "prd" ? env.ACESS_TOKEN : env.ACESS_TOKEN_SANDBOX;

const api = axios.create({
	baseURL,
	headers: {
		access_token,
	},
});

api.interceptors.response.use(
	(success) => success,
	(error: AxiosError) => {
		console.log({ api: error?.response });
		const res = error?.response?.data?.errors[0];

		if (res) {
			return Promise.reject(
				new AppError(`${res.code}, ${res.description}`),
			);
		}

		return Promise.reject(error);
	},
);

export { api };
