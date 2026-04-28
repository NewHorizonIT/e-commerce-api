import { inject, injectable } from 'tsyringe';
import { USER_TOKENS } from '../../tokens';
import { IUserRepository } from '../../domain/interface';
import { ShippingAddress } from '../../domain/domain';
import { CreateShippingAddressDTO, ShippingAddressDTO } from '../dtos';

@injectable()
export default class CreateShippingAddressUseCase {
  constructor(
    @inject(USER_TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(accountId: number, dto: CreateShippingAddressDTO): Promise<ShippingAddressDTO> {
    const shippingAddress = ShippingAddress.create({
      accountId,
      isDefault: dto.isDefault ?? false,
      streetAddress: dto.streetAddress,
      ward: dto.ward,
      province: dto.province,
      receiverName: dto.receiverName,
      receiverPhone: dto.receiverPhone,
    });

    const saved = await this.userRepository.saveShippingAddress(shippingAddress);

    return {
      id: saved.getRequiredId(),
      accountId: saved.getAccountId(),
      isDefault: saved.getIsDefault(),
      streetAddress: saved.getStreetAddress(),
      ward: saved.getWard(),
      province: saved.getProvince(),
      receiverName: saved.getReceiverName(),
      receiverPhone: saved.getReceiverPhone(),
    };
  }
}