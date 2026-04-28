import { BadRequestError } from '@/shared/error/error';

export class InvalidDiscountIdError extends BadRequestError {
  constructor() {
    super('Invalid discount ID');
  }
}

export class MissingDiscountIdError extends BadRequestError {
  constructor() {
    super('Discount ID is required');
  }
}

export class InvalidDiscountNameError extends BadRequestError {
  constructor() {
    super('Invalid discount name');
  }
}

export class InvalidDiscountCodeError extends BadRequestError {
  constructor() {
    super('Invalid discount code');
  }
}

export class InvalidDiscountTypeError extends BadRequestError {
  constructor() {
    super('Invalid discount type. Must be "fixed" or "percentage"');
  }
}

export class InvalidDiscountValueError extends BadRequestError {
  constructor() {
    super('Discount value must be greater than 0');
  }
}

export class InvalidMinimumOrderValueError extends BadRequestError {
  constructor() {
    super('Minimum order value must be non-negative');
  }
}

export class InvalidMaximumDiscountError extends BadRequestError {
  constructor() {
    super('Maximum discount must be greater than 0');
  }
}

export class InvalidMaximumUsageError extends BadRequestError {
  constructor() {
    super('Maximum usage must be greater than 0');
  }
}

export class InvalidTimeRangeError extends BadRequestError {
  constructor() {
    super('Start time must be before end time');
  }
}

export class DiscountExpiredError extends BadRequestError {
  constructor() {
    super('This discount code has expired');
  }
}

export class DiscountNotActiveError extends BadRequestError {
  constructor() {
    super('This discount code is not active');
  }
}

export class DiscountNotStartedError extends BadRequestError {
  constructor() {
    super('This discount code has not started yet');
  }
}

export class DiscountUsageLimitExceededError extends BadRequestError {
  constructor() {
    super('This discount code has reached its maximum usage limit');
  }
}

export class DiscountNotFoundError extends BadRequestError {
  constructor() {
    super('Discount not found');
  }
}
