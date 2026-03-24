import { IAccountRepository } from '../../domain/interface';
import { AuthSessionInfoDTO } from '../dtos';
import { NotFoundAccountErrorById } from './errors';

export default class GetCurrentSessionUseCase {
  constructor(private accountRepository: IAccountRepository) {}
  async execute(userId: number): Promise<AuthSessionInfoDTO> {
    const account = await this.accountRepository.findById(userId);
    if (!account) {
      throw new NotFoundAccountErrorById(userId);
    }
    const response: AuthSessionInfoDTO = {
      id: account.getId()!,
      phoneNum: account.getPhoneNum().value,
    };
    return response;
  }
}
