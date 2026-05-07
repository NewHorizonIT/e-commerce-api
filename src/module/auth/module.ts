import 'reflect-metadata';
import { container } from 'tsyringe';
import { IAuthModulePort } from './application/module_port';
import { registerAuthDependencies } from './container';
import { AuthController } from './presentation/controller';
import { createAuthRouter } from './presentation/router';
import { AUTH_TOKENS } from './tokens';

export class AuthModule {
  public readonly router;
  public readonly publicApi: IAuthModulePort;

  constructor() {
    registerAuthDependencies(container);
    this.publicApi = container.resolve<IAuthModulePort>(AUTH_TOKENS.IAuthModulePort);
    const controller = container.resolve(AuthController);
    this.router = createAuthRouter(controller);
  }
}

export const authModule = new AuthModule();
export const authPublicApi = authModule.publicApi;
