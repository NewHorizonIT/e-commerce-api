import type { CookieOptions, Request, Response } from 'express';
import { config } from '@/config';
import { appLogger } from '@/shared/logging/appLogger';
import { AuthResponseDTO } from '../application/dtos';
import { IAuthModulePort } from '../application/module_port';
import SuccessResponse from '@/shared/response/writeResponse';
import { StatusCode } from '@/shared/response/statusCode';
import { parseDurationToMilliseconds } from '@/shared/utils/duration';
import { inject, injectable } from 'tsyringe';
import { AUTH_TOKENS } from '../tokens';

@injectable()
export class AuthController {
  constructor(
    @inject(AUTH_TOKENS.IAuthModulePort) private readonly authModulePort: IAuthModulePort
  ) {}

  private buildRefreshCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: config.app.isProduction,
      sameSite: 'lax',
      maxAge: parseDurationToMilliseconds(config.jwt.refreshToken.expiresIn),
      path: '/',
    };
  }

  private createResponsePayload(data: {
    id: number;
    phoneNum: string;
    accessToken: string;
  }): AuthResponseDTO {
    return {
      id: data.id,
      phoneNum: data.phoneNum,
      accessToken: data.accessToken,
    };
  }

  async register(req: Request, res: Response): Promise<void> {
    const session = await this.authModulePort.register(req.body);

    res.cookie('refreshToken', session.refreshToken, this.buildRefreshCookieOptions());
    appLogger.info('Auth register endpoint served', { accountId: session.id });
    new SuccessResponse(
      this.createResponsePayload(session),
      'Account created successfully',
      StatusCode.CREATED
    ).send(res);
  }

  async login(req: Request, res: Response): Promise<void> {
    const session = await this.authModulePort.login(req.body);

    res.cookie('refreshToken', session.refreshToken, this.buildRefreshCookieOptions());
    appLogger.info('Auth login endpoint served', { accountId: session.id });
    new SuccessResponse(this.createResponsePayload(session), undefined, StatusCode.OK).send(res);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const session = await this.authModulePort.refreshSession(req.cookies.refreshToken);

    res.cookie('refreshToken', session.refreshToken, this.buildRefreshCookieOptions());
    appLogger.info('Auth refresh endpoint served', { accountId: session.id });
    new SuccessResponse(this.createResponsePayload(session), undefined, StatusCode.OK).send(res);
  }

  async logout(req: Request, res: Response): Promise<void> {
    await this.authModulePort.logout(req.cookies.refreshToken);

    res.clearCookie('refreshToken', this.buildRefreshCookieOptions());
    appLogger.info('Auth logout endpoint served');
    res.status(204).send();
  }

  async getCurrentSession(req: Request, res: Response): Promise<void> {
    const session = await this.authModulePort.getCurrentSession(req.userId!);
    new SuccessResponse(session, undefined, StatusCode.OK).send(res);
  }
}
