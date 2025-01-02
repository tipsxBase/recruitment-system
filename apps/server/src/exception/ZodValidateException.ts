import { HttpException, HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';

export class ZodValidateException extends HttpException {
  constructor(error: ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      message: err.message,
      path: err.path.join('.'), // 错误路径
    }));

    super(
      {
        code: HttpStatus.BAD_REQUEST,
        message: '参数错误',
        errors: formattedErrors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
