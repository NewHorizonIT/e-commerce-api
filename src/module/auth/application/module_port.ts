// Define interface for method of port

import { AuthAccountDTO, AuthSessionDTO, AuthSessionInfoDTO, CreateAccountDTO } from './dtos';

export interface IRefreshTokenStore {
  save(accountId: number, refreshToken: string): Promise<void>;
  get(accountId: number): Promise<string | null>;
  delete(accountId: number): Promise<void>;
}

export interface IAuthModulePort {
  register(dto: CreateAccountDTO): Promise<AuthSessionDTO>;
  login(dto: CreateAccountDTO): Promise<AuthSessionDTO>;
  refreshSession(refreshToken: string): Promise<AuthSessionDTO>;
  logout(refreshToken: string): Promise<void>;
  getAccountById(id: number): Promise<AuthAccountDTO | null>;
  getCurrentSession(userId: number): Promise<AuthSessionInfoDTO>;
}
