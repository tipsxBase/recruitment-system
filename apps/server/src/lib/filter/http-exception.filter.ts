import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorCodes } from '@/lib/exception/ErrorCodes';
import { UniqueException } from '@/lib/exception/UniqueException';
import { ZodValidateException } from '@/lib/exception/ZodValidateException';
import { TokenExpiredError } from '@nestjs/jwt';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private httpAdapterHost: HttpAdapterHost) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    if (
      exception instanceof ZodValidateException ||
      exception instanceof UniqueException
    ) {
      const message = exception.getResponse() as any;
      const responseBody = {
        code: message.code,
        message: message.message,
        errors: message.errors,
        success: false,
      };
      httpAdapter.reply(ctx.getResponse(), responseBody, exception.getStatus());
    } else if (exception instanceof TokenExpiredError) {
      Logger.error(exception);
      const responseBody = {
        code: HttpStatus.UNAUTHORIZED,
        message: '用户认证过期，请重新登录',
        errors: ['用户认证过期，请重新登录'],
        success: false,
      };
      httpAdapter.reply(
        ctx.getResponse(),
        responseBody,
        HttpStatus.UNAUTHORIZED,
      );
    } else if (exception instanceof HttpException) {
      const message = exception.getResponse() as any;
      const responseBody = {
        code: exception.getStatus(),
        message: message.message,
        errors: message.errors,
        success: false,
      };
      httpAdapter.reply(ctx.getResponse(), responseBody, exception.getStatus());
    } else {
      const responseBody = {
        code: ErrorCodes.UNKNOW_ERROR,
        message: '未知错误',
        errors: null,
        success: false,
      };
      httpAdapter.reply(
        ctx.getResponse(),
        responseBody,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
