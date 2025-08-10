import type { User } from "@recruitment/schema";
import { get } from "./fetch";

export const getProfile = () => {
  return get<User>("/auth/profile");
};
