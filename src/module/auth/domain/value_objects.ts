// Define value objects here

import { InvalidPhoneNumberError } from './errors';

/*
  Example:

  export class Email {
    constructor(public value: string) {
      if (!this.validateEmail(value)) {
        throw new Error('Invalid email format');
      }
    }

    private validateEmail(email: string): boolean {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  }
*/

export class PhoneNumber {
  constructor(public value: string) {
    this.value = value.trim();

    if (!this.validatePhoneNumber(this.value)) {
      throw new InvalidPhoneNumberError(this.value);
    }
  }

  private validatePhoneNumber(phoneNum: string): boolean {
    const re = /^\d{10,15}$/;
    return re.test(phoneNum);
  }
}
