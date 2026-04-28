import { container, type DependencyContainer } from 'tsyringe';
import { Router } from 'express';
import { IUserModulePort } from './application/module_port';
import { USER_TOKENS } from './tokens';
import { UserController } from './presentation/controller';
import { createUserRouter } from './presentation/router';

export class UserModule {
  public readonly router: Router;
  public readonly publicApi: IUserModulePort;

  constructor(c: DependencyContainer = container) {
    this.publicApi = c.resolve<IUserModulePort>(USER_TOKENS.IUserModulePort);
    const controller = c.resolve(UserController);
    this.router = createUserRouter(controller);
  }
}

export const userModule = new UserModule();
export const userPublicApi = userModule.publicApi;
