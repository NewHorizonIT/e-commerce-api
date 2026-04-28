import { inject, injectable } from 'tsyringe';
import { USER_TOKENS } from '../../tokens';
import { IUserRepository } from '../../domain/interface';
import { UserProfileDTO } from '../dtos';

@injectable()
export default class GetCurrentProfileUseCase {
  constructor(
    @inject(USER_TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(accountId: number): Promise<UserProfileDTO> {
    const profile = await this.userRepository.findProfileByAccountId(accountId);

    const personalInformation = profile.getPersonalInformation();

    return {
      accountId: profile.getAccountId(),
      personalInformation: personalInformation
        ? {
            id: personalInformation.getRequiredId(),
            accountId: personalInformation.getAccountId(),
            name: personalInformation.getName(),
            avatarUrl: personalInformation.getAvatarUrl(),
            gender: personalInformation.getGender(),
            birth: personalInformation.getBirth(),
          }
        : null,
      shippingAddresses: profile.getShippingAddresses().map((address) => ({
        id: address.getRequiredId(),
        accountId: address.getAccountId(),
        isDefault: address.getIsDefault(),
        streetAddress: address.getStreetAddress(),
        ward: address.getWard(),
        province: address.getProvince(),
        receiverName: address.getReceiverName(),
        receiverPhone: address.getReceiverPhone(),
      })),
    };
  }
}