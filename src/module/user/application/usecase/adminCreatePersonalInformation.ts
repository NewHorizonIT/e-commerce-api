import { inject, injectable } from 'tsyringe';
import { appLogger } from '@/shared/logging/appLogger';
import { USER_TOKENS } from '../../tokens';
import { IUserRepository } from '../../domain/interface';
import { PersonalInformationDTO, AdminCreatePersonalInformationDTO } from '../dtos';
import { PersonalInformation } from '../../domain/domain';

@injectable()
export default class AdminCreatePersonalInformationUseCase {
  constructor(
    @inject(USER_TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: AdminCreatePersonalInformationDTO): Promise<PersonalInformationDTO> {
    let personalInformation = await this.userRepository.findPersonalInformationByAccountId(
      dto.accountId
    );

    if (personalInformation) {
      // Update existing
      personalInformation = PersonalInformation.rehydrate({
        id: personalInformation.getId()!,
        accountId: dto.accountId,
        name: dto.name,
        avatarUrl: dto.avatarUrl ?? null,
        gender: dto.gender ?? null,
        birth: dto.birth ?? null,
      });
    } else {
      // Create new
      personalInformation = PersonalInformation.create({
        accountId: dto.accountId,
        name: dto.name,
        avatarUrl: dto.avatarUrl ?? null,
        gender: dto.gender ?? null,
        birth: dto.birth ?? null,
      });
    }

    const saved = await this.userRepository.savePersonalInformation(personalInformation);

    appLogger.info('Admin created personal information', {
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
