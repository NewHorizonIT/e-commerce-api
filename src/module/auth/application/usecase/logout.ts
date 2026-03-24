import { config } from '@/config';
import { appLogger } from '@/shared/logging/appLogger';
import { UnauthorizedError } from '@/shared/error/error';
import { verifyJwtToken } from '@/shared/utils/jwt';
import { IRefreshTokenStore } from '../module_port';

interface RefreshTokenPayload {
  id: number;
}

export default class LogoutUseCase {
  constructor(private readonly refreshTokenStore: IRefreshTokenStore) {}

  async execute(refreshToken: string): Promise<void> {
    const payload = verifyJwtToken<RefreshTokenPayload>(
      refreshToken,
      config.jwt.refreshToken.secret
    );
    const storedRefreshToken = await this.refreshTokenStore.get(payload.id);

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      throw new UnauthorizedError('Refresh token is invalid or expired');
    }

    await this.refreshTokenStore.delete(payload.id);

    appLogger.info('Auth logout success', {
      accountId: payload.id,
    });
  }
}
