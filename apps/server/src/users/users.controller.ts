import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  GetUsersRequestSchema,
  CreateUserRequestSchema,
  UpdateUserRequestSchema,
  BatchAssignRolesRequestSchema,
  BatchImportUsersRequestSchema,
  ResetUserPasswordRequestSchema,
  ExportUsersRequestSchema,
  type GetUsersRequest,
  type CreateUserRequest,
  type UpdateUserRequest,
  type BatchAssignRolesRequest,
  type BatchImportUsersRequest,
  type ResetUserPasswordRequest,
  type ExportUsersRequest,
} from '@recruitment/schema';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * 获取用户列表
   * 支持分页、搜索、筛选、排序
   */
  @Get()
  async getUsers(@Query() query: GetUsersRequest, @Headers() headers: any) {
    // 从请求头获取当前用户信息
    const currentUser = this.extractUserFromHeaders(headers);

    // 验证查询参数
    const validatedQuery = GetUsersRequestSchema.parse(query);

    return this.usersService.getUsers(validatedQuery, currentUser);
  }

  /**
   * 获取用户详情
   */
  @Get(':id')
  async getUserById(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.usersService.getUserById(id, currentUser);
  }

  /**
   * 创建用户
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);

    // 验证请求数据
    const validatedData = CreateUserRequestSchema.parse(createUserDto);

    return this.usersService.createUser(validatedData, currentUser);
  }

  /**
   * 更新用户信息
   */
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);

    // 验证请求数据
    const validatedData = UpdateUserRequestSchema.parse(updateUserDto);

    return this.usersService.updateUser(id, validatedData, currentUser);
  }

  /**
   * 删除用户
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.usersService.deleteUser(id, currentUser);
  }

  /**
   * 分配用户角色
   */
  @Post(':id/assign-roles')
  async assignRoles(
    @Param('id') id: string,
    @Body() assignRolesDto: BatchAssignRolesRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);

    // 验证请求数据
    const validatedData = BatchAssignRolesRequestSchema.parse(assignRolesDto);

    return this.usersService.assignRoles(id, validatedData, currentUser);
  }

  /**
   * 重置用户密码
   */
  @Post(':id/reset-password')
  async resetUserPassword(
    @Param('id') id: string,
    @Body() resetPasswordDto: ResetUserPasswordRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);

    // 验证请求数据
    const validatedData =
      ResetUserPasswordRequestSchema.parse(resetPasswordDto);

    return this.usersService.resetUserPassword(id, validatedData, currentUser);
  }

  /**
   * 批量导入用户
   */
  @Post('batch-import')
  async batchImportUsers(
    @Body() batchImportDto: BatchImportUsersRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);

    // 验证请求数据
    const validatedData = BatchImportUsersRequestSchema.parse(batchImportDto);

    return this.usersService.batchImportUsers(validatedData, currentUser);
  }

  /**
   * 导出用户数据
   */
  @Post('export')
  async exportUsers(
    @Body() exportDto: ExportUsersRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);

    // 验证请求数据
    const validatedData = ExportUsersRequestSchema.parse(exportDto);

    return this.usersService.exportUsers(validatedData, currentUser);
  }

  /**
   * 从请求头中提取用户信息
   * Gateway 会将用户信息通过 X-User-* 头传递过来
   */
  private extractUserFromHeaders(headers: any) {
    try {
      return {
        id: headers['x-user-id'],
        email: headers['x-user-email'],
        roles: JSON.parse(headers['x-user-roles'] || '[]'),
        departments: JSON.parse(headers['x-user-departments'] || '[]'),
      };
    } catch (error) {
      throw new BadRequestException(
        'Invalid user information in headers',
        error,
      );
    }
  }
}
