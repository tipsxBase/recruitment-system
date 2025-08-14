import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { JwtPayload } from "../auth.service";
import { CookieUtils } from "../utils/cookie.utils";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * 初始化 JWT 认证策略。
   *
   * 配置该策略以从 Authorization 头部的 Bearer Token 或通过 `CookieUtils.ACCESS_TOKEN_COOKIE` 指定的 Cookie 中提取 JWT。
   * JWT 密钥通过配置服务的 `JWT_SECRET` 键获取，默认值为 "recruitment-secret-key"。强制校验 Token 过期时间。
   *
   * @param configService - 用于访问应用配置值的服务。
   */
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          return request?.cookies?.[CookieUtils.ACCESS_TOKEN_COOKIE];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        "JWT_SECRET",
        "recruitment-secret-key"
      ),
    });
  }

  async validate(payload: JwtPayload) {
    return {
      sub: payload.sub,
      email: payload.email,
      roles: payload.roles,
      departments: payload.departments,
      permissions: payload.permissions,
    };
  }
}
