import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import * as cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "./common/filter/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["debug", "error", "warn", "log"],
  });

  // 安全配置
  app.use(helmet());

  // 配置 Cookie Parser
  app.use(cookieParser());

  // 启用 CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],
    credentials: true,
  });

  // 🎯 使用 Zod 验证的优势：
  // 1. 前后端共享 schema
  // 2. TypeScript-first，类型安全
  // 3. 强大的转换和验证能力
  // 4. 函数式 API，易于组合
  //
  // 注意：不使用全局 ValidationPipe，改用路由级别的 ZodValidation

  // 全局路由前缀
  app.setGlobalPrefix("api");

  // 环境变量配置
  const port = parseInt(process.env.GATEWAY_PORT) || 8080;
  const nodeEnv = process.env.NODE_ENV || "development";

  await app.listen(port);

  console.log(`🚀 Gateway server is running on port ${port}`);
  console.log(`📋 API Gateway URL: http://localhost:${port}/api`);
  console.log(`🌍 Environment: ${nodeEnv}`);
}

bootstrap();
