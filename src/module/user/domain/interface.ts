import { PersonalInformation, ShippingAddress, UserProfile } from './domain';

export interface IUserRepository {
  findProfileByAccountId(accountId: number): Promise<UserProfile>;
  findPersonalInformationByAccountId(accountId: number): Promise<PersonalInformation | null>;
  savePersonalInformation(personalInformation: PersonalInformation): Promise<PersonalInformation>;
  listShippingAddresses(accountId: number): Promise<ShippingAddress[]>;
  findShippingAddressById(
    accountId: number,
    addressId: number
  ): Promise<ShippingAddress | null>;
  saveShippingAddress(shippingAddress: ShippingAddress): Promise<ShippingAddress>;
  deleteShippingAddress(accountId: number, addressId: number): Promise<boolean>;
}