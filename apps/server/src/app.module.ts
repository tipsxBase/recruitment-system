import { Module } from '@nestjs/common';
import { JobModule } from './job/job.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { ResponseInterceptor } from './interceptor/response.interceptor';

@Module({
  imports: [JobModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthorizationGuard,
    // },
  ],
})
export class AppModule {}
