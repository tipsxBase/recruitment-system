import { RegisterDto } from './../../../../packages/schema/src/auth.schema';
import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('validate')
  async validateUser(
    @Body() { email, password }: { email: string; password: string },
  ) {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    return user;
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('me')
  async getCurrentUser(@Headers('x-user-id') userId: string) {
    if (!userId) {
      throw new UnauthorizedException('用户未认证');
    }

    const user = await this.authService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles.map((ur) => ur.role.name),
      departments: user.departments.map((ud) => ud.department.name),
      isActive: user.isActive,
    };
  }
}
