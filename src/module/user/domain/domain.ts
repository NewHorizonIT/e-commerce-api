import { normalizeOptionalText } from './value_objects';

export class PersonalInformation {
  private constructor(
    private id: number | null,
    private accountId: number,
    private name: string,
    private avatarUrl: string | null,
    private gender: boolean | null,
    private birth: Date | null
  ) {}

  public static create(params: {
    accountId: number;
    name: string;
    avatarUrl?: string | null;
    gender?: boolean | null;
    birth?: Date | null;
  }): PersonalInformation {
    return new PersonalInformation(
      null,
      params.accountId,
      params.name.trim(),
      normalizeOptionalText(params.avatarUrl),
      params.gender ?? null,
      params.birth ?? null
    );
  }

  public static rehydrate(params: {
    id: number;
    accountId: number;
    name: string;
    avatarUrl: string | null;
    gender: boolean | null;
    birth: Date | null;
  }): PersonalInformation {
    return new PersonalInformation(
      params.id,
      params.accountId,
      params.name.trim(),
      normalizeOptionalText(params.avatarUrl),
      params.gender,
      params.birth
    );
  }

  public update(params: {
    name?: string;
    avatarUrl?: string | null;
    gender?: boolean | null;
    birth?: Date | null;
  }): void {
    if (params.name !== undefined) {
      this.name = params.name.trim();
    }

    if (params.avatarUrl !== undefined) {
      this.avatarUrl = normalizeOptionalText(params.avatarUrl);
    }

    if (params.gender !== undefined) {
      this.gender = params.gender;
    }

    if (params.birth !== undefined) {
      this.birth = params.birth;
    }
  }

  public getId(): number | null {
    return this.id;
  }

  public getRequiredId(): number {
    if (this.id === null) {
      throw new Error('Missing personal information id');
    }

    return this.id;
  }

  public getAccountId(): number {
    return this.accountId;
  }

  public getName(): string {
    return this.name;
  }

  public getAvatarUrl(): string | null {
    return this.avatarUrl;
  }

  public getGender(): boolean | null {
    return this.gender;
  }

  public getBirth(): Date | null {
    return this.birth;
  }
}

export class ShippingAddress {
  private constructor(
    private id: number | null,
    private accountId: number,
    private isDefault: boolean,
    private streetAddress: string,
    private ward: string,
    private province: string,
    private receiverName: string,
    private receiverPhone: string
  ) {}

  public static create(params: {
    accountId: number;
    isDefault?: boolean;
    streetAddress: string;
    ward: string;
    province: string;
    receiverName: string;
    receiverPhone: string;
  }): ShippingAddress {
    return new ShippingAddress(
      null,
      params.accountId,
      params.isDefault ?? false,
      params.streetAddress.trim(),
      params.ward.trim(),
      params.province.trim(),
      params.receiverName.trim(),
      params.receiverPhone.trim()
    );
  }

  public static rehydrate(params: {
    id: number;
    accountId: number;
    isDefault: boolean;
    streetAddress: string;
    ward: string;
    province: string;
    receiverName: string;
    receiverPhone: string;
  }): ShippingAddress {
    return new ShippingAddress(
      params.id,
      params.accountId,
      params.isDefault,
      params.streetAddress.trim(),
      params.ward.trim(),
      params.province.trim(),
      params.receiverName.trim(),
      params.receiverPhone.trim()
    );
  }

  public update(params: {
    isDefault?: boolean;
    streetAddress?: string;
    ward?: string;
    province?: string;
    receiverName?: string;
    receiverPhone?: string;
  }): void {
    if (params.isDefault !== undefined) {
      this.isDefault = params.isDefault;
    }

    if (params.streetAddress !== undefined) {
      this.streetAddress = params.streetAddress.trim();
    }

    if (params.ward !== undefined) {
      this.ward = params.ward.trim();
    }

    if (params.province !== undefined) {
      this.province = params.province.trim();
    }

    if (params.receiverName !== undefined) {
      this.receiverName = params.receiverName.trim();
    }

    if (params.receiverPhone !== undefined) {
      this.receiverPhone = params.receiverPhone.trim();
    }
  }

  public getId(): number | null {
    return this.id;
  }

  public getRequiredId(): number {
    if (this.id === null) {
      throw new Error('Missing shipping address id');
    }

    return this.id;
  }

  public getAccountId(): number {
    return this.accountId;
  }

  public getIsDefault(): boolean {
    return this.isDefault;
  }

  public getStreetAddress(): string {
    return this.streetAddress;
  }

  public getWard(): string {
    return this.ward;
  }

  public getProvince(): string {
    return this.province;
  }

  public getReceiverName(): string {
    return this.receiverName;
  }

  public getReceiverPhone(): string {
    return this.receiverPhone;
  }
}

export class UserProfile {
  private constructor(
    private accountId: number,
    private personalInformation: PersonalInformation | null,
    private shippingAddresses: ShippingAddress[]
  ) {}

  public static rehydrate(params: {
    accountId: number;
    personalInformation: PersonalInformation | null;
    shippingAddresses: ShippingAddress[];
  }): UserProfile {
    return new UserProfile(params.accountId, params.personalInformation, params.shippingAddresses);
  }

  public getAccountId(): number {
    return this.accountId;
  }

  public getPersonalInformation(): PersonalInformation | null {
    return this.personalInformation;
  }

  public getShippingAddresses(): ShippingAddress[] {
    return this.shippingAddresses;
  }
}