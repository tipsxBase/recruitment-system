import { Module } from '@nestjs/common';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [InterviewsController],
  providers: [InterviewsService, PrismaService],
  exports: [InterviewsService],
})
export class InterviewsModule {}
