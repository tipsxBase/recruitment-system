import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from './ErrorCodes';

export interface UniqueError {
  code?: ErrorCodes.UNIQUE_ERROR;
  message: string;
  uniqueColumn: string[];
}

export class UniqueException extends HttpException {
  constructor(error: UniqueError) {
    super(
      {
        code: ErrorCodes.UNIQUE_ERROR,
        message: error.message,
        errors: error.uniqueColumn,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
