import { NotFoundError } from '@/shared/error/error';

export class ShippingAddressNotFoundError extends NotFoundError {
  constructor(accountId: number, addressId: number) {
    super('Shipping address not found', {
      accountId,
      addressId,
      code: 'USER_SHIPPING_ADDRESS_NOT_FOUND',
    });
  }
}

export class NotFoundAccountError extends NotFoundError {
  constructor(accountId: number) {
    super('Account not found', {
      accountId,
      code: 'USER_ACCOUNT_NOT_FOUND',
    });
  }
}
