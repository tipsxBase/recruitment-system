export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
}

/**
 * 响应工具类
 * 统一API响应格式
 */
export class ResponseUtils {
  /**
   * 成功响应
   * @param data 响应数据
   * @param message 响应消息
   * @param code 响应状态码
   * @returns API响应对象
   */
  static success<T>(data?: T, message = "success", code = 200): ApiResponse<T> {
    return {
      success: true,
      code,
      message,
      data,
    };
  }

  /**
   * 错误响应
   * @param message 错误消息
   * @param code 错误状态码
   * @returns API响应对象
   */
  static error(message = "error", code = 500): ApiResponse {
    return {
      success: false,
      code,
      message,
    };
  }

  /**
   * 分页成功响应
   * @param data 响应数据
   * @param total 总数量
   * @param page 当前页码
   * @param pageSize 每页大小
   * @param message 响应消息
   * @returns API响应对象
   */
  static paginated<T>(
    data: T,
    total: number,
    page: number,
    pageSize: number,
    message = "success"
  ): ApiResponse<T> {
    const totalPages = Math.ceil(total / pageSize);
    return {
      success: true,
      code: 200,
      message,
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
      },
    };
  }
}
