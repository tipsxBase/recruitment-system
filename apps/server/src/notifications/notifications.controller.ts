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
  Patch,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  GetNotificationsRequestSchema,
  SendNotificationRequestSchema,
  BatchMarkReadRequestSchema,
  type GetNotificationsRequest,
  type SendNotificationRequest,
  type BatchMarkReadRequest,
} from '@recruitment/schema';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @Query() query: GetNotificationsRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedQuery = GetNotificationsRequestSchema.parse(query);
    return this.notificationsService.getNotifications(
      validatedQuery,
      currentUser,
    );
  }

  @Get('unread-count')
  async getUnreadCount(@Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.notificationsService.getUnreadCount(currentUser);
  }

  @Get(':id')
  async getNotificationById(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.notificationsService.getNotificationById(id, currentUser);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNotification(
    @Body() createNotificationDto: SendNotificationRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData = SendNotificationRequestSchema.parse(
      createNotificationDto,
    );
    return this.notificationsService.createNotification(
      validatedData,
      currentUser,
    );
  }

  @Put(':id')
  async updateNotification(
    @Param('id') id: string,
    @Body() updateNotificationDto: SendNotificationRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData = SendNotificationRequestSchema.parse(
      updateNotificationDto,
    );
    return this.notificationsService.updateNotification(
      id,
      validatedData,
      currentUser,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNotification(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.notificationsService.deleteNotification(id, currentUser);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.notificationsService.markAsRead(id, currentUser);
  }

  @Patch('read-all')
  async markAllAsRead(@Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.notificationsService.markAllAsRead(currentUser);
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
