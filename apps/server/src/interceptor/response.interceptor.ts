import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response as ExpressResponse } from 'express';

export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<ExpressResponse>();

    return next.handle().pipe(
      map((data) => {
        response.status(HttpStatus.OK);
        return {
          code: HttpStatus.OK,
          message: 'success',
          data,
        };
      }),
    );
  }
}
