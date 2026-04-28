import { config, redisClient } from '@/config';
import { injectable } from 'tsyringe';
import { parseDurationToSeconds } from '@/shared/utils/duration';
import { IRefreshTokenStore } from '../application/module_port';

@injectable()
export class RedisRefreshTokenStore implements IRefreshTokenStore {
  private readonly ttlSeconds = parseDurationToSeconds(config.jwt.refreshToken.expiresIn);

  private buildKey(accountId: number): string {
    return `auth:refresh-token:${accountId}`;
  }

  async save(accountId: number, refreshToken: string): Promise<void> {
    await redisClient.set(this.buildKey(accountId), refreshToken, this.ttlSeconds);
  }

  async get(accountId: number): Promise<string | null> {
    return redisClient.get(this.buildKey(accountId));
  }

  async delete(accountId: number): Promise<void> {
    await redisClient.del(this.buildKey(accountId));
  }
}
