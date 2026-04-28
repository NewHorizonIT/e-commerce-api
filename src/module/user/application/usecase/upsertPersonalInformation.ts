import { inject, injectable } from 'tsyringe';
import { USER_TOKENS } from '../../tokens';
import { IUserRepository } from '../../domain/interface';
import { PersonalInformation } from '../../domain/domain';
import { PersonalInformationDTO, UpsertPersonalInformationDTO } from '../dtos';

@injectable()
export default class UpsertPersonalInformationUseCase {
  constructor(
    @inject(USER_TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(
    accountId: number,
    dto: UpsertPersonalInformationDTO
  ): Promise<PersonalInformationDTO> {
    const personalInformation = PersonalInformation.create({
      accountId,
      name: dto.name,
      avatarUrl: dto.avatarUrl ?? null,
      gender: dto.gender ?? null,
      birth: dto.birth ?? null,
    });

    const saved = await this.userRepository.savePersonalInformation(personalInformation);

    return {
      id: saved.getRequiredId(),
      accountId: saved.getAccountId(),
      name: saved.getName(),
      avatarUrl: saved.getAvatarUrl(),
      gender: saved.getGender(),
      birth: saved.getBirth(),
    };
  }
}