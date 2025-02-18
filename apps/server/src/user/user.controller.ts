import { AuthUser } from '@/lib/decorator/auth-user.decorator';
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { omit } from '@recruitment/shared';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('current')
  async getCurrentUser(@AuthUser('userId') userId: number) {
    const user = await this.userService.findOne({ id: userId });
    return omit(user, 'password');
  }

  @Get('/menus')
  async getMenu() {
    return this.userService.getMenu();
  }
}
