import { AccountEntity } from '@/module/auth/infarstructure/accountEntity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('account_credentials')
export class AccountCredentialEntity {
  @PrimaryColumn({ type: 'int' })
  id!: number;
  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;
  // AccountID reference
  @OneToOne(() => AccountEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  account!: AccountEntity;
}

// Mapper
export class AccountCredentialMapper {
  static toEntity(passwordHash: string): AccountCredentialEntity {
    const entity = new AccountCredentialEntity();
    entity.passwordHash = passwordHash;
    entity.account = new AccountEntity();
    return entity;
  }
}

export { AccountCredentialMapper as MapperAccountCredential };
