import { UserService } from '@/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInbDto } from './auth.schema';
import { UserDto } from '@/user/user.schema';
import { UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(params: SignInbDto) {
    const userDto: UserDto = {
      username: params.username,
    };

    const foundUser = await this.userService.findOne(userDto);
    if (!foundUser || foundUser.password !== params.password) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    if (foundUser?.status === UserStatus.BANNED) {
      throw new UnauthorizedException('用户已被禁用');
    }
    const payload = {
      userId: foundUser!.id,
      username: foundUser!.username,
      status: foundUser!.status,
    };
    return this.jwtService.sign(payload);
  }

  async validateToken(token: string) {
    return this.jwtService.verify(token);
  }
}
