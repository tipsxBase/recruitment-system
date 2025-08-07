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
} from "@nestjs/common";
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

@Controller("auth")
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UsePipes(ZodValidation(LoginRequestSchema))
  async login(@Body() loginDto: LoginRequest) {
    return this.authService.login(loginDto);
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
  @UsePipes(ZodValidation(RefreshTokenRequestSchema))
  async refreshToken(@Body() refreshTokenDto: RefreshTokenRequest) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getProfile(@Request() req: any) {
    return this.authService.getCurrentUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("change-password")
  @UsePipes(ZodValidation(ChangePasswordRequestSchema))
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordRequest
  ) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put("profile")
  @UsePipes(ZodValidation(UpdateProfileRequestSchema))
  async updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileRequest
  ) {
    return this.authService.updateProfile(req.user.id, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout() {
    // 在生产环境中，这里可以实现 token 黑名单机制
    return { message: "退出登录成功" };
  }
}
