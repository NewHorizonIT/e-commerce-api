import { inject, injectable } from 'tsyringe';
import { IUserModulePort } from './application/module_port';
import { USER_TOKENS } from './tokens';
import GetCurrentProfileUseCase from './application/usecase/getCurrentProfile';
import UpsertPersonalInformationUseCase from './application/usecase/upsertPersonalInformation';
import ListShippingAddressesUseCase from './application/usecase/listShippingAddresses';
import CreateShippingAddressUseCase from './application/usecase/createShippingAddress';
import UpdateShippingAddressUseCase from './application/usecase/updateShippingAddress';
import DeleteShippingAddressUseCase from './application/usecase/deleteShippingAddress';
import AdminCreatePersonalInformationUseCase from './application/usecase/adminCreatePersonalInformation';
import AdminUpdatePersonalInformationUseCase from './application/usecase/adminUpdatePersonalInformation';
import {
  CreateShippingAddressDTO,
  PersonalInformationDTO,
  ShippingAddressDTO,
  UpdateShippingAddressDTO,
  UpsertPersonalInformationDTO,
  UserProfileDTO,
  AdminCreatePersonalInformationDTO,
  AdminUpdatePersonalInformationDTO,
  AdminUserProfileDTO,
} from './application/dtos';

@injectable()
export class UserModuleAdapter implements IUserModulePort {
  constructor(
    @inject(GetCurrentProfileUseCase)
    private readonly getCurrentProfileUseCase: GetCurrentProfileUseCase,
    @inject(UpsertPersonalInformationUseCase)
    private readonly upsertPersonalInformationUseCase: UpsertPersonalInformationUseCase,
    @inject(ListShippingAddressesUseCase)
    private readonly listShippingAddressesUseCase: ListShippingAddressesUseCase,
    @inject(CreateShippingAddressUseCase)
    private readonly createShippingAddressUseCase: CreateShippingAddressUseCase,
    @inject(UpdateShippingAddressUseCase)
    private readonly updateShippingAddressUseCase: UpdateShippingAddressUseCase,
    @inject(DeleteShippingAddressUseCase)
    private readonly deleteShippingAddressUseCase: DeleteShippingAddressUseCase,
    @inject(AdminCreatePersonalInformationUseCase)
    private readonly adminCreatePersonalInformationUseCase: AdminCreatePersonalInformationUseCase,
    @inject(AdminUpdatePersonalInformationUseCase)
    private readonly adminUpdatePersonalInformationUseCase: AdminUpdatePersonalInformationUseCase
  ) {}

  getCurrentProfile(accountId: number): Promise<UserProfileDTO> {
    return this.getCurrentProfileUseCase.execute(accountId);
  }

  upsertPersonalInformation(
    accountId: number,
    dto: UpsertPersonalInformationDTO
  ): Promise<PersonalInformationDTO> {
    return this.upsertPersonalInformationUseCase.execute(accountId, dto);
  }

  listShippingAddresses(accountId: number): Promise<ShippingAddressDTO[]> {
    return this.listShippingAddressesUseCase.execute(accountId);
  }

  createShippingAddress(
    accountId: number,
    dto: CreateShippingAddressDTO
  ): Promise<ShippingAddressDTO> {
    return this.createShippingAddressUseCase.execute(accountId, dto);
  }

  updateShippingAddress(
    accountId: number,
    addressId: number,
    dto: UpdateShippingAddressDTO
  ): Promise<ShippingAddressDTO> {
    return this.updateShippingAddressUseCase.execute(accountId, addressId, dto);
  }

  deleteShippingAddress(accountId: number, addressId: number): Promise<void> {
    return this.deleteShippingAddressUseCase.execute(accountId, addressId);
  }

  async getAdminUserProfile(accountId: number): Promise<AdminUserProfileDTO> {
    return this.getCurrentProfileUseCase.execute(accountId);
  }

  adminCreatePersonalInformation(
    dto: AdminCreatePersonalInformationDTO
  ): Promise<PersonalInformationDTO> {
    return this.adminCreatePersonalInformationUseCase.execute(dto);
  }

  adminUpdatePersonalInformation(
    dto: AdminUpdatePersonalInformationDTO
  ): Promise<PersonalInformationDTO> {
    return this.adminUpdatePersonalInformationUseCase.execute(dto);
  }
}
