// Define dtos
/*
  Example:

  export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
  }
*/

export interface CreateAccountDTO {
  phoneNum: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface PaginationQueryDTO {
  page: number;
  limit: number;
}

export interface AuthSessionDTO {
  id: number;
  phoneNum: string;
  accessToken: string;
  refreshToken: string;
  role: 'admin' | 'user';
}

export interface AuthResponseDTO {
  id: number;
  phoneNum: string;
  accessToken: string;
  role: 'admin' | 'user';
}

export interface AuthAccountDTO {
  id: number;
  phoneNum: string;
  isLocked: boolean;
  createdDate: Date | null;
  role: 'admin' | 'user';
}

export interface AuthSessionInfoDTO {
  id: number;
  phoneNum: string;
  role: 'admin' | 'user';
}

export interface LockUnlockAccountDTO {
  accountId: number;
  isLocked: boolean;
}

export interface ResetPasswordDTO {
  accountId: number;
}

export interface UpdateAccountDTO {
  accountId: number;
  phoneNum?: string;
  password?: string;
  role?: 'admin' | 'user';
}

export interface AdminAccountResponseDTO {
  id: number;
  phoneNum: string;
  role: 'admin' | 'user';
  isLocked: boolean;
  createdDate: Date | null;
}

export interface AccountListQueryDTO extends PaginationQueryDTO {}

export interface PaginatedAdminAccountsDTO {
  items: AdminAccountResponseDTO[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
