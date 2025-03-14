import RedisCacheProvider from "@/shared/providers/redis/redis-provider";
import { ServiceCalculadora } from "../calculadora/service";
import { ServiceFloresta } from "../florestas/service";
import { ServiceMetricas } from "./service";

export function service() {
  const cc = new ServiceCalculadora()
  const rd = new RedisCacheProvider()
  const jg = new ServiceFloresta(rd)
  const mt = new ServiceMetricas(cc, jg)

  return mt
}