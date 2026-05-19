import { AccountListQueryDTO, PaginatedAdminAccountsDTO } from '../application/dtos';
import Account from './domain';
import { PhoneNumber } from './value_objects';

export interface IAccountRepository {
  findById(id: number): Promise<Account | null>;
  save(account: Account): Promise<Account>;
  findByPhoneNum(phoneNum: PhoneNumber): Promise<Account | null>;
  listAccounts(query: AccountListQueryDTO): Promise<PaginatedAdminAccountsDTO>;
  updatePassword(id: number, newPassword: string): Promise<void>;
  lockAccount(id: number): Promise<void>;
  unlockAccount(id: number): Promise<void>;
}
