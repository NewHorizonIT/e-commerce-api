import { Router } from 'express';
import authenticate from '@/shared/middleware/authenticate';
import authorizeRole from '@/shared/middleware/authorizeRole';
import { UserController } from './controller';
import {
  addressIdParamSchema,
  createShippingAddressSchema,
  updateShippingAddressSchema,
  upsertPersonalInformationSchema,
  validateRequest,
  accountIdParamSchema,
  adminCreatePersonalInformationSchema,
  adminUpdatePersonalInformationSchema,
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

  // Admin endpoints
  userRouter.get(
    '/admin/users/:accountId',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: accountIdParamSchema }),
    controller.getAdminUserProfile.bind(controller)
  );

  userRouter.post(
    '/admin/users',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ body: adminCreatePersonalInformationSchema }),
    controller.adminCreatePersonalInformation.bind(controller)
  );

  userRouter.patch(
    '/admin/users/personal-information',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ body: adminUpdatePersonalInformationSchema }),
    controller.adminUpdatePersonalInformation.bind(controller)
  );

  return userRouter;
}
