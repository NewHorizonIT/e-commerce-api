import { appLogger } from '@/shared/logging/appLogger';
import { inject, injectable } from 'tsyringe';
import { IAccountRepository } from '../../domain/interface';
import { AdminAccountResponseDTO, LockUnlockAccountDTO } from '../dtos';
import { AUTH_TOKENS } from '../../tokens';
import { NotFoundAccountErrorById } from './errors';

@injectable()
export default class UnlockAccountUseCase {
  constructor(
    @inject(AUTH_TOKENS.IAccountRepository)
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(dto: LockUnlockAccountDTO): Promise<AdminAccountResponseDTO> {
    const account = await this.accountRepository.findById(dto.accountId);

    if (!account) {
      throw new NotFoundAccountErrorById(dto.accountId);
    }

    await this.accountRepository.unlockAccount(dto.accountId);

    appLogger.info('Account unlocked', { accountId: dto.accountId });

    return {
      id: account.getId() as number,
      phoneNum: account.getPhoneNum().value,
      role: account.getRole(),
      isLocked: false,
      createdDate: account.getCreatedDate(),
    };
  }
}
