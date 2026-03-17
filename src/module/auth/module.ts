import { AppDataSource } from '@/config';
import { IAuthModulePort } from './application/module_port';
import LoginUseCase from './application/usecase/login';
import LogoutUseCase from './application/usecase/logout';
import RefreshTokenUseCase from './application/usecase/refreshToken';
import RegisterUseCase from './application/usecase/register';
import { RedisRefreshTokenStore } from './infarstructure/refreshTokenStore';
import { AccountEntity } from './infarstructure/accountEntity';
import { TypeORMAccountRepository } from './infarstructure/repository';
import { AuthModuleAdapter } from './module_adapter';
import { AuthController } from './presentation/controller';
import { createAuthRouter } from './presentation/router';
import GetCurrentSessionUseCase from './application/usecase/getCurrentSession';

export class AuthModule {
  public readonly router;
  public readonly publicApi: IAuthModulePort;

  constructor() {
    const accountRepository = new TypeORMAccountRepository(
      AppDataSource.getRepository(AccountEntity)
    );
    const refreshTokenStore = new RedisRefreshTokenStore();

    const registerUseCase = new RegisterUseCase(accountRepository, refreshTokenStore);
    const loginUseCase = new LoginUseCase(accountRepository, refreshTokenStore);
    const refreshTokenUseCase = new RefreshTokenUseCase(accountRepository, refreshTokenStore);
    const logoutUseCase = new LogoutUseCase(refreshTokenStore);
    const getCurrentSession = new GetCurrentSessionUseCase(accountRepository);

    this.publicApi = new AuthModuleAdapter(
      registerUseCase,
      loginUseCase,
      refreshTokenUseCase,
      logoutUseCase,
      getCurrentSession,
      accountRepository
    );

    const controller = new AuthController(this.publicApi);
    this.router = createAuthRouter(controller);
  }
}

export const authModule = new AuthModule();
export const authPublicApi = authModule.publicApi;
