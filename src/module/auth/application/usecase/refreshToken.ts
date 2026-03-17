import { config } from '@/config';
import { appLogger } from '@/shared/logging/appLogger';
import { generatePairJwtTokens, verifyJwtToken } from '@/shared/utils/jwt';
import { SessionExpiredError } from '../../domain/errors';
import { IAccountRepository } from '../../domain/interface';
import { AuthSessionDTO } from '../dtos';
import { IRefreshTokenStore } from '../module_port';
import { AccountIsLockedError, NotFoundAccountError } from './errors';

interface RefreshTokenPayload {
  id: number;
}

export default class RefreshTokenUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly refreshTokenStore: IRefreshTokenStore
  ) {}

  async execute(refreshToken: string): Promise<AuthSessionDTO> {
    const payload = verifyJwtToken<RefreshTokenPayload>(
      refreshToken,
      config.jwt.refreshToken.secret
    );
    const storedRefreshToken = await this.refreshTokenStore.get(payload.id);

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      throw new SessionExpiredError();
    }

    const account = await this.accountRepository.findById(payload.id);

    if (!account) {
      throw new NotFoundAccountError(`with id ${payload.id}`);
    }

    if (account.getIsLocked()) {
      throw new AccountIsLockedError(account.getPhoneNum().value);
    }

    const { accessToken, refreshToken: nextRefreshToken } = generatePairJwtTokens({
      id: payload.id,
    });
    await this.refreshTokenStore.save(payload.id, nextRefreshToken);

    appLogger.info('Auth refresh success', {
      accountId: payload.id,
      phoneNum: account.getPhoneNum().value,
    });

    return {
      id: payload.id,
      phoneNum: account.getPhoneNum().value,
      accessToken,
      refreshToken: nextRefreshToken,
    };
  }
}
