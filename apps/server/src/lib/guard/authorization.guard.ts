import { Cookie } from '@recruitment/shared';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '@/lib/decorator/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';

interface JwtUserData {
  userId: number;
  username: string;
  status: UserStatus;
}

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
    const cookie = new Cookie(request.headers.cookie!);
    if (!cookie.has('token')) {
      throw new UnauthorizedException('用户未登录');
    }
    const token = cookie.get('token')!;
    const data = this.jwtService.verify<JwtUserData>(token);
    request.user = {
      userId: data.userId,
      username: data.username,
      status: data.status,
    };
    return true;
  }
}
