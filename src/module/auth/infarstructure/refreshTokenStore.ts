import { config, redisClient } from '@/config';
import { IRefreshTokenStore } from '../application/module_port';

function parseDurationToSeconds(value: string): number {
  const match = value.trim().match(/^(\d+)([smhd])$/i);

  if (!match) {
    return 7 * 24 * 60 * 60;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's':
      return amount;
    case 'm':
      return amount * 60;
    case 'h':
      return amount * 60 * 60;
    case 'd':
      return amount * 24 * 60 * 60;
    default:
      return 7 * 24 * 60 * 60;
  }
}

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
