import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@recruitment/database';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [
        {
          level: 'query', // 捕获 SQL 查询
          emit: 'stdout', // 输出到标准输出
        },
        // 注释掉 info 级别日志以减少输出
        // {
        //   level: 'info', // 捕获信息
        //   emit: 'stdout', // 输出到标准输出
        // },
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

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
