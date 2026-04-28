export const AUTH_TOKENS = {
  IAccountRepository: 'IAccountRepository',
  IRefreshTokenStore: 'IRefreshTokenStore',
  IAuthModulePort: 'IAuthModulePort',

  RegisterUseCase: 'RegisterUseCase',
  LoginUseCase: 'LoginUseCase',
  RefreshTokenUseCase: 'RefreshTokenUseCase',
  LogoutUseCase: 'LogoutUseCase',
  GetCurrentSessionUseCase: 'GetCurrentSessionUseCase',
} as const;
