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
} from '@nestjs/common';
import { RolesService } from './roles.service';
import {
  GetRolesRequestSchema,
  CreateRoleRequestSchema,
  UpdateRoleRequestSchema,
  BatchGrantPermissionsRequestSchema,
  type GetRolesRequest,
  type CreateRoleRequest,
  type UpdateRoleRequest,
  type BatchGrantPermissionsRequest,
} from '@recruitment/schema';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  async getRoles(@Query() query: GetRolesRequest, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedQuery = GetRolesRequestSchema.parse(query);
    return this.rolesService.getRoles(validatedQuery, currentUser);
  }

  @Get('permissions')
  async getAllPermissions(@Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.rolesService.getAllPermissions(currentUser);
  }

  @Get(':id')
  async getRoleById(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.rolesService.getRoleById(id, currentUser);
  }

  @Get(':id/permissions')
  async getRolePermissions(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.rolesService.getRolePermissions(id, currentUser);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRole(
    @Body() createRoleDto: CreateRoleRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData = CreateRoleRequestSchema.parse(createRoleDto);
    return this.rolesService.createRole(validatedData, currentUser);
  }

  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData = UpdateRoleRequestSchema.parse(updateRoleDto);
    return this.rolesService.updateRole(id, validatedData, currentUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRole(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.rolesService.deleteRole(id, currentUser);
  }

  @Post(':id/permissions')
  async assignRolePermissions(
    @Param('id') id: string,
    @Body() permissionsDto: BatchGrantPermissionsRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData =
      BatchGrantPermissionsRequestSchema.parse(permissionsDto);
    return this.rolesService.assignRolePermissions(
      id,
      validatedData,
      currentUser,
    );
  }

  private extractUserFromHeaders(headers: any) {
    return {
      id: headers['x-user-id'],
      email: headers['x-user-email'],
      roles: JSON.parse(headers['x-user-roles'] || '[]'),
      departments: JSON.parse(headers['x-user-departments'] || '[]'),
    };
  }
}
