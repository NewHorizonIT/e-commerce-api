// Implement interface of repository

import { Repository } from 'typeorm';
import Account from '../domain/domain';
import { IAccountRepository } from '../domain/interface';
import { PhoneNumber } from '../domain/value_objects';
import { AccountEntity, AccountMapper } from './accountEntity';

/*
  Example:

  class <NameRepository> implements I<NameRepository> {
    async findById(id: string): Promise<User | null> {
      // Implement the logic to find a user by ID
    }

    async save(user: User): Promise<void> {
      // Implement the logic to save a user
    }
  }
*/

export class TypeORMAccountRepository implements IAccountRepository {
  constructor(private readonly repo: Repository<AccountEntity>) {}

  async save(account: Account): Promise<Account> {
    const entity = AccountMapper.toEntity(account);
    const savedEntity = await this.repo.save(entity);
    return AccountMapper.toDomain(savedEntity);
  }

  async findByPhoneNum(phoneNum: PhoneNumber): Promise<Account | null> {
    const entity = await this.repo.findOne({ where: { phoneNum: phoneNum.value } });
    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    await this.repo.update({ id }, { password: newPassword });
  }

  async findById(id: number): Promise<Account | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? AccountMapper.toDomain(entity) : null;
  }
}
