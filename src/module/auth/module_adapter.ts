import {
  AuthAccountDTO,
  AuthSessionDTO,
  AuthSessionInfoDTO,
  CreateAccountDTO,
} from './application/dtos';
import { IAuthModulePort } from './application/module_port';
import GetCurrentSessionUseCase from './application/usecase/getCurrentSession';
import LoginUseCase from './application/usecase/login';
import LogoutUseCase from './application/usecase/logout';
import RefreshTokenUseCase from './application/usecase/refreshToken';
import RegisterUseCase from './application/usecase/register';
import { IAccountRepository } from './domain/interface';

export class AuthModuleAdapter implements IAuthModulePort {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getCurrentSessionUseCase: GetCurrentSessionUseCase,
    private readonly accountRepository: IAccountRepository
  ) {}

  register(dto: CreateAccountDTO): Promise<AuthSessionDTO> {
    return this.registerUseCase.execute(dto);
  }

  login(dto: CreateAccountDTO): Promise<AuthSessionDTO> {
    return this.loginUseCase.execute(dto);
  }

  refreshSession(refreshToken: string): Promise<AuthSessionDTO> {
    return this.refreshTokenUseCase.execute(refreshToken);
  }

  logout(refreshToken: string): Promise<void> {
    return this.logoutUseCase.execute(refreshToken);
  }

  getCurrentSession(userId: number): Promise<AuthSessionInfoDTO> {
    return this.getCurrentSessionUseCase.execute(userId);
  }

  async getAccountById(id: number): Promise<AuthAccountDTO | null> {
    const account = await this.accountRepository.findById(id);

    if (!account || account.getId() === null) {
      return null;
    }

    return {
      id: account.getId() as number,
      phoneNum: account.getPhoneNum().value,
      isLocked: account.getIsLocked(),
      createdDate: account.getCreatedDate(),
    };
  }
}
