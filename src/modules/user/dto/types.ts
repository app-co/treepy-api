import { z } from "zod";
import { schemas } from "./shema";


export type TRegisterUser = z.infer<typeof schemas.registerUser>
export type TUpdateUser = z.infer<typeof schemas.updateUser>
export type TLogin = z.infer<typeof schemas.login>
export type TEndereco = z.infer<typeof schemas.endereco>