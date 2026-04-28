import { AppDataSource } from '@/config';
import { injectable } from 'tsyringe';
import { Not, Repository } from 'typeorm';
import { IUserRepository } from '../domain/interface';
import { PersonalInformation, ShippingAddress, UserProfile } from '../domain/domain';
import {
  PersonalInformationEntity,
  ShippingAddressEntity,
  UserMapper,
} from './userEntity';

@injectable()
export class TypeORMUserRepository implements IUserRepository {
  private readonly personalInformationRepo: Repository<PersonalInformationEntity>;
  private readonly shippingAddressRepo: Repository<ShippingAddressEntity>;

  constructor() {
    this.personalInformationRepo = AppDataSource.getRepository(PersonalInformationEntity);
    this.shippingAddressRepo = AppDataSource.getRepository(ShippingAddressEntity);
  }

  async findProfileByAccountId(accountId: number): Promise<UserProfile> {
    const [personalInformationEntity, shippingAddressEntities] = await Promise.all([
      this.personalInformationRepo.findOne({ where: { accountId } }),
      this.shippingAddressRepo.find({
        where: { accountId },
        order: { isDefault: 'DESC', id: 'ASC' },
      }),
    ]);

    return UserMapper.toProfileDomain(accountId, personalInformationEntity, shippingAddressEntities);
  }

  async findPersonalInformationByAccountId(
    accountId: number
  ): Promise<PersonalInformation | null> {
    const entity = await this.personalInformationRepo.findOne({ where: { accountId } });

    return entity ? UserMapper.toPersonalInformationDomain(entity) : null;
  }

  async savePersonalInformation(personalInformation: PersonalInformation): Promise<PersonalInformation> {
    const entity = UserMapper.toPersonalInformationEntity(personalInformation);

    const savedEntity = await AppDataSource.transaction(async (manager) => {
      const existingEntity = await manager.findOne(PersonalInformationEntity, {
        where: { accountId: entity.accountId },
      });

      if (existingEntity) {
        entity.id = existingEntity.id;
      }

      return manager.save(PersonalInformationEntity, entity);
    });

    return UserMapper.toPersonalInformationDomain(savedEntity);
  }

  async listShippingAddresses(accountId: number): Promise<ShippingAddress[]> {
    const entities = await this.shippingAddressRepo.find({
      where: { accountId },
      order: { isDefault: 'DESC', id: 'ASC' },
    });

    return entities.map((entity) => UserMapper.toShippingAddressDomain(entity));
  }

  async findShippingAddressById(
    accountId: number,
    addressId: number
  ): Promise<ShippingAddress | null> {
    const entity = await this.shippingAddressRepo.findOne({
      where: { accountId, id: addressId },
    });

    return entity ? UserMapper.toShippingAddressDomain(entity) : null;
  }

  async saveShippingAddress(shippingAddress: ShippingAddress): Promise<ShippingAddress> {
    const entity = UserMapper.toShippingAddressEntity(shippingAddress);

    const savedEntity = await AppDataSource.transaction(async (manager) => {
      if (entity.isDefault) {
        const filter = entity.id
          ? { accountId: entity.accountId, id: Not(entity.id) }
          : { accountId: entity.accountId };

        await manager.update(ShippingAddressEntity, filter, { isDefault: false });
      }

      const existingEntity = entity.id
        ? await manager.findOne(ShippingAddressEntity, {
            where: { accountId: entity.accountId, id: entity.id },
          })
        : null;

      if (existingEntity && !entity.id) {
        entity.id = existingEntity.id;
      }

      return manager.save(ShippingAddressEntity, entity);
    });

    return UserMapper.toShippingAddressDomain(savedEntity);
  }

  async deleteShippingAddress(accountId: number, addressId: number): Promise<boolean> {
    const result = await this.shippingAddressRepo.delete({ accountId, id: addressId });
    return (result.affected ?? 0) > 0;
  }
}