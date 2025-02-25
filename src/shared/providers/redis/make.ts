import RedisCacheProvider from './redis-provider';

export function makeRedis() {
  return new RedisCacheProvider();
}
