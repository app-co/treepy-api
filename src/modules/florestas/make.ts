import RedisCacheProvider from "@/shared/providers/redis/redis-provider";
import { ServiceFloresta } from "./service";

export function make() {
  const redis = new RedisCacheProvider()
  const service = new ServiceFloresta(redis)

  return service;
}