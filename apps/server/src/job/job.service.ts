import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async findAll(departmentFilter?: string[]) {
    const where = departmentFilter?.length
      ? { departmentId: { in: departmentFilter } }
      : {};

    return this.prisma.job.findMany({
      where,
      include: {
        department: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.job.findUnique({
      where: { id },
      include: {
        department: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async createJob(data: any, creatorId: string) {
    return this.prisma.job.create({
      data: {
        ...data,
        creatorId,
      },
      include: {
        department: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateJob(id: string, data: any) {
    return this.prisma.job.update({
      where: { id },
      data,
      include: {
        department: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteJob(id: string) {
    return this.prisma.job.delete({
      where: { id },
    });
  }
}
