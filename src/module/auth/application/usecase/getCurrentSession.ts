import { IAccountRepository } from '../../domain/interface';
import { inject, injectable } from 'tsyringe';
import { AuthSessionInfoDTO } from '../dtos';
import { NotFoundAccountErrorById } from './errors';
import { AUTH_TOKENS } from '../../tokens';

@injectable()
export default class GetCurrentSessionUseCase {
  constructor(
    @inject(AUTH_TOKENS.IAccountRepository)
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(userId: number): Promise<AuthSessionInfoDTO> {
    const account = await this.accountRepository.findById(userId);

    if (!account) {
      throw new NotFoundAccountErrorById(userId);
    }

    const response: AuthSessionInfoDTO = {
      id: account.getId()!,
      phoneNum: account.getPhoneNum().value,
      role: account.getRole(),
    };

    return response;
  }
}
