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
}

export interface AuthSessionDTO {
  id: number;
  phoneNum: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseDTO {
  id: number;
  phoneNum: string;
  accessToken: string;
}

export interface AuthAccountDTO {
  id: number;
  phoneNum: string;
  isLocked: boolean;
  createdDate: Date | null;
}

export interface AuthSessionInfoDTO {
  id: number;
  phoneNum: string;
}
