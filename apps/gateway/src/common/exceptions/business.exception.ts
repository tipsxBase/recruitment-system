import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * 业务异常基类
 */
export class BusinessException extends HttpException {
  constructor(
    message: string,
    code: number = HttpStatus.BAD_REQUEST,
    details?: any
  ) {
    super(
      {
        message,
        error: "Business Error",
        details,
      },
      code
    );
  }
}

/**
 * 验证异常
 */
export class ValidationException extends BusinessException {
  constructor(message: string = "参数验证失败", details?: any) {
    super(message, HttpStatus.BAD_REQUEST, details);
  }
}

/**
 * 资源不存在异常
 */
export class ResourceNotFoundException extends BusinessException {
  constructor(resource: string = "资源", id?: string | number) {
    const message = id ? `${resource} (ID: ${id}) 不存在` : `${resource}不存在`;
    super(message, HttpStatus.NOT_FOUND);
  }
}

/**
 * 权限不足异常
 */
export class ForbiddenException extends BusinessException {
  constructor(message: string = "权限不足，无法访问该资源") {
    super(message, HttpStatus.FORBIDDEN);
  }
}

/**
 * 重复资源异常
 */
export class DuplicateResourceException extends BusinessException {
  constructor(resource: string = "资源", field?: string) {
    const message = field
      ? `${resource}的${field}已存在，请使用其他值`
      : `${resource}已存在`;
    super(message, HttpStatus.CONFLICT);
  }
}

/**
 * 操作失败异常
 */
export class OperationFailedException extends BusinessException {
  constructor(operation: string = "操作", reason?: string) {
    const message = reason ? `${operation}失败: ${reason}` : `${operation}失败`;
    super(message, HttpStatus.BAD_REQUEST);
  }
}

/**
 * 外部服务异常
 */
export class ExternalServiceException extends BusinessException {
  constructor(
    service: string = "外部服务",
    message: string = "服务暂时不可用",
    details?: any
  ) {
    super(
      `${service}异常: ${message}`,
      HttpStatus.SERVICE_UNAVAILABLE,
      details
    );
  }
}

/**
 * 限流异常
 */
export class RateLimitException extends BusinessException {
  constructor(message: string = "请求过于频繁，请稍后再试") {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
