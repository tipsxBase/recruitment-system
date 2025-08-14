import {
  Controller,
  All,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request } from "express";
import { ThrottlerGuard } from "@nestjs/throttler";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiPermissionGuard } from "../auth/guards/api-permission.guard";
import { ProxyService } from "./proxy.service";

@Controller()
@UseGuards(ThrottlerGuard)
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  // 健康检查不需要认证
  @All("health")
  async healthCheck() {
    return this.proxyService.healthCheck();
  }

  // 代理所有其他请求到业务服务，使用集中的权限验证
  @All("*")
  @UseGuards(JwtAuthGuard, ApiPermissionGuard)
  async proxyToServer(@Req() req: Request) {
    // 提取路径，去除 /api 前缀
    let path = req.path;
    if (path.startsWith("/api")) {
      path = path.substring(4);
    }

    // 排除认证相关路径，这些已经在 gateway 处理
    if (path.startsWith("/auth/")) {
      throw new HttpException("Not found", HttpStatus.NOT_FOUND);
    }

    const result = await this.proxyService.forwardRequest(
      path,
      req.method,
      req.body,
      {
        // 转发相关请求头
        ...(req.headers.authorization && {
          authorization: req.headers.authorization,
        }),
        ...(req.headers["content-type"] && {
          "content-type": req.headers["content-type"],
        }),
      },
      req.query as Record<string, string>,
      (req as any).user // JWT 解析后的用户信息
    );

    return result;
  }
}
