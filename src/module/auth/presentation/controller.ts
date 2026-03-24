import type { CookieOptions, Request, Response } from 'express';
import { config } from '@/config';
import { appLogger } from '@/shared/logging/appLogger';
import { AuthResponseDTO } from '../application/dtos';
import { IAuthModulePort } from '../application/module_port';
import SuccessResponse from '@/shared/response/writeResponse';
import { StatusCode } from '@/shared/response/statusCode';

function parseDurationToMilliseconds(value: string): number {
  const match = value.trim().match(/^(\d+)([smhd])$/i);

  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60 * 1000;
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}

export class AuthController {
  constructor(private readonly authModulePort: IAuthModulePort) {}

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
    new SuccessResponse(session, 'Account created successfully', StatusCode.CREATED).send(res);
  }

  async login(req: Request, res: Response): Promise<void> {
    const session = await this.authModulePort.login(req.body);

    res.cookie('refreshToken', session.refreshToken, this.buildRefreshCookieOptions());
    appLogger.info('Auth login endpoint served', { accountId: session.id });
    res.status(200).json({
      status: 'success',
      data: this.createResponsePayload(session),
    });
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const session = await this.authModulePort.refreshSession(req.cookies.refreshToken);

    res.cookie('refreshToken', session.refreshToken, this.buildRefreshCookieOptions());
    appLogger.info('Auth refresh endpoint served', { accountId: session.id });
    res.status(200).json({
      status: 'success',
      data: this.createResponsePayload(session),
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    await this.authModulePort.logout(req.cookies.refreshToken);

    res.clearCookie('refreshToken', this.buildRefreshCookieOptions());
    appLogger.info('Auth logout endpoint served');
    res.status(204).send();
  }

  async getCurrentSession(req: Request, res: Response): Promise<void> {
    const session = await this.authModulePort.getCurrentSession(req.userId!);
    res.status(200).json({
      status: 'success',
      data: this.createResponsePayload(session),
    });
  }
}
