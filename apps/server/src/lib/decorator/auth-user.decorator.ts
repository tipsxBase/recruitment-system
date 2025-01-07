import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
export const AuthUser = createParamDecorator(
  (propName: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return null;
    }
    return propName ? request.user[propName] : request.user;
  },
);
