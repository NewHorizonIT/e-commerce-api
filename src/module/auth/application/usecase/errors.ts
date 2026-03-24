import { AppError } from '@/shared/error/error';

export class NotFoundAccountError extends AppError {
  constructor(identifier: string) {
    super(`Account ${identifier} not found`, 'NOT_FOUND_ACCOUNT', 404);
  }
}

export class AccountIsLockedError extends AppError {
  constructor(phoneNum: string) {
    super(`Account with phone number ${phoneNum} is locked`, 'ACCOUNT_IS_LOCKED', 403);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid phone number or password', 'INVALID_CREDENTIALS', 401);
  }
}

export class PhoneNumberAlreadyExistsError extends AppError {
  constructor(phoneNum: string) {
    super(`Phone number ${phoneNum} is already registered`, 'PHONE_NUMBER_ALREADY_EXISTS', 409);
  }
}

export class NotFoundAccountErrorById extends AppError {
  constructor(id: number) {
    super(`Account with ID ${id} not found`, 'NOT_FOUND_ACCOUNT_BY_ID', 404);
  }
}
