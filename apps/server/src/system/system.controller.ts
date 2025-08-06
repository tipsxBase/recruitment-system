import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { SystemService } from './system.service';
import {
  SystemConfigRequestSchema,
  type SystemConfigRequest,
} from '@recruitment/schema';

@Controller('system')
export class SystemController {
  constructor(private systemService: SystemService) {}

  @Get('config')
  async getSystemConfig(@Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.systemService.getSystemConfig(currentUser);
  }

  @Get('health')
  async getSystemHealth(@Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.systemService.getSystemHealth(currentUser);
  }

  @Get('metrics')
  async getSystemMetrics(@Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.systemService.getSystemMetrics(currentUser);
  }

  @Get('logs')
  async getSystemLogs(@Query() query: any, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.systemService.getSystemLogs(query, currentUser);
  }

  @Put('config')
  async updateSystemConfig(
    @Body() updateConfigDto: SystemConfigRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData = SystemConfigRequestSchema.parse(updateConfigDto);
    return this.systemService.updateSystemConfig(validatedData, currentUser);
  }

  @Post('backup')
  @HttpCode(HttpStatus.CREATED)
  async createBackup(@Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.systemService.createBackup(currentUser);
  }

  @Post('restore/:backupId')
  async restoreBackup(
    @Param('backupId') backupId: string,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.systemService.restoreBackup(backupId, currentUser);
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
