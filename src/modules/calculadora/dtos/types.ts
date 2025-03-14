import { z } from "zod";
import { validation } from "./validation";

export type TRegisterCalculadora = z.infer<typeof validation.registerCalculadora>