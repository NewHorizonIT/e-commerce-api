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
