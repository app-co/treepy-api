/* eslint-disable prettier/prettier */
import { env } from '@/env';
import Redis, { Redis as RedisClient } from 'ioredis';


const options = {
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
};

export default class RedisCacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(options);
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    const parseData = JSON.parse(data) as T;
    return parseData;
  }

  public async removeAll(): Promise<void> {
    await this.client.flushall();
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);

    const pipeline = this.client.pipeline();

    keys.forEach(key => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}
