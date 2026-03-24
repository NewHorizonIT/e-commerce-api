// Define interface
import Account from './domain';
import { PhoneNumber } from './value_objects';

/*
  Example:

  export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<void>;
  }
*/

export interface IAccountRepository {
  findById(id: number): Promise<Account | null>;
  save(account: Account): Promise<Account>;
  findByPhoneNum(phoneNum: PhoneNumber): Promise<Account | null>;
  updatePassword(id: number, newPassword: string): Promise<void>;
}
