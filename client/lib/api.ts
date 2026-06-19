import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiError, LoginData, RegisterData, TokenResponse, User } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    return Promise.reject(error);
  }
);

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredTokens(access: string, refresh?: string): void {
  localStorage.setItem(TOKEN_KEY, access);
  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
}

export function clearStoredTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function extractErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiError>;
  const data = axiosError.response?.data;

  if (!data) {
    return axiosError.message || "请求失败，请稍后重试";
  }

  if (data.detail) {
    return data.detail;
  }

  if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
    return data.non_field_errors.join("; ");
  }

  const fieldErrors: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === "detail" || key === "non_field_errors") continue;
    if (Array.isArray(value)) {
      fieldErrors.push(`${key}: ${value.join(", ")}`);
    } else if (typeof value === "string") {
      fieldErrors.push(`${key}: ${value}`);
    }
  }

  if (fieldErrors.length > 0) {
    return fieldErrors.join("; ");
  }

  return "请求失败，请稍后重试";
}

export async function register(data: RegisterData): Promise<User> {
  const response: AxiosResponse<User> = await api.post("/auth/users/", data);
  return response.data;
}

export async function login(data: LoginData): Promise<TokenResponse> {
  const response: AxiosResponse<TokenResponse> = await api.post(
    "/auth/jwt/create/",
    data
  );
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response: AxiosResponse<User> = await api.get("/auth/users/me/");
  return response.data;
}

export async function refreshAccessToken(): Promise<TokenResponse> {
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refresh) {
    throw new Error("无可用的刷新令牌");
  }
  const response: AxiosResponse<TokenResponse> = await api.post(
    "/auth/jwt/refresh/",
    { refresh }
  );
  return response.data;
}

export { api, API_BASE_URL, TOKEN_KEY, REFRESH_TOKEN_KEY };
export type { AxiosRequestConfig };
