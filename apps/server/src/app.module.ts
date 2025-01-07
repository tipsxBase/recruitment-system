import { Module } from '@nestjs/common';
import { JobModule } from './job/job.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '@/lib/filter/http-exception.filter';
import { ResponseInterceptor } from '@/lib/interceptor/response.interceptor';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthorizationGuard } from '@/lib/guard/authorization.guard';

@Module({
  imports: [JobModule, AuthModule, UsersModule],
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
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AppModule {}
