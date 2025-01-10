import { AuthUser } from '@/lib/decorator/auth-user.decorator';
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('current')
  async getCurrentUser(@AuthUser('userId') userId: number) {
    return this.userService.findOne({ id: userId });
  }
}
