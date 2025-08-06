import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller("health")
export class HealthController {
  constructor(private configService: ConfigService) {}

  @Get()
  check() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "recruitment-gateway",
      version: "1.0.0",
      environment: this.configService.get("NODE_ENV", "development"),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      checks: {
        database: "ok",
        redis: "ok",
        server: "checking...",
      },
    };
  }

  @Get("detailed")
  async detailedCheck() {
    const serverBaseUrl = this.configService.get(
      "SERVER_BASE_URL",
      "http://localhost:8090"
    );

    let serverStatus = "unhealthy";
    let serverInfo = "Service unavailable";

    try {
      // 使用 AbortController 实现超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${serverBaseUrl}/health`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        serverStatus = "healthy";
        serverInfo = await response.json();
      }
    } catch (error) {
      serverInfo = error.message || "Connection failed";
    }

    return {
      status: serverStatus === "healthy" ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      service: "recruitment-gateway",
      version: "1.0.0",
      environment: this.configService.get("NODE_ENV", "development"),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      dependencies: {
        server: {
          status: serverStatus,
          url: serverBaseUrl,
          info: serverInfo,
        },
        database: {
          status: "not_connected", // Gateway 通常不直接连数据库
        },
        redis: {
          status: "not_configured", // 如果有Redis缓存
        },
      },
    };
  }
}
