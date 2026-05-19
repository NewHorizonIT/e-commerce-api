import { AccountEntity } from '@/module/auth/infarstructure/accountEntity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('account_oauth')
export class AccountOAuthEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 255 })
  provider!: string;
  @Column({ type: 'varchar', length: 255 })
  providerId!: string;
  // Access Token
  @Column({ type: 'varchar', length: 255 })
  accessToken!: string;
  // Refresh Token
  @Column({ type: 'varchar', length: 255 })
  refreshToken!: string;

  @OneToOne(() => AccountEntity, (account) => account.oauth, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account!: AccountEntity;
}

// Mapper
export class AccountOAuthMapper {
  static toEntity(
    provider: string,
    providerId: string,
    accessToken: string,
    refreshToken: string
  ): AccountOAuthEntity {
    const entity = new AccountOAuthEntity();
    entity.provider = provider;
    entity.providerId = providerId;
    entity.accessToken = accessToken;
    entity.refreshToken = refreshToken;
    return entity;
  }
}
