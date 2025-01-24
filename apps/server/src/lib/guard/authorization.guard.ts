import { Cookie } from '@recruitment/shared';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtUserData, Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '@/lib/decorator/public.decorator';
import { JwtService } from '@nestjs/jwt';

const getTokens = (request: Request) => {
  // 先从 cookie 中获取 token,如果没有再从 header 中获取
  const cookie = new Cookie(request.headers.cookie!);
  const tokenFromCookie = cookie.get('token');
  if (tokenFromCookie) {
    return tokenFromCookie;
  }
  const authorization = request.headers.authorization;

  if (!authorization) {
    throw new UnauthorizedException('用户未登录');
  }
  const [type, tokenFromHeader] = authorization.split(' ');
  if (type !== 'Bearer' || !tokenFromHeader) {
    throw new UnauthorizedException('用户未登录');
  }

  return tokenFromHeader;
};

@Injectable()
export class AuthorizationGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    Logger.debug(request.url, request.method);
    // 用 reflector 从目标 controller 和 handler 上拿到 IS_PUBLIC_KEY 的 metadata。
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (isPublic) {
      // 白名单接口
      return true;
    }
    // 从cookie中获取token
    const token = getTokens(request);
    const data = this.jwtService.verify<JwtUserData>(token);
    console.log('data', token);
    request.user = {
      userId: data.userId,
      username: data.username,
      status: data.status,
    };
    return true;
  }
}
