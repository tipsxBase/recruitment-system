import { Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  PermissionService,
  UserInfo,
} from "../auth/permissions/permission.service";

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly serverBaseUrl: string;

  constructor(
    private configService: ConfigService,
    private permissionService: PermissionService
  ) {
    this.serverBaseUrl = this.configService.get<string>(
      "SERVER_BASE_URL",
      "http://localhost:8090"
    );
  }

  async forwardRequest(
    path: string,
    method: string,
    body?: any,
    headers?: Record<string, string>,
    query?: Record<string, string>,
    user?: any
  ): Promise<any> {
    try {
      // 构造用户信息
      const userInfo: UserInfo | undefined = user
        ? {
            id: user.sub || user.id,
            email: user.email,
            roles: user.roles || [],
            permissions: user.permissions || [],
            departments: user.departments || [],
          }
        : undefined;

      // 执行权限检查
      const permissionCheck = this.permissionService.checkPermission(
        path,
        method,
        userInfo
      );

      if (!permissionCheck.allowed) {
        this.logger.warn(`Permission denied for ${method} ${path}`, {
          userId: userInfo?.id,
          reason: permissionCheck.reason,
        });

        throw new HttpException(
          {
            message: "权限不足",
            error: "Forbidden",
            reason: permissionCheck.reason,
          },
          HttpStatus.FORBIDDEN
        );
      }

      this.logger.debug(`Permission granted for ${method} ${path}`, {
        userId: userInfo?.id,
        reason: permissionCheck.reason,
      });

      const url = new URL(`${this.serverBaseUrl}${path}`);

      // 添加查询参数
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
      };

      // 添加用户信息到请求头，供 server 服务使用
      if (user) {
        requestHeaders["X-User-Id"] = user.sub;
        requestHeaders["X-User-Email"] = user.email;
        requestHeaders["X-User-Roles"] = JSON.stringify(user.roles || []);
        requestHeaders["X-User-Departments"] = JSON.stringify(
          user.departments || []
        );
        requestHeaders["X-User-Permissions"] = JSON.stringify(
          user.permissions || []
        );
      }

      const requestOptions: RequestInit = {
        method: method.toUpperCase(),
        headers: requestHeaders,
      };

      // 对于有 body 的请求方法
      if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && body) {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url.toString(), requestOptions);

      // 处理不同的响应状态
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;

        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || "Server error" };
        }

        throw new HttpException(
          errorData,
          response.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      // 检查响应是否为 JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      this.logger.error("Proxy request failed:", error);

      if (error instanceof HttpException) {
        throw error;
      }

      // 网络或其他错误
      throw new HttpException(
        {
          message: "业务服务暂时不可用",
          error: "Service Unavailable",
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }

  async healthCheck(): Promise<{ status: string; server: string }> {
    try {
      const response = await fetch(`${this.serverBaseUrl}/health`);
      const data = await response.json();

      return {
        status: response.ok ? "healthy" : "unhealthy",
        server: data,
      };
    } catch (error) {
      return {
        status: "unhealthy",
        server: "Service unavailable",
      };
    }
  }
}
