import { HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@recruitment/schema";

export const createResponse = <T>(
  data: T,
  message = "success",
  code = HttpStatus.OK
): ApiResponse<T> => ({
  success: code >= 200 && code < 300,
  code,
  message,
  data,
});

export const createPaginationResponse = <T>(
  data: T,
  total: number,
  page: number,
  pageSize: number,
  message = "success",
  code = HttpStatus.OK
): ApiResponse<T> => ({
  success: code >= 200 && code < 300,
  code,
  message,
  data,
  meta: {
    total,
    page,
    pageSize,
  },
});
