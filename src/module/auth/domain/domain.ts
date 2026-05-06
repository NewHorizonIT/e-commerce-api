// Define domain entitis and behaviors here

import { WeakPasswordError } from './errors';
import { PhoneNumber } from './value_objects';

/*
  Example:

  export class User {
    constructor(public id: string, public name: string) {}

    changeName(newName: string) {
      this.name = newName;
    }
  }
*/

/* 
  Account{
      id int [pk, increment]
      phone_num varchar(15)
      password varchar(255)
      created_date date
      is_locked boolean
  }
*/
class Account {
  private constructor(
    private id: number | null,
    private phoneNum: PhoneNumber,
    private password: string,
    private createdDate: Date | null,
    private isLocked: boolean,
    private role: 'admin' | 'user'
  ) {}

  public static create(params: {
    phoneNum: PhoneNumber;
    passwordHash: string;
    role?: 'admin' | 'user';
  }): Account {
    return new Account(
      null,
      params.phoneNum,
      params.passwordHash,
      null,
      false,
      params.role ?? 'user'
    );
  }

  public static rehydrate(params: {
    id: number;
    phoneNum: PhoneNumber;
    passwordHash: string;
    createdDate: Date;
    isLocked: boolean;
    role: 'admin' | 'user';
  }): Account {
    return new Account(
      params.id,
      params.phoneNum,
      params.passwordHash,
      params.createdDate,
      params.isLocked,
      params.role
    );
  }

  public static ensurePasswordStrength(password: string): void {
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      throw new WeakPasswordError();
    }
  }

  public lockAccount() {
    this.isLocked = true;
  }

  public unlockAccount() {
    this.isLocked = false;
  }

  public updatePassword(passwordHash: string): void {
    this.password = passwordHash;
  }

  public setRole(role: 'admin' | 'user'): void {
    this.role = role;
  }

  // Getters and setters
  public getId(): number | null {
    return this.id;
  }
  public getPhoneNum(): PhoneNumber {
    return this.phoneNum;
  }
  public getPassword(): string {
    return this.password;
  }
  public getCreatedDate(): Date | null {
    return this.createdDate;
  }
  public getIsLocked(): boolean {
    return this.isLocked;
  }
  public getRole(): 'admin' | 'user' {
    return this.role;
  }
}

export default Account;
