import { inject, injectable } from 'tsyringe';
import { AUTH_TOKENS } from '../../tokens';
import { AccountListQueryDTO, PaginatedAdminAccountsDTO } from '../dtos';
import { IAccountRepository } from '../../domain/interface';

@injectable()
export default class ListAccountsUseCase {
  constructor(
    @inject(AUTH_TOKENS.IAccountRepository)
    private readonly accountRepository: IAccountRepository
  ) {}

  execute(query: AccountListQueryDTO): Promise<PaginatedAdminAccountsDTO> {
    return this.accountRepository.listAccounts(query);
  }
}
