import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUserData, Request } from 'express';
export const AuthUser = createParamDecorator(
  (propName: keyof JwtUserData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return null;
    }
    return propName ? request.user[propName] : request.user;
  },
);
