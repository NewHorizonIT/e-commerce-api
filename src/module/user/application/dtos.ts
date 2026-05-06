export interface PersonalInformationDTO {
  id: number;
  accountId: number;
  name: string;
  avatarUrl: string | null;
  gender: boolean | null;
  birth: Date | null;
}

export interface ShippingAddressDTO {
  id: number;
  accountId: number;
  isDefault: boolean;
  streetAddress: string;
  ward: string;
  province: string;
  receiverName: string;
  receiverPhone: string;
}

export interface UserProfileDTO {
  accountId: number;
  personalInformation: PersonalInformationDTO | null;
  shippingAddresses: ShippingAddressDTO[];
}

export interface UpsertPersonalInformationDTO {
  name: string;
  avatarUrl?: string | null;
  gender?: boolean | null;
  birth?: Date | null;
}

export interface CreateShippingAddressDTO {
  isDefault?: boolean;
  streetAddress: string;
  ward: string;
  province: string;
  receiverName: string;
  receiverPhone: string;
}

export interface UpdateShippingAddressDTO {
  isDefault?: boolean;
  streetAddress?: string;
  ward?: string;
  province?: string;
  receiverName?: string;
  receiverPhone?: string;
}

export interface AdminCreatePersonalInformationDTO {
  accountId: number;
  name: string;
  avatarUrl?: string | null;
  gender?: boolean | null;
  birth?: Date | null;
}

export interface AdminUpdatePersonalInformationDTO {
  accountId: number;
  name?: string;
  avatarUrl?: string | null;
  gender?: boolean | null;
  birth?: Date | null;
}

export interface AdminUserProfileDTO {
  accountId: number;
  personalInformation: PersonalInformationDTO | null;
  shippingAddresses: ShippingAddressDTO[];
}