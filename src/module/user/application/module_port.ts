import {
  CreateShippingAddressDTO,
  PersonalInformationDTO,
  ShippingAddressDTO,
  UpsertPersonalInformationDTO,
  UpdateShippingAddressDTO,
  UserProfileDTO,
} from './dtos';

export interface IUserModulePort {
  getCurrentProfile(accountId: number): Promise<UserProfileDTO>;
  upsertPersonalInformation(
    accountId: number,
    dto: UpsertPersonalInformationDTO
  ): Promise<PersonalInformationDTO>;
  listShippingAddresses(accountId: number): Promise<ShippingAddressDTO[]>;
  createShippingAddress(
    accountId: number,
    dto: CreateShippingAddressDTO
  ): Promise<ShippingAddressDTO>;
  updateShippingAddress(
    accountId: number,
    addressId: number,
    dto: UpdateShippingAddressDTO
  ): Promise<ShippingAddressDTO>;
  deleteShippingAddress(accountId: number, addressId: number): Promise<void>;
}