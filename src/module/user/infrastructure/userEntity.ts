import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  PersonalInformation,
  ShippingAddress,
  UserProfile,
} from '../domain/domain';

@Entity('personal_informations')
export class PersonalInformationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, name: 'avatar_url', nullable: true })
  avatarUrl!: string | null;

  @Column({ type: 'boolean', nullable: true })
  gender!: boolean | null;

  @Column({ type: 'date', nullable: true })
  birth!: Date | null;

  @Column({ type: 'int', name: 'account_id' })
  accountId!: number;
}

@Entity('shipping_addresses')
export class ShippingAddressEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'boolean', name: 'is_default', default: false })
  isDefault!: boolean;

  @Column({ type: 'varchar', length: 255, name: 'street_address' })
  streetAddress!: string;

  @Column({ type: 'varchar', length: 255 })
  ward!: string;

  @Column({ type: 'varchar', length: 255 })
  province!: string;

  @Column({ type: 'varchar', length: 255, name: 'receiver_name' })
  receiverName!: string;

  @Column({ type: 'varchar', length: 255, name: 'receiver_phone' })
  receiverPhone!: string;

  @Column({ type: 'int', name: 'account_id' })
  accountId!: number;
}

export class UserMapper {
  static toPersonalInformationDomain(entity: PersonalInformationEntity): PersonalInformation {
    return PersonalInformation.rehydrate({
      id: entity.id,
      accountId: entity.accountId,
      name: entity.name,
      avatarUrl: entity.avatarUrl,
      gender: entity.gender,
      birth: entity.birth,
    });
  }

  static toPersonalInformationEntity(domain: PersonalInformation): PersonalInformationEntity {
    const entity = new PersonalInformationEntity();

    if (domain.getId() !== null) {
      entity.id = domain.getId() as number;
    }

    entity.accountId = domain.getAccountId();
    entity.name = domain.getName();
    entity.avatarUrl = domain.getAvatarUrl();
    entity.gender = domain.getGender();
    entity.birth = domain.getBirth();

    return entity;
  }

  static toShippingAddressDomain(entity: ShippingAddressEntity): ShippingAddress {
    return ShippingAddress.rehydrate({
      id: entity.id,
      accountId: entity.accountId,
      isDefault: entity.isDefault,
      streetAddress: entity.streetAddress,
      ward: entity.ward,
      province: entity.province,
      receiverName: entity.receiverName,
      receiverPhone: entity.receiverPhone,
    });
  }

  static toShippingAddressEntity(domain: ShippingAddress): ShippingAddressEntity {
    const entity = new ShippingAddressEntity();

    if (domain.getId() !== null) {
      entity.id = domain.getId() as number;
    }

    entity.accountId = domain.getAccountId();
    entity.isDefault = domain.getIsDefault();
    entity.streetAddress = domain.getStreetAddress();
    entity.ward = domain.getWard();
    entity.province = domain.getProvince();
    entity.receiverName = domain.getReceiverName();
    entity.receiverPhone = domain.getReceiverPhone();

    return entity;
  }

  static toProfileDomain(
    accountId: number,
    personalInformationEntity: PersonalInformationEntity | null,
    shippingAddressEntities: ShippingAddressEntity[]
  ): UserProfile {
    return UserProfile.rehydrate({
      accountId,
      personalInformation: personalInformationEntity
        ? UserMapper.toPersonalInformationDomain(personalInformationEntity)
        : null,
      shippingAddresses: shippingAddressEntities.map((entity) =>
        UserMapper.toShippingAddressDomain(entity)
      ),
    });
  }
}