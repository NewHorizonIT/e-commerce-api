import { type DependencyContainer } from 'tsyringe';
import { USER_TOKENS } from './tokens';
import { TypeORMUserRepository } from './infrastructure/repository';
import { UserModuleAdapter } from './module_adapter';

export function registerUserDependencies(container: DependencyContainer): void {
  container.registerSingleton(USER_TOKENS.IUserRepository, TypeORMUserRepository);
  container.registerSingleton(USER_TOKENS.IUserModulePort, UserModuleAdapter);
}
