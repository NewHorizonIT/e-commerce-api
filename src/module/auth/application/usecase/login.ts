import { appLogger } from '@/shared/logging/appLogger';
import { inject, injectable } from 'tsyringe';
import { IAccountRepository } from '../../domain/interface';
import { PhoneNumber } from '../../domain/value_objects';
import { AuthSessionDTO, CreateAccountDTO } from '../dtos';
import { IRefreshTokenStore } from '../module_port';
import { AccountIsLockedError, InvalidCredentialsError, NotFoundAccountError } from './errors';
import { comparePassword } from '@/shared/utils/hash-password';
import { generatePairJwtTokens } from '@/shared/utils/jwt';
import { AUTH_TOKENS } from '../../tokens';

@injectable()
export default class LoginUseCase {
  constructor(
    @inject(AUTH_TOKENS.IAccountRepository)
    private readonly accountRepository: IAccountRepository,
    @inject(AUTH_TOKENS.IRefreshTokenStore)
    private readonly refreshTokenStore: IRefreshTokenStore
  ) {}

  async execute(dto: CreateAccountDTO): Promise<AuthSessionDTO> {
    // Find account by phone number
    const account = await this.accountRepository.findByPhoneNum(new PhoneNumber(dto.phoneNum));
    if (!account) {
      throw new NotFoundAccountError(dto.phoneNum);
    }

    // Compare password
    const isPasswordValid = await comparePassword(dto.password, account.getPassword());

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Check if account is locked
    if (account.getIsLocked()) {
      throw new AccountIsLockedError(dto.phoneNum);
    }

    // Generate token
    const accountId = account.getId();

    if (accountId === null) {
      throw new NotFoundAccountError(dto.phoneNum);
    }

    const { accessToken, refreshToken } = generatePairJwtTokens({ id: accountId });
    await this.refreshTokenStore.save(accountId, refreshToken);

    appLogger.info('Auth login success', {
      accountId,
      phoneNum: account.getPhoneNum().value,
    });

    // Create response
    const response: AuthSessionDTO = {
      id: accountId,
      phoneNum: account.getPhoneNum().value,
      accessToken,
      refreshToken,
    };

    return response;
  }
}
