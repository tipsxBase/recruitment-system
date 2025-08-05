import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Get,
  UsePipes,
} from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { loginSchema, signInSchema } from "@recruitment/schema";
import { ZodValidation } from "../common/pipes/zod-validation.pipe";

@Controller("auth")
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UsePipes(ZodValidation(loginSchema))
  async login(@Request() req: any, @Body() loginDto: any) {
    return this.authService.login(req.user);
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ZodValidation(signInSchema))
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req: any) {
    return {
      user: {
        id: req.user.sub,
        email: req.user.email,
        roles: req.user.roles,
        departments: req.user.departments,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req: any) {
    return this.authService.refreshToken(req.user);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout() {
    // 在生产环境中，这里可以实现 token 黑名单机制
    return { message: "退出登录成功" };
  }
}
