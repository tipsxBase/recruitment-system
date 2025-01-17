export interface UserEntity {
  username: string;
  status: UserStatus;
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
  PENDING = "PENDING",
}
