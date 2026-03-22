// src/module/auth/container.ts
import { type DependencyContainer } from 'tsyringe';
import { AUTH_TOKENS } from './tokens';
import { TypeORMAccountRepository } from './infarstructure/repository';
import { RedisRefreshTokenStore } from './infarstructure/refreshTokenStore';
import { AuthModuleAdapter } from './module_adapter';

export function registerAuthDependencies(container: DependencyContainer): void {
  container.registerSingleton(AUTH_TOKENS.IAccountRepository, TypeORMAccountRepository);
  container.registerSingleton(AUTH_TOKENS.IRefreshTokenStore, RedisRefreshTokenStore);
  container.registerSingleton(AUTH_TOKENS.IAuthModulePort, AuthModuleAdapter);
}
