import { inject, injectable } from 'tsyringe';
import { appLogger } from '@/shared/logging/appLogger';
import { USER_TOKENS } from '../../tokens';
import { IUserRepository } from '../../domain/interface';
import { PersonalInformationDTO, AdminUpdatePersonalInformationDTO } from '../dtos';
import { PersonalInformation } from '../../domain/domain';
import { NotFoundAccountError } from '../../domain/errors';

@injectable()
export default class AdminUpdatePersonalInformationUseCase {
  constructor(
    @inject(USER_TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: AdminUpdatePersonalInformationDTO): Promise<PersonalInformationDTO> {
    let personalInformation = await this.userRepository.findPersonalInformationByAccountId(
      dto.accountId
    );

    if (!personalInformation) {
      throw new NotFoundAccountError(dto.accountId);
    }

    personalInformation = PersonalInformation.rehydrate({
      id: personalInformation.getId()!,
      accountId: dto.accountId,
      name: dto.name ?? personalInformation.getName(),
      avatarUrl: dto.avatarUrl !== undefined ? dto.avatarUrl : personalInformation.getAvatarUrl(),
      gender: dto.gender !== undefined ? dto.gender : personalInformation.getGender(),
      birth: dto.birth !== undefined ? dto.birth : personalInformation.getBirth(),
    });

    const saved = await this.userRepository.savePersonalInformation(personalInformation);

    appLogger.info('Admin updated personal information', {
      personalInformationId: saved.getId(),
      accountId: dto.accountId,
    });

    return {
      id: saved.getId()!,
      accountId: saved.getAccountId(),
      name: saved.getName(),
      avatarUrl: saved.getAvatarUrl(),
      gender: saved.getGender(),
      birth: saved.getBirth(),
    };
  }
}
