import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { JobService } from './job.service';
import { Job as JobModel } from '@prisma/client';
import { ZodValidationPipe } from '@/lib/pipe/zod-validation.pipe';
import {
  CreateJobDto,
  createJobSchema,
  QueryJobListPaginationDto,
  queryJobListPaginationSchema,
  UpdateJobDto,
  updateJobSchema,
} from './job.schema';
import { omit } from 'lodash';
import { PaginationResult } from '@/common/types';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('list')
  @UsePipes(new ZodValidationPipe(queryJobListPaginationSchema))
  async getJobs(
    @Body() params: QueryJobListPaginationDto,
  ): Promise<PaginationResult<JobModel>> {
    return this.jobService.getJobs(params);
  }

  @Post('active-list')
  async getActiveJobs(): Promise<JobModel[]> {
    return this.jobService.getActiveJobs();
  }

  @Post('create')
  @UsePipes(new ZodValidationPipe(createJobSchema))
  async createJob(@Body() job: CreateJobDto): Promise<JobModel> {
    const { name, description, status } = job;
    return this.jobService.createJob({
      name,
      description,
      status,
    });
  }

  @Post('update')
  @UsePipes(new ZodValidationPipe(updateJobSchema))
  async updateJob(@Body() job: UpdateJobDto): Promise<JobModel> {
    return this.jobService.updateJob({
      where: { id: job.id },
      job: omit(job, 'id'),
    });
  }

  @Delete('delete/:id')
  async deleteJob(@Param('id') id: string): Promise<JobModel> {
    return this.jobService.deleteJob({ id });
  }
}
