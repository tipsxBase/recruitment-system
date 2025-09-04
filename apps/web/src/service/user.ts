import type {
  LoginResponse,
  MenuResponse,
  RegisterResponse,
  SendNotificationResponse,
  User,
} from "@recruitment/schema";
import { get, post } from "./xhr/fetch";

export const getProfile = () => {
  return get<User>("/auth/profile");
};

export const getMenu = () => {
  return get<MenuResponse[]>("/menu/user-menus");
};

export const login = (credentials: Record<string, any>) => {
  return post<LoginResponse>("/auth/login", credentials);
};

export const register = (registerData: Record<string, any>) => {
  return post<RegisterResponse>("/auth/register", registerData);
};

export const logout = () => {
  return post("/auth/logout");
};

export const sendEmail = (email: string) => {
  return post<SendNotificationResponse>("/auth/send-verification-code", {
    email,
  });
};
