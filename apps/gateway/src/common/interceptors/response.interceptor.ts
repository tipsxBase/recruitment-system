import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { catchError, map, Observable, throwError } from "rxjs";
import { Response as ExpressResponse } from "express";
import { Reflector } from "@nestjs/core";
import { PAGE_RESPONSE_KEY } from "../decorators/page-response.decorator";
import { createPaginationResponse, createResponse } from "../tools/response";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<ExpressResponse>();
    console.log("ResponseInterceptor triggered");
    const usePageResponse = this.reflector.get<boolean>(
      PAGE_RESPONSE_KEY,
      context.getHandler()
    );

    if (usePageResponse) {
      return next.handle().pipe(
        map((data) => {
          response.status(HttpStatus.OK);
          const { data: records, current, pageSize, total } = data;

          return createPaginationResponse(
            records,
            total,
            current,
            pageSize,
            "success",
            HttpStatus.OK
          );
        })
      );
    }

    return next.handle().pipe(
      map((data) => {
        response.status(HttpStatus.OK);
        return createResponse(data, "success", HttpStatus.OK);
      })
    );
  }
}
