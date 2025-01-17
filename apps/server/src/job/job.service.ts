import { UniqueException } from '@/lib/exception/UniqueException';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Job, Prisma } from '@prisma/client';
import {
  QueryJobListPaginationDto,
  PaginationResult,
} from '@recruitment/schema';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  /**
   * 异步创建一个新的工作职位
   *
   * 该函数使用Prisma ORM的Job模型来创建一个新的数据库记录
   * 它接受一个包含Job模型所需所有字段的对象作为参数，并返回新创建的Job实例
   *
   * @param data {Prisma.JobCreateInput} - 创建新工作职位所需的数据，包括职位名称、描述等
   * @returns {Promise<Job>} 返回一个Promise，解析为新创建的工作职位实例
   */
  async createJob(data: Prisma.JobCreateInput): Promise<Job> {
    const existedJob = await this.prisma.job.findUnique({
      where: { name: data.name },
    });
    if (existedJob) {
      throw new UniqueException({
        message: `Job with name ${data.name} already exists`,
        uniqueColumn: ['name'],
      });
    }
    return this.prisma.job.create({ data });
  }

  async updateJob(params: {
    where: Prisma.JobWhereUniqueInput;
    job: Prisma.JobUncheckedUpdateInput;
  }): Promise<Job> {
    const { where, job } = params;
    if (job.name) {
      const duplicateJob = await this.prisma.job.findUnique({
        where: {
          name: job.name as string,
          NOT: {
            id: where.id as number,
          },
        },
      });
      if (duplicateJob) {
        throw new UniqueException({
          message: `岗位名称 ${job.name} 已经存在`,
          uniqueColumn: ['name'],
        });
      }
    }

    const existedJob = await this.prisma.job.findUnique({
      where: {
        id: where.id as number,
      },
    });

    if (!existedJob) {
      throw new HttpException(
        {
          message: '岗位不存在',
          errors: ['岗位不存在'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.prisma.job.update({
      where,
      data: job,
    });
  }

  async getJobs(
    params: QueryJobListPaginationDto,
  ): Promise<PaginationResult<Job>> {
    const { page, pageSize, ...job } = params;
    const skip = (page - 1) * pageSize; // 计算跳过多少条数据
    const take = pageSize; // 每页返回多少条数据
    const jobs = await this.prisma.job.findMany({
      skip,
      take,
      where: {
        name: {
          contains: job.name,
        },
        status: job.status,
      },
    });
    const total = await this.prisma.job.count({
      where: {
        name: {
          contains: job.name,
        },
        status: job.status,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return {
      records: jobs,
      total,
      page,
      pageSize,
    };
  }

  async getActiveJobs(): Promise<Job[]> {
    return this.prisma.job.findMany({
      where: {
        status: 'active',
      },
    });
  }

  async deleteJob(params: { id: string }): Promise<Job> {
    return this.prisma.job.delete({
      where: { id: Number(params.id) },
    });
  }
}
