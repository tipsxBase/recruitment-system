import 'express';

declare module 'express' {
  interface JwtUserData {
    userId: number;
    username: string;
    status: UserStatus;
  }

  interface Request {
    user: JwtUserData;
  }
}
