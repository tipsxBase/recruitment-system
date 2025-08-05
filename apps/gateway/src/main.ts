import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["debug", "error", "warn", "log"],
  });

  // 安全配置
  app.use(helmet());

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

  const port = process.env.GATEWAY_PORT || 8080;
  await app.listen(port);

  console.log(`🚀 Gateway server is running on port ${port}`);
  console.log(`📋 API Gateway URL: http://localhost:${port}/api`);
}

bootstrap();
