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
import { DepartmentsService } from './departments.service';
import {
  GetDepartmentsRequestSchema,
  CreateDepartmentRequestSchema,
  UpdateDepartmentRequestSchema,
  type GetDepartmentsRequest,
  type CreateDepartmentRequest,
  type UpdateDepartmentRequest,
} from '@recruitment/schema';

@Controller('departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Get()
  async getDepartments(
    @Query() query: GetDepartmentsRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedQuery = GetDepartmentsRequestSchema.parse(query);
    return this.departmentsService.getDepartments(validatedQuery, currentUser);
  }

  @Get('tree')
  async getDepartmentTree(@Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.departmentsService.getDepartmentTree(currentUser);
  }

  @Get(':id')
  async getDepartmentById(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.departmentsService.getDepartmentById(id, currentUser);
  }

  @Get(':id/members')
  async getDepartmentMembers(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.departmentsService.getDepartmentMembers(id, currentUser);
  }

  @Get(':id/posts')
  async getDepartmentPosts(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.departmentsService.getDepartmentPosts(id, currentUser);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createDepartment(
    @Body() createDepartmentDto: CreateDepartmentRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData =
      CreateDepartmentRequestSchema.parse(createDepartmentDto);
    return this.departmentsService.createDepartment(validatedData, currentUser);
  }

  @Put(':id')
  async updateDepartment(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData =
      UpdateDepartmentRequestSchema.parse(updateDepartmentDto);
    return this.departmentsService.updateDepartment(
      id,
      validatedData,
      currentUser,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDepartment(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.departmentsService.deleteDepartment(id, currentUser);
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
