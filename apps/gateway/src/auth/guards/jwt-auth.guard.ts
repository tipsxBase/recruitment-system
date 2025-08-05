import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * 用于 JWT 令牌认证（JWT Strategy），适合保护需要登录后才能访问的接口。
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
