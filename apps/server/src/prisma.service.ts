import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        {
          level: 'query', // 捕获 SQL 查询
          emit: 'stdout', // 输出到标准输出
        },
        {
          level: 'info', // 捕获信息
          emit: 'stdout', // 输出到标准输出
        },
        {
          level: 'warn', // 捕获警告
          emit: 'stdout', // 输出到标准输出
        },
        {
          level: 'error', // 捕获错误
          emit: 'stdout', // 输出到标准输出
        },
      ],
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
