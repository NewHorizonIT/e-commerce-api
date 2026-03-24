import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import Account from '../domain/domain';
import { PhoneNumber } from '../domain/value_objects';

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 15, unique: true })
  phoneNum!: string;
  @Column({ type: 'varchar', length: 255 })
  password!: string;
  @CreateDateColumn()
  createdDate!: Date;
  @Column({ type: 'boolean', default: false })
  isLocked!: boolean;
}

export class AccountMapper {
  static toDomain(entity: AccountEntity): Account {
    return Account.rehydrate({
      id: entity.id,
      phoneNum: new PhoneNumber(entity.phoneNum),
      passwordHash: entity.password,
      createdDate: entity.createdDate,
      isLocked: entity.isLocked,
    });
  }

  static toEntity(domain: Account): AccountEntity {
    const entity = new AccountEntity();

    if (domain.getId() !== null) {
      entity.id = domain.getId() as number;
    }

    entity.phoneNum = domain.getPhoneNum().value;
    entity.password = domain.getPassword();

    if (domain.getCreatedDate()) {
      entity.createdDate = domain.getCreatedDate() as Date;
    }

    entity.isLocked = domain.getIsLocked();
    return entity;
  }
}

export { AccountMapper as MapperProduct };
