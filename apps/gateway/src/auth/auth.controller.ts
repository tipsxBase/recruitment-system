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
  Ip,
  Headers,
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
  SendVerificationCodeRequestSchema,
  type LoginRequest,
  type RegisterRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
  type RefreshTokenRequest,
  type ChangePasswordRequest,
  type UpdateProfileRequest,
  type SendVerificationCodeRequest,
} from "@recruitment/schema";
import { ZodValidation } from "../common/pipes/zod-validation.pipe";
import { CookieUtils } from "./utils/cookie.utils";
import { OperationLogService } from "../common/services/operation-log.service";
import {
  LOG_ACTIONS,
  LOG_RESULTS,
} from "../common/constants/operation-log.constants";
import { ExceptionUtils } from "@/common/exceptions";
import { ResponseUtils } from "@recruitment/shared";

@Controller("auth")
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private authService: AuthService,
    private operationLogService: OperationLogService
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UsePipes(ZodValidation(LoginRequestSchema))
  async login(
    @Body() loginDto: LoginRequest,
    @Res({ passthrough: true }) res: Response,
    @Ip() ipAddress: string,
    @Headers("user-agent") userAgent: string
  ) {
    try {
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

      // 记录登录成功日志
      await this.operationLogService.logAuth(
        LOG_ACTIONS.USER_LOGIN,
        result.user.id,
        LOG_RESULTS.SUCCESS,
        {
          email: loginDto.username, // username 可能是邮箱
          ipAddress,
          userAgent,
        }
      );

      // 返回响应，但不包含 token（因为已经在 cookie 中）
      const { token, refreshToken, ...response } = result;
      return response;
    } catch (error) {
      // 记录登录失败日志 - 没有用户ID，用临时ID
      await this.operationLogService.logAuth(
        LOG_ACTIONS.USER_LOGIN,
        "unknown", // 登录失败时无法获取用户ID
        LOG_RESULTS.FAILED,
        {
          email: loginDto.username,
          ipAddress,
          userAgent,
          errorMsg: error.message,
        }
      );
      throw error;
    }
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ZodValidation(RegisterRequestSchema))
  async register(
    @Body() registerDto: RegisterRequest,
    @Ip() ipAddress: string,
    @Headers("user-agent") userAgent: string
  ) {
    try {
      const result = await this.authService.register(registerDto);

      // 记录注册成功日志
      await this.operationLogService.logAuth(
        LOG_ACTIONS.USER_REGISTER,
        result.id, // result 直接包含用户信息
        LOG_RESULTS.SUCCESS,
        {
          email: registerDto.email,
          ipAddress,
          userAgent,
        }
      );

      return result;
    } catch (error) {
      // 记录注册失败日志
      await this.operationLogService.logAuth(
        LOG_ACTIONS.USER_REGISTER,
        "unknown",
        LOG_RESULTS.FAILED,
        {
          email: registerDto.email,
          ipAddress,
          userAgent,
          errorMsg: error.message,
        }
      );
      throw error;
    }
  }

  @Post("send-verification-code")
  @HttpCode(HttpStatus.OK)
  @UsePipes(ZodValidation(SendVerificationCodeRequestSchema))
  async sendVerificationCode(@Body() sendCodeDto: SendVerificationCodeRequest) {
    return this.authService.sendVerificationCode(sendCodeDto);
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
  @Get("profile")
  async getProfile(@Request() req: any) {
    // ExceptionUtils.throwBusiness("不允许更新密码字段");

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
  async logout(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
    @Ip() ipAddress: string,
    @Headers("user-agent") userAgent: string
  ) {
    // 清除 cookie 中的 token
    res.clearCookie(
      CookieUtils.ACCESS_TOKEN_COOKIE,
      CookieUtils.getClearCookieOptions()
    );
    res.clearCookie(
      CookieUtils.REFRESH_TOKEN_COOKIE,
      CookieUtils.getClearCookieOptions()
    );

    // 记录退出登录日志
    await this.operationLogService.logAuth(
      LOG_ACTIONS.USER_LOGOUT,
      req.user.sub,
      LOG_RESULTS.SUCCESS,
      {
        ipAddress,
        userAgent,
      }
    );

    return { message: "退出登录成功" };
  }
}
