import { routesFloresta } from "@/modules/florestas/routes";
import { routeTransaction } from "@/modules/transaction/routes";
import { authUser } from "@/modules/user/routes/auth.routes";
import { RouteUser } from "@/modules/user/routes/routes";
import { FastifyInstance } from "fastify";

export async function Routes(app: FastifyInstance) {
  app.register(RouteUser);
  app.register(authUser);
  app.register(routeTransaction)
  app.register(routesFloresta)
}