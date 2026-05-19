// Implement interface of repository

import { AppDataSource } from '@/config';
import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { AccountListQueryDTO, PaginatedAdminAccountsDTO } from '../application/dtos';
import Account from '../domain/domain';
import { IAccountRepository } from '../domain/interface';
import { PhoneNumber } from '../domain/value_objects';
import { AccountEntity, AccountMapper } from './accountEntity';

@injectable()
export class TypeORMAccountRepository implements IAccountRepository {
  private get repo(): Repository<AccountEntity> {
    return AppDataSource.getRepository(AccountEntity);
  }

  async save(account: Account): Promise<Account> {
    const entity = AccountMapper.toEntity(account);
    const savedEntity = await this.repo.save(entity);
    return AccountMapper.toDomain(savedEntity);
  }

  async findByPhoneNum(phoneNum: PhoneNumber): Promise<Account | null> {
    const entity = await this.repo.findOne({ where: { phoneNum: phoneNum.value } });
    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async listAccounts(query: AccountListQueryDTO): Promise<PaginatedAdminAccountsDTO> {
    const page = query.page;
    const limit = query.limit;
    const [entities, totalItems] = await this.repo.findAndCount({
      order: { createdDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const items = entities.map((entity) => {
      const account = AccountMapper.toDomain(entity);

      return {
        id: account.getId() as number,
        phoneNum: account.getPhoneNum().value,
        role: account.getRole(),
        isLocked: account.getIsLocked(),
        createdDate: account.getCreatedDate(),
      };
    });

    return {
      items,
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    await this.repo.update({ id }, { password: newPassword });
  }

  async findById(id: number): Promise<Account | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async lockAccount(id: number): Promise<void> {
    await this.repo.update({ id }, { isLocked: true });
  }

  async unlockAccount(id: number): Promise<void> {
    await this.repo.update({ id }, { isLocked: false });
  }
}
