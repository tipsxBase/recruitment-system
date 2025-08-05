import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { JobService } from './job.service';

@Controller('jobs')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  async findAll(
    @Query('department') department: string,
    @Headers('x-user-departments') userDepartments: string,
    @Headers('x-user-roles') userRoles: string,
  ) {
    const roles = JSON.parse(userRoles || '[]');
    const departments = JSON.parse(userDepartments || '[]');

    // 管理员可以查看所有岗位，其他用户只能查看自己部门的岗位
    let departmentFilter: string[] | undefined;

    if (!roles.includes('admin')) {
      departmentFilter = departments;
    }

    return this.jobService.findAll(departmentFilter);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.jobService.findById(id);
  }

  @Post()
  async createJob(
    @Body() jobData: any,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-roles') userRoles: string,
  ) {
    const roles = JSON.parse(userRoles || '[]');

    // 只有 HR 和管理员可以创建岗位
    if (!roles.includes('admin') && !roles.includes('hr')) {
      throw new UnauthorizedException('没有权限创建岗位');
    }

    return this.jobService.createJob(jobData, userId);
  }

  @Put(':id')
  async updateJob(
    @Param('id') id: string,
    @Body() updateData: any,
    @Headers('x-user-roles') userRoles: string,
  ) {
    const roles = JSON.parse(userRoles || '[]');

    // 只有 HR 和管理员可以编辑岗位
    if (!roles.includes('admin') && !roles.includes('hr')) {
      throw new UnauthorizedException('没有权限编辑岗位');
    }

    return this.jobService.updateJob(id, updateData);
  }

  @Delete(':id')
  async deleteJob(
    @Param('id') id: string,
    @Headers('x-user-roles') userRoles: string,
  ) {
    const roles = JSON.parse(userRoles || '[]');

    // 只有管理员可以删除岗位
    if (!roles.includes('admin')) {
      throw new UnauthorizedException('没有权限删除岗位');
    }

    return this.jobService.deleteJob(id);
  }
}
