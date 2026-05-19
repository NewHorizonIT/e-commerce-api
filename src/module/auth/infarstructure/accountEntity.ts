import { AccountCredentialEntity } from '@/module/auth/infarstructure/accountCerdential';
import { AccountOAuthEntity } from '@/module/auth/infarstructure/accountOAuth';
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Account from '../domain/domain';
import { PhoneNumber, typeAuth } from '../domain/value_objects';

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 15, unique: true })
  phoneNum!: string;
  @CreateDateColumn()
  createdDate!: Date;
  @Column({ enum: [typeAuth.CERDENTIAL, typeAuth.OAUTH], type: 'enum', length: 20 })
  type!: typeAuth;
  @Column({ type: 'varchar', length: 10, default: 'user' })
  role!: 'admin' | 'user';
  @Column({ type: 'boolean', default: false })
  isLocked!: boolean;

  @OneToOne(() => AccountCredentialEntity, (credential) => credential.account)
  credential?: AccountCredentialEntity;

  @OneToOne(() => AccountOAuthEntity, (oauth) => oauth.account)
  oauth?: AccountOAuthEntity;
}

export class AccountMapper {
  static toDomain(entity: AccountEntity): Account {
    return Account.rehydrate({
      id: entity.id,
      phoneNum: new PhoneNumber(entity.phoneNum),
      createdDate: entity.createdDate,
      type: entity.type as typeAuth,
      isLocked: entity.isLocked,
      role: entity.role as 'admin' | 'user',
    });
  }

  static toEntity(domain: Account): AccountEntity {
    const entity = new AccountEntity();

    if (domain.getId() !== null) {
      entity.id = domain.getId() as number;
    }

    entity.phoneNum = domain.getPhoneNum().value;

    if (domain.getCreatedDate()) {
      entity.createdDate = domain.getCreatedDate() as Date;
    }

    entity.isLocked = domain.getIsLocked();
    entity.role = domain.getRole();
    return entity;
  }
}

export { AccountMapper as MapperProduct };
