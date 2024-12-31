import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Job, Prisma } from '@prisma/client';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async createJob(data: Prisma.JobCreateInput): Promise<Job> {
    return this.prisma.job.create({ data });
  }
}
