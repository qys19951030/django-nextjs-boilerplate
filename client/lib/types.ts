export interface User {
  id: number;
  email: string;
  username: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  re_password?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface ApiError {
  detail?: string;
  email?: string[];
  username?: string[];
  password?: string[];
  non_field_errors?: string[];
  [key: string]: string | string[] | undefined;
}
