import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(@Headers('x-user-roles') userRoles: string) {
    // 检查权限：只有管理员可以查看所有用户
    const roles = JSON.parse(userRoles || '[]');
    if (!roles.includes('admin')) {
      throw new UnauthorizedException('没有权限访问');
    }

    return this.userService.findAll();
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Headers('x-user-id') currentUserId: string,
    @Headers('x-user-roles') userRoles: string,
  ) {
    // 用户只能查看自己的信息，管理员可以查看所有
    if (id !== currentUserId) {
      const roles = JSON.parse(userRoles || '[]');
      if (!roles.includes('admin')) {
        throw new UnauthorizedException('没有权限访问');
      }
    }

    return this.userService.findById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: any,
    @Headers('x-user-id') currentUserId: string,
    @Headers('x-user-roles') userRoles: string,
  ) {
    // 用户只能更新自己的信息，管理员可以更新所有
    const roles = JSON.parse(userRoles || '[]');
    if (id !== currentUserId && !roles.includes('admin')) {
      throw new UnauthorizedException('没有权限访问');
    }

    return this.userService.updateUser(id, updateData);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @Headers('x-user-roles') userRoles: string,
  ) {
    // 只有管理员可以删除用户
    const roles = JSON.parse(userRoles || '[]');
    if (!roles.includes('admin')) {
      throw new UnauthorizedException('没有权限访问');
    }

    return this.userService.deleteUser(id);
  }
}
