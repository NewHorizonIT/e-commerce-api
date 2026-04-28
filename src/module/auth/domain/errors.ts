// Domain errors for the Auth module.
//
// Rules:
//  1. Extend AppError — never extend raw Error.
//  2. Each class owns its semantic ERROR CODE (AUTH_*) and HTTP status.
//  3. Keep constructors lean: accept only domain-meaningful params,
//     NOT a generic `message` or `code` from the caller.
//  4. Optional `cause` is for wrapping an upstream error (infra, external lib).

import { AppError } from '@/shared/error/error';

export class InvalidPhoneNumberError extends AppError {
  constructor(phone: string) {
    super(`Phone number "${phone}" is not valid.`, 'AUTH_INVALID_PHONE', 400);
  }
}

export class WeakPasswordError extends AppError {
  constructor() {
    super(
      'Password must be at least 8 characters and include letters and numbers.',
      'AUTH_WEAK_PASSWORD',
      400
    );
  }
}

export class AccountLockedError extends AppError {
  constructor(email: string) {
    super(`Account "${email}" is locked. Please contact support.`, 'AUTH_ACCOUNT_LOCKED', 403);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Email or password is incorrect.', 'AUTH_INVALID_CREDENTIALS', 401);
  }
}

export class EmailAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(`Email "${email}" is already registered.`, 'AUTH_EMAIL_EXISTS', 409);
  }
}

export class SessionExpiredError extends AppError {
  constructor() {
    super('Your session has expired. Please log in again.', 'AUTH_SESSION_EXPIRED', 401);
  }
}
