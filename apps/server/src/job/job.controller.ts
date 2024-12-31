import { Body, Controller, Post } from '@nestjs/common';
import { JobService } from './job.service';
import { Job as JobModel } from '@prisma/client';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('create')
  async createJob(
    @Body() job: { name: string; description?: string; status: string },
  ): Promise<JobModel> {
    const { name, description, status } = job;
    return this.jobService.createJob({
      name,
      description,
      status,
    });
  }
}
