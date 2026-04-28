import { InternalServerError } from '@/shared/error/error';
import { appLogger } from '@/shared/logging/appLogger';
import { hashPassword } from '@/shared/utils/hash-password';
import { generatePairJwtTokens } from '@/shared/utils/jwt';
import { inject, injectable } from 'tsyringe';
import { AuthSessionDTO, CreateAccountDTO } from '../dtos';
import { IRefreshTokenStore } from '../module_port';
import Account from '../../domain/domain';
import { IAccountRepository } from '../../domain/interface';
import { PhoneNumber } from '../../domain/value_objects';
import { PhoneNumberAlreadyExistsError } from './errors';
import { AUTH_TOKENS } from '../../tokens';

@injectable()
export default class RegisterUseCase {
  constructor(
    @inject(AUTH_TOKENS.IAccountRepository)
    private readonly accountRepository: IAccountRepository,
    @inject(AUTH_TOKENS.IRefreshTokenStore)
    private readonly refreshTokenStore: IRefreshTokenStore
  ) {}

  async execute(dto: CreateAccountDTO): Promise<AuthSessionDTO> {
    const phoneNum = new PhoneNumber(dto.phoneNum);
    const existingAccount = await this.accountRepository.findByPhoneNum(phoneNum);

    if (existingAccount) {
      throw new PhoneNumberAlreadyExistsError(dto.phoneNum);
    }

    Account.ensurePasswordStrength(dto.password);

    const passwordHash = await hashPassword(dto.password);
    const newAccount = Account.create({ phoneNum, passwordHash });
    const savedAccount = await this.accountRepository.save(newAccount);
    const accountId = savedAccount.getId();

    if (accountId === null) {
      throw new InternalServerError('Failed to create account');
    }

    const { accessToken, refreshToken } = generatePairJwtTokens({ id: accountId });
    await this.refreshTokenStore.save(accountId, refreshToken);

    appLogger.info('Auth register success', {
      accountId,
      phoneNum: savedAccount.getPhoneNum().value,
    });

    return {
      id: accountId,
      phoneNum: savedAccount.getPhoneNum().value,
      accessToken,
      refreshToken,
    };
  }
}
