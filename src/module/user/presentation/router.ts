import { Router } from 'express';
import authenticate from '@/shared/middleware/authenticate';
import { UserController } from './controller';
import {
  addressIdParamSchema,
  createShippingAddressSchema,
  updateShippingAddressSchema,
  upsertPersonalInformationSchema,
  validateRequest,
} from './validate';

export function createUserRouter(controller: UserController): Router {
  const userRouter = Router();

  userRouter.get('/users/me', authenticate, controller.getCurrentProfile.bind(controller));
  userRouter.put(
    '/users/me/personal-information',
    authenticate,
    validateRequest({ body: upsertPersonalInformationSchema }),
    controller.upsertPersonalInformation.bind(controller)
  );
  userRouter.get(
    '/users/me/addresses',
    authenticate,
    controller.listShippingAddresses.bind(controller)
  );
  userRouter.post(
    '/users/me/addresses',
    authenticate,
    validateRequest({ body: createShippingAddressSchema }),
    controller.createShippingAddress.bind(controller)
  );
  userRouter.patch(
    '/users/me/addresses/:addressId',
    authenticate,
    validateRequest({ params: addressIdParamSchema, body: updateShippingAddressSchema }),
    controller.updateShippingAddress.bind(controller)
  );
  userRouter.delete(
    '/users/me/addresses/:addressId',
    authenticate,
    validateRequest({ params: addressIdParamSchema }),
    controller.deleteShippingAddress.bind(controller)
  );

  return userRouter;
}
