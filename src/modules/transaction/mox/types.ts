import { z } from "zod";
import { schemas } from "./schemas";

export type TCard = z.infer<typeof schemas.card>