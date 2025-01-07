import { UsersService } from '@/users/users.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInbDto } from './auth.schema';
import { UserDto } from '@/users/user.schema';
import { UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(params: SignInbDto) {
    const userDto: UserDto = {
      username: params.username,
    };

    const foundUser = await this.usersService.findOne(userDto);
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
}
