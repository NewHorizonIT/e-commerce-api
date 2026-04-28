import { inject, injectable } from 'tsyringe';
import { USER_TOKENS } from '../../tokens';
import { IUserRepository } from '../../domain/interface';
import { ShippingAddress } from '../../domain/domain';
import { ShippingAddressNotFoundError } from '../../domain/errors';
import { ShippingAddressDTO, UpdateShippingAddressDTO } from '../dtos';

@injectable()
export default class UpdateShippingAddressUseCase {
  constructor(
    @inject(USER_TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(
    accountId: number,
    addressId: number,
    dto: UpdateShippingAddressDTO
  ): Promise<ShippingAddressDTO> {
    const current = await this.userRepository.findShippingAddressById(accountId, addressId);

    if (!current) {
      throw new ShippingAddressNotFoundError(accountId, addressId);
    }

    const shippingAddress = ShippingAddress.rehydrate({
      id: current.getRequiredId(),
      accountId: current.getAccountId(),
      isDefault: dto.isDefault ?? current.getIsDefault(),
      streetAddress: dto.streetAddress ?? current.getStreetAddress(),
      ward: dto.ward ?? current.getWard(),
      province: dto.province ?? current.getProvince(),
      receiverName: dto.receiverName ?? current.getReceiverName(),
      receiverPhone: dto.receiverPhone ?? current.getReceiverPhone(),
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