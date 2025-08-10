import {
  ForbiddenException as NestForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  BusinessException,
  ValidationException,
  ResourceNotFoundException,
  ForbiddenException,
  DuplicateResourceException,
  OperationFailedException,
  ExternalServiceException,
  RateLimitException,
} from "../exceptions/business.exception";

/**
 * 异常工具类
 * 提供统一的异常抛出方法
 */
export class ExceptionUtils {
  /**
   * 抛出参数验证异常
   */
  static throwValidation(
    message: string = "参数验证失败",
    details?: any
  ): never {
    throw new ValidationException(message, details);
  }

  /**
   * 抛出资源不存在异常
   */
  static throwNotFound(resource: string = "资源", id?: string | number): never {
    throw new ResourceNotFoundException(resource, id);
  }

  /**
   * 抛出权限不足异常
   */
  static throwForbidden(message?: string): never {
    throw new ForbiddenException(message);
  }

  /**
   * 抛出未授权异常
   */
  static throwUnauthorized(message: string = "未授权访问"): never {
    throw new UnauthorizedException(message);
  }

  /**
   * 抛出重复资源异常
   */
  static throwDuplicate(resource: string = "资源", field?: string): never {
    throw new DuplicateResourceException(resource, field);
  }

  /**
   * 抛出操作失败异常
   */
  static throwOperationFailed(
    operation: string = "操作",
    reason?: string
  ): never {
    throw new OperationFailedException(operation, reason);
  }

  /**
   * 抛出外部服务异常
   */
  static throwExternalService(
    service: string = "外部服务",
    message: string = "服务暂时不可用",
    details?: any
  ): never {
    throw new ExternalServiceException(service, message, details);
  }

  /**
   * 抛出限流异常
   */
  static throwRateLimit(message?: string): never {
    throw new RateLimitException(message);
  }

  /**
   * 抛出业务异常
   */
  static throwBusiness(message: string, code?: number, details?: any): never {
    throw new BusinessException(message, code, details);
  }

  /**
   * 抛出服务器内部错误
   */
  static throwInternalError(message: string = "服务器内部错误"): never {
    throw new InternalServerErrorException(message);
  }

  /**
   * 条件性抛出异常
   */
  static throwIf(condition: boolean, exceptionFn: () => never): void {
    if (condition) {
      exceptionFn();
    }
  }

  /**
   * 条件性抛出资源不存在异常
   */
  static throwIfNotFound<T>(
    data: T | null | undefined,
    resource: string = "资源",
    id?: string | number
  ): asserts data is T {
    if (data === null || data === undefined) {
      this.throwNotFound(resource, id);
    }
  }

  /**
   * 条件性抛出权限异常
   */
  static throwIfForbidden(condition: boolean, message?: string): void {
    if (condition) {
      this.throwForbidden(message);
    }
  }

  /**
   * 条件性抛出验证异常
   */
  static throwIfInvalid(
    condition: boolean,
    message: string = "参数验证失败",
    details?: any
  ): void {
    if (condition) {
      this.throwValidation(message, details);
    }
  }
}
