import { inject, injectable } from 'tsyringe';
import { USER_TOKENS } from '../../tokens';
import { IUserRepository } from '../../domain/interface';
import { ShippingAddressDTO } from '../dtos';

@injectable()
export default class ListShippingAddressesUseCase {
  constructor(
    @inject(USER_TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(accountId: number): Promise<ShippingAddressDTO[]> {
    const addresses = await this.userRepository.listShippingAddresses(accountId);

    return addresses.map((address) => ({
      id: address.getRequiredId(),
      accountId: address.getAccountId(),
      isDefault: address.getIsDefault(),
      streetAddress: address.getStreetAddress(),
      ward: address.getWard(),
      province: address.getProvince(),
      receiverName: address.getReceiverName(),
      receiverPhone: address.getReceiverPhone(),
    }));
  }
}