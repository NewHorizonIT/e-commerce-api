import { appLogger } from '@/shared/logging/appLogger';
import { hashPassword } from '@/shared/utils/hash-password';
import { inject, injectable } from 'tsyringe';
import { IAccountRepository } from '../../domain/interface';
import { AdminAccountResponseDTO, ResetPasswordDTO } from '../dtos';
import { AUTH_TOKENS } from '../../tokens';
import { NotFoundAccountErrorById } from './errors';

// Default password for account reset
const DEFAULT_RESET_PASSWORD = 'DefaultPassword@123';

@injectable()
export default class ResetPasswordUseCase {
  constructor(
    @inject(AUTH_TOKENS.IAccountRepository)
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<AdminAccountResponseDTO> {
    const account = await this.accountRepository.findById(dto.accountId);

    if (!account) {
      throw new NotFoundAccountErrorById(dto.accountId);
    }

    const hashedPassword = await hashPassword(DEFAULT_RESET_PASSWORD);
    await this.accountRepository.updatePassword(dto.accountId, hashedPassword);

    appLogger.info('Account password reset to default', { accountId: dto.accountId });

    return {
      id: account.getId() as number,
      phoneNum: account.getPhoneNum().value,
      role: account.getRole(),
      isLocked: account.getIsLocked(),
      createdDate: account.getCreatedDate(),
    };
  }
}
