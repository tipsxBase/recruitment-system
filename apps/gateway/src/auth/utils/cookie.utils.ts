import { CookieOptions } from "express";

export class CookieUtils {
  /**
   * 获取 access token 的 cookie 配置
   */
  static getAccessTokenCookieOptions(expiresIn: number): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresIn * 1000, // 转换为毫秒
      path: "/",
    };
  }

  /**
   * 获取 refresh token 的 cookie 配置
   */
  static getRefreshTokenCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
      path: "/",
    };
  }

  /**
   * 获取清除 cookie 的配置
   */
  static getClearCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    };
  }

  /**
   * Cookie 名称常量
   */
  static readonly ACCESS_TOKEN_COOKIE = "access_token";
  static readonly REFRESH_TOKEN_COOKIE = "refresh_token";
}
