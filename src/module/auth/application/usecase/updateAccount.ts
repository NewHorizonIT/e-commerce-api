import { appLogger } from '@/shared/logging/appLogger';
import { hashPassword, comparePassword } from '@/shared/utils/hash-password';
import { inject, injectable } from 'tsyringe';
import { IAccountRepository } from '../../domain/interface';
import { AdminAccountResponseDTO, UpdateAccountDTO } from '../dtos';
import { AUTH_TOKENS } from '../../tokens';
import { NotFoundAccountErrorById } from './errors';
import { PhoneNumber } from '../../domain/value_objects';
import { PhoneNumberAlreadyExistsError } from './errors';
import Account from '../../domain/domain';

@injectable()
export default class UpdateAccountUseCase {
  constructor(
    @inject(AUTH_TOKENS.IAccountRepository)
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(dto: UpdateAccountDTO): Promise<AdminAccountResponseDTO> {
    let account = await this.accountRepository.findById(dto.accountId);

    if (!account) {
      throw new NotFoundAccountErrorById(dto.accountId);
    }

    // Check if phone number is being changed
    if (dto.phoneNum && dto.phoneNum !== account.getPhoneNum().value) {
      const existingAccount = await this.accountRepository.findByPhoneNum(
        new PhoneNumber(dto.phoneNum)
      );
      if (existingAccount) {
        throw new PhoneNumberAlreadyExistsError(dto.phoneNum);
      }
    }

    // Update password if provided
    if (dto.password) {
      Account.ensurePasswordStrength(dto.password);
      const hashedPassword = await hashPassword(dto.password);
      await this.accountRepository.updatePassword(dto.accountId, hashedPassword);
    }

    // Update phone number if provided
    if (dto.phoneNum && dto.phoneNum !== account.getPhoneNum().value) {
      account = Account.rehydrate({
        id: account.getId() as number,
        phoneNum: new PhoneNumber(dto.phoneNum),
        passwordHash: account.getPassword(),
        createdDate: account.getCreatedDate() as Date,
        isLocked: account.getIsLocked(),
        role: dto.role ?? account.getRole(),
      });
      await this.accountRepository.save(account);
    } else if (dto.role && dto.role !== account.getRole()) {
      // Update role if provided
      account.setRole(dto.role);
      await this.accountRepository.save(account);
    }

    appLogger.info('Account updated', { accountId: dto.accountId });

    return {
      id: account.getId() as number,
      phoneNum: dto.phoneNum ?? account.getPhoneNum().value,
      role: dto.role ?? account.getRole(),
      isLocked: account.getIsLocked(),
      createdDate: account.getCreatedDate(),
    };
  }
}
