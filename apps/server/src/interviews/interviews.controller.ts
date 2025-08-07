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
import { InterviewsService } from './interviews.service';
import {
  GetInterviewsRequestSchema,
  CreateInterviewRequestSchema,
  UpdateInterviewRequestSchema,
  CancelInterviewRequestSchema,
  ScheduleInterviewRequestSchema,
  GetInterviewStatsRequestSchema,
  type GetInterviewsRequest,
  type CreateInterviewRequest,
  type UpdateInterviewRequest,
  type CancelInterviewRequest,
  type ScheduleInterviewRequest,
  type GetInterviewStatsRequest,
} from '@recruitment/schema';

@Controller('interviews')
export class InterviewsController {
  constructor(private interviewsService: InterviewsService) {}

  @Get()
  async getInterviews(
    @Query() query: GetInterviewsRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedQuery = GetInterviewsRequestSchema.parse(query);
    return this.interviewsService.getInterviews(validatedQuery, currentUser);
  }

  @Get('calendar')
  async getInterviewCalendar(@Query() query: any, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.interviewsService.getInterviewCalendar(query, currentUser);
  }

  @Get('stats')
  async getInterviewStats(
    @Query() query: GetInterviewStatsRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedQuery = GetInterviewStatsRequestSchema.parse(query);
    return this.interviewsService.getInterviewStats(
      validatedQuery,
      currentUser,
    );
  }

  @Get('my')
  async getMyInterviews(@Query() query: any, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.interviewsService.getMyInterviews(query, currentUser);
  }

  @Get(':id')
  async getInterviewById(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.interviewsService.getInterviewById(id, currentUser);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createInterview(
    @Body() createInterviewDto: CreateInterviewRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData =
      CreateInterviewRequestSchema.parse(createInterviewDto);
    return this.interviewsService.createInterview(validatedData, currentUser);
  }

  @Put(':id')
  async updateInterview(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData =
      UpdateInterviewRequestSchema.parse(updateInterviewDto);
    return this.interviewsService.updateInterview(
      id,
      validatedData,
      currentUser,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInterview(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.interviewsService.deleteInterview(id, currentUser);
  }

  @Patch(':id/cancel')
  async cancelInterview(
    @Param('id') id: string,
    @Body() cancelDto: CancelInterviewRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData = CancelInterviewRequestSchema.parse(cancelDto);
    return this.interviewsService.cancelInterview(
      id,
      validatedData,
      currentUser,
    );
  }

  @Patch(':id/reschedule')
  async rescheduleInterview(
    @Param('id') id: string,
    @Body() rescheduleDto: ScheduleInterviewRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData = ScheduleInterviewRequestSchema.parse(rescheduleDto);
    return this.interviewsService.rescheduleInterview(
      id,
      validatedData,
      currentUser,
    );
  }

  @Patch(':id/complete')
  async completeInterview(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.interviewsService.completeInterview(id, currentUser);
  }

  @Post('tasks/:taskId/start')
  async startInterviewTask(
    @Param('taskId') taskId: string,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.interviewsService.startInterviewTask(taskId, currentUser);
  }

  @Post('tasks/:taskId/feedback')
  async submitInterviewFeedback(
    @Param('taskId') taskId: string,
    @Body() feedbackDto: any,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.interviewsService.submitInterviewFeedback(
      taskId,
      feedbackDto,
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
