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
import { AssessmentsService } from './assessments.service';
import {
  GetAssessmentsRequestSchema,
  CreateAssessmentRequestSchema,
  UpdateAssessmentRequestSchema,
  GetPendingAssessmentsRequestSchema,
  BatchAssessmentRequestSchema,
  type GetAssessmentsRequest,
  type CreateAssessmentRequest,
  type UpdateAssessmentRequest,
  type GetPendingAssessmentsRequest,
  type BatchAssessmentRequest,
} from '@recruitment/schema';
@Controller('assessments')
export class AssessmentsController {
  constructor(private assessmentsService: AssessmentsService) {}
  @Get() async getAssessments(
    @Query() query: GetAssessmentsRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedQuery = GetAssessmentsRequestSchema.parse(query);
    return this.assessmentsService.getAssessments(validatedQuery, currentUser);
  }
  @Get('pending') async getPendingAssessments(
    @Query() query: GetPendingAssessmentsRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedQuery = GetPendingAssessmentsRequestSchema.parse(query);
    return this.assessmentsService.getPendingAssessments(
      validatedQuery,
      currentUser,
    );
  }
  @Get(':id') async getAssessmentById(
    @Param('id') id: string,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.assessmentsService.getAssessmentById(id, currentUser);
  }
  @Post() @HttpCode(HttpStatus.CREATED) async createAssessment(
    @Body() createAssessmentDto: CreateAssessmentRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData =
      CreateAssessmentRequestSchema.parse(createAssessmentDto);
    return this.assessmentsService.createAssessment(validatedData, currentUser);
  }
  @Put(':id') async updateAssessment(
    @Param('id') id: string,
    @Body() updateAssessmentDto: UpdateAssessmentRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData =
      UpdateAssessmentRequestSchema.parse(updateAssessmentDto);
    return this.assessmentsService.updateAssessment(
      id,
      validatedData,
      currentUser,
    );
  }
  @Delete(':id') @HttpCode(HttpStatus.NO_CONTENT) async deleteAssessment(
    @Param('id') id: string,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.assessmentsService.deleteAssessment(id, currentUser);
  }
  @Post('batch') async batchAssessment(
    @Body() batchDto: BatchAssessmentRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData = BatchAssessmentRequestSchema.parse(batchDto);
    return this.assessmentsService.batchAssessment(validatedData, currentUser);
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
