import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorCodes } from 'src/exception/ErrorCodes';
import { UniqueException } from 'src/exception/UniqueException';
import { ZodValidateException } from 'src/exception/ZodValidateException';

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
