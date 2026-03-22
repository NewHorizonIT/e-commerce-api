import { config } from '@/config';
import { appLogger } from '@/shared/logging/appLogger';
import { UnauthorizedError } from '@/shared/error/error';
import { verifyJwtToken } from '@/shared/utils/jwt';
import { inject, injectable } from 'tsyringe';
import { IRefreshTokenStore } from '../module_port';
import { AUTH_TOKENS } from '../../tokens';

interface RefreshTokenPayload {
  id: number;
}

@injectable()
export default class LogoutUseCase {
  constructor(
    @inject(AUTH_TOKENS.IRefreshTokenStore)
    private readonly refreshTokenStore: IRefreshTokenStore
  ) {}

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
