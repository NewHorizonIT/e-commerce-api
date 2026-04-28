import { inject, injectable } from 'tsyringe';
import { USER_TOKENS } from '../../tokens';
import { IUserRepository } from '../../domain/interface';
import { ShippingAddressNotFoundError } from '../../domain/errors';

@injectable()
export default class DeleteShippingAddressUseCase {
  constructor(
    @inject(USER_TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(accountId: number, addressId: number): Promise<void> {
    const deleted = await this.userRepository.deleteShippingAddress(accountId, addressId);

    if (!deleted) {
      throw new ShippingAddressNotFoundError(accountId, addressId);
    }
  }
}