import {
  Controller,
  All,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
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
  async proxyToServer(@Req() req: Request, @Res() res: Response) {
    try {
      // 提取路径，去除 /api 前缀
      let path = req.path;
      if (path.startsWith("/api")) {
        path = path.substring(4);
      }

      // 排除认证相关路径，这些已经在 gateway 处理
      if (path.startsWith("/auth/")) {
        return res.status(404).json({ message: "Not found" });
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

      return res.json(result);
    } catch (error) {
      console.error("Proxy error:", error);

      // 处理 HttpException
      if (error.status) {
        return res.status(error.status).json(error.response || error.message);
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "网关内部错误",
        error: "Internal Server Error",
      });
    }
  }
}
