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
import { CandidatesService } from './candidates.service';
import {
  GetCandidatesRequestSchema,
  CreateCandidateRequestSchema,
  UpdateCandidateRequestSchema,
  BatchImportCandidatesRequestSchema,
  UpdateCandidateStatusRequestSchema,
  ManageCandidateTagsRequestSchema,
  GetCandidateSuggestionsRequestSchema,
  GetCandidateStatsRequestSchema,
  BatchCandidateOperationRequestSchema,
  type GetCandidatesRequest,
  type CreateCandidateRequest,
  type UpdateCandidateRequest,
  type BatchImportCandidatesRequest,
  type UpdateCandidateStatusRequest,
  type ManageCandidateTagsRequest,
  type GetCandidateSuggestionsRequest,
  type GetCandidateStatsRequest,
  type BatchCandidateOperationRequest,
} from '@recruitment/schema';

@Controller('candidates')
export class CandidatesController {
  constructor(private candidatesService: CandidatesService) {}

  @Get()
  async getCandidates(
    @Query() query: GetCandidatesRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedQuery = GetCandidatesRequestSchema.parse(query);
    return this.candidatesService.getCandidates(validatedQuery, currentUser);
  }

  @Get('stats')
  async getCandidateStats(
    @Query() query: GetCandidateStatsRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedQuery = GetCandidateStatsRequestSchema.parse(query);
    return this.candidatesService.getCandidateStats(
      validatedQuery,
      currentUser,
    );
  }

  @Get('suggestions')
  async getCandidateSuggestions(
    @Query() query: GetCandidateSuggestionsRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedQuery = GetCandidateSuggestionsRequestSchema.parse(query);
    return this.candidatesService.getCandidateSuggestions(
      validatedQuery,
      currentUser,
    );
  }

  @Get(':id')
  async getCandidateById(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.candidatesService.getCandidateById(id, currentUser);
  }

  @Get(':id/timeline')
  async getCandidateTimeline(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.candidatesService.getCandidateTimeline(id, currentUser);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCandidate(
    @Body() createCandidateDto: CreateCandidateRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData =
      CreateCandidateRequestSchema.parse(createCandidateDto);
    return this.candidatesService.createCandidate(validatedData, currentUser);
  }

  @Put(':id')
  async updateCandidate(
    @Param('id') id: string,
    @Body() updateCandidateDto: UpdateCandidateRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData =
      UpdateCandidateRequestSchema.parse(updateCandidateDto);
    return this.candidatesService.updateCandidate(
      id,
      validatedData,
      currentUser,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCandidate(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.candidatesService.deleteCandidate(id, currentUser);
  }

  @Patch(':id/status')
  async updateCandidateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateCandidateStatusRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData =
      UpdateCandidateStatusRequestSchema.parse(updateStatusDto);
    return this.candidatesService.updateCandidateStatus(
      id,
      validatedData,
      currentUser,
    );
  }

  @Post(':id/tags')
  async manageCandidateTags(
    @Param('id') id: string,
    @Body() tagsDto: ManageCandidateTagsRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData = ManageCandidateTagsRequestSchema.parse(tagsDto);
    return this.candidatesService.manageCandidateTags(
      id,
      validatedData,
      currentUser,
    );
  }

  @Post('batch-import')
  async batchImportCandidates(
    @Body() batchImportDto: BatchImportCandidatesRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData =
      BatchImportCandidatesRequestSchema.parse(batchImportDto);
    return this.candidatesService.batchImportCandidates(
      validatedData,
      currentUser,
    );
  }

  @Post('batch-operation')
  async batchOperationCandidates(
    @Body() batchOperationDto: BatchCandidateOperationRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData =
      BatchCandidateOperationRequestSchema.parse(batchOperationDto);
    return this.candidatesService.batchOperationCandidates(
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
