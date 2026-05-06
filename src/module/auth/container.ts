// src/module/auth/container.ts
import { type DependencyContainer } from 'tsyringe';
import { AUTH_TOKENS } from './tokens';
import { TypeORMAccountRepository } from './infarstructure/repository';
import { RedisRefreshTokenStore } from './infarstructure/refreshTokenStore';
import { AuthModuleAdapter } from './module_adapter';
import RegisterUseCase from './application/usecase/register';
import LoginUseCase from './application/usecase/login';
import LockAccountUseCase from './application/usecase/lockAccount';
import UnlockAccountUseCase from './application/usecase/unlockAccount';
import ResetPasswordUseCase from './application/usecase/resetPassword';
import UpdateAccountUseCase from './application/usecase/updateAccount';

export function registerAuthDependencies(container: DependencyContainer): void {
  container.registerSingleton(AUTH_TOKENS.IAccountRepository, TypeORMAccountRepository);
  container.registerSingleton(AUTH_TOKENS.IRefreshTokenStore, RedisRefreshTokenStore);
  container.registerSingleton(AUTH_TOKENS.IAuthModulePort, AuthModuleAdapter);
  container.registerSingleton(AUTH_TOKENS.RegisterUseCase, RegisterUseCase);
  container.registerSingleton(AUTH_TOKENS.LoginUseCase, LoginUseCase);
  container.registerSingleton(AUTH_TOKENS.LockAccountUseCase, LockAccountUseCase);
  container.registerSingleton(AUTH_TOKENS.UnlockAccountUseCase, UnlockAccountUseCase);
  container.registerSingleton(AUTH_TOKENS.ResetPasswordUseCase, ResetPasswordUseCase);
  container.registerSingleton(AUTH_TOKENS.UpdateAccountUseCase, UpdateAccountUseCase);
}
