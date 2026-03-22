import { container } from 'tsyringe';
import { IAuthModulePort } from './application/module_port';
import { AuthController } from './presentation/controller';
import { createAuthRouter } from './presentation/router';
import { AUTH_TOKENS } from './tokens';
import './container';

export class AuthModule {
  public readonly router;
  public readonly publicApi: IAuthModulePort;

  constructor() {
    this.publicApi = container.resolve<IAuthModulePort>(AUTH_TOKENS.IAuthModulePort);
    const controller = container.resolve(AuthController);
    this.router = createAuthRouter(controller);
  }
}

export const authModule = new AuthModule();
export const authPublicApi = authModule.publicApi;
