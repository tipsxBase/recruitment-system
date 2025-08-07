import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Get,
  Put,
  Patch,
  Param,
  UsePipes,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { Response } from "express";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import {
  LoginRequestSchema,
  RegisterRequestSchema,
  ForgotPasswordRequestSchema,
  ResetPasswordRequestSchema,
  RefreshTokenRequestSchema,
  ChangePasswordRequestSchema,
  UpdateProfileRequestSchema,
  ActivateRequestSchema,
  type LoginRequest,
  type RegisterRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
  type RefreshTokenRequest,
  type ChangePasswordRequest,
  type UpdateProfileRequest,
  type ActivateRequest,
} from "@recruitment/schema";
import { ZodValidation } from "../common/pipes/zod-validation.pipe";
import { CookieUtils } from "./utils/cookie.utils";

@Controller("auth")
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UsePipes(ZodValidation(LoginRequestSchema))
  async login(
    @Body() loginDto: LoginRequest,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(loginDto);

    // 设置 JWT token 到 cookie
    res.cookie(
      CookieUtils.ACCESS_TOKEN_COOKIE,
      result.token,
      CookieUtils.getAccessTokenCookieOptions(result.expiresIn)
    );

    // 设置 refresh token 到 cookie
    res.cookie(
      CookieUtils.REFRESH_TOKEN_COOKIE,
      result.refreshToken,
      CookieUtils.getRefreshTokenCookieOptions()
    );

    // 返回响应，但不包含 token（因为已经在 cookie 中）
    const { token, refreshToken, ...response } = result;
    return response;
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ZodValidation(RegisterRequestSchema))
  async register(@Body() registerDto: RegisterRequest) {
    return this.authService.register(registerDto);
  }

  @Post("activate")
  @HttpCode(HttpStatus.OK)
  @UsePipes(ZodValidation(ActivateRequestSchema))
  async activate(@Body() activateDto: ActivateRequest) {
    return this.authService.activate(activateDto.token);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @UsePipes(ZodValidation(ForgotPasswordRequestSchema))
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordRequest) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @UsePipes(ZodValidation(ResetPasswordRequestSchema))
  async resetPassword(@Body() resetPasswordDto: ResetPasswordRequest) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response
  ) {
    // 从 cookie 中获取 refresh token，如果没有则从 body 中获取
    const refreshToken =
      req.cookies?.[CookieUtils.REFRESH_TOKEN_COOKIE] || req.body?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not found");
    }

    const result = await this.authService.refreshToken({ refreshToken });

    // 更新 cookie 中的 token
    res.cookie(
      CookieUtils.ACCESS_TOKEN_COOKIE,
      result.token,
      CookieUtils.getAccessTokenCookieOptions(result.expiresIn)
    );

    res.cookie(
      CookieUtils.REFRESH_TOKEN_COOKIE,
      result.refreshToken,
      CookieUtils.getRefreshTokenCookieOptions()
    );

    // 返回响应，但不包含 token
    const { token, refreshToken: newRefreshToken, ...response } = result;
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getProfile(@Request() req: any) {
    return this.authService.getCurrentUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("change-password")
  @UsePipes(ZodValidation(ChangePasswordRequestSchema))
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordRequest
  ) {
    return this.authService.changePassword(req.user.sub, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put("profile")
  @UsePipes(ZodValidation(UpdateProfileRequestSchema))
  async updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileRequest
  ) {
    return this.authService.updateProfile(req.user.sub, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    // 清除 cookie 中的 token
    res.clearCookie(
      CookieUtils.ACCESS_TOKEN_COOKIE,
      CookieUtils.getClearCookieOptions()
    );
    res.clearCookie(
      CookieUtils.REFRESH_TOKEN_COOKIE,
      CookieUtils.getClearCookieOptions()
    );

    return { message: "退出登录成功" };
  }
}
