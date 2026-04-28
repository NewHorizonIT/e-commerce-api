import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { appLogger } from '@/shared/logging/appLogger';
import SuccessResponse from '@/shared/response/writeResponse';
import { StatusCode } from '@/shared/response/statusCode';
import { IUserModulePort } from '../application/module_port';
import { USER_TOKENS } from '../tokens';

@injectable()
export class UserController {
  constructor(
    @inject(USER_TOKENS.IUserModulePort) private readonly userModulePort: IUserModulePort
  ) {}

  async getCurrentProfile(req: Request, res: Response): Promise<void> {
    const profile = await this.userModulePort.getCurrentProfile(req.userId!);
    new SuccessResponse(profile, undefined, StatusCode.OK).send(res);
  }

  async upsertPersonalInformation(req: Request, res: Response): Promise<void> {
    const personalInformation = await this.userModulePort.upsertPersonalInformation(
      req.userId!,
      req.body
    );

    appLogger.info('User personal information updated', {
      accountId: req.userId,
      personalInformationId: personalInformation.id,
    });

    new SuccessResponse(
      personalInformation,
      'Personal information saved successfully',
      StatusCode.OK
    ).send(res);
  }

  async listShippingAddresses(req: Request, res: Response): Promise<void> {
    const shippingAddresses = await this.userModulePort.listShippingAddresses(req.userId!);
    new SuccessResponse(shippingAddresses, undefined, StatusCode.OK).send(res);
  }

  async createShippingAddress(req: Request, res: Response): Promise<void> {
    const shippingAddress = await this.userModulePort.createShippingAddress(req.userId!, req.body);

    appLogger.info('User shipping address created', {
      accountId: req.userId,
      shippingAddressId: shippingAddress.id,
    });

    new SuccessResponse(
      shippingAddress,
      'Shipping address created successfully',
      StatusCode.CREATED
    ).send(res);
  }

  async updateShippingAddress(req: Request, res: Response): Promise<void> {
    const { addressId } = req.params as { addressId: string };
    const shippingAddress = await this.userModulePort.updateShippingAddress(
      req.userId!,
      Number(addressId),
      req.body
    );

    appLogger.info('User shipping address updated', {
      accountId: req.userId,
      shippingAddressId: shippingAddress.id,
    });

    new SuccessResponse(
      shippingAddress,
      'Shipping address updated successfully',
      StatusCode.OK
    ).send(res);
  }

  async deleteShippingAddress(req: Request, res: Response): Promise<void> {
    const { addressId } = req.params as { addressId: string };
    await this.userModulePort.deleteShippingAddress(req.userId!, Number(addressId));

    appLogger.info('User shipping address deleted', {
      accountId: req.userId,
      shippingAddressId: Number(addressId),
    });

    res.status(204).send();
  }
}
