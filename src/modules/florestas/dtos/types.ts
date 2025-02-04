import { z } from "zod";
import { validation } from "./validations";

export type TCreateFloresta = z.infer<typeof validation.create>