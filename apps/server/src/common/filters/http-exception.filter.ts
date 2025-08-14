import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

interface ErrorResponse {
  success: boolean;
  code: number;
  message: string;
  data?: any;
  timestamp: string;
  path: string;
  method: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let httpStatus: number;
    let message: string;
    let errorDetails: any = null;

    // 处理 Zod 验证错误
    if (exception instanceof ZodError) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = '请求参数验证失败';
      errorDetails = {
        type: 'ValidationError',
        validationErrors: exception.errors.map((error) => ({
          field: error.path.join('.'),
          message: error.message,
          code: error.code,
          ...('received' in error && { received: error.received }),
        })),
      };
    }
    // 处理 HTTP 异常
    else if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || '请求处理失败';
        errorDetails = responseObj.details || responseObj.errors || null;
      } else {
        message = '请求处理失败';
      }
    }
    // 处理其他类型的异常
    else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = '服务器内部错误';

      // 在开发环境下显示详细错误信息
      if (process.env.NODE_ENV === 'development') {
        if (exception instanceof Error) {
          message = exception.message;
          errorDetails = {
            stack: exception.stack,
            name: exception.name,
          };
        }
      }
    }

    // 构建错误响应
    const errorResponse: ErrorResponse = {
      success: false,
      code: httpStatus,
      message,
      ...(errorDetails && { data: errorDetails }),
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    // 记录错误日志
    this.logError(exception, request, httpStatus);

    // 发送响应
    httpAdapter.reply(response, errorResponse, httpStatus);
  }

  private logError(
    exception: unknown,
    request: Request,
    statusCode: number,
  ): void {
    const { method, url, ip } = request;
    const userAgent = request.get('User-Agent') || '';

    let errorMessage = '';
    let stack = '';

    if (exception instanceof ZodError) {
      errorMessage = `Validation failed: ${exception.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ')}`;
    } else if (exception instanceof HttpException) {
      errorMessage = exception.message;
      stack = exception.stack || '';
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
      stack = exception.stack || '';
    } else {
      errorMessage = String(exception);
    }

    // 根据状态码选择日志级别
    if (statusCode >= 500) {
      this.logger.error(`HTTP ${statusCode} Error: ${errorMessage}`, {
        method,
        url,
        ip,
        userAgent,
        stack,
      });
    } else if (statusCode >= 400) {
      this.logger.warn(`HTTP ${statusCode} Warning: ${errorMessage}`, {
        method,
        url,
        ip,
        userAgent,
      });
    }
  }
}
