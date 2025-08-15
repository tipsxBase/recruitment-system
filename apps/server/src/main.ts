import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'warn', 'log'],
  });

  // CORS 配置：仅用于浏览器访问，服务间调用不需要
  // 生产环境建议关闭，仅允许 Gateway 访问
  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: [
        'http://localhost:3000', // Web Frontend (开发调试)
        'http://localhost:8080', // Gateway (虽然不需要，但保持一致)
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-User-Id',
        'X-User-Email',
        'X-User-Roles',
        'X-User-Departments',
      ],
    });
    console.log('🌐 CORS enabled for development');
  } else {
    // 生产环境：不启用 CORS，仅接受服务间调用
    console.log('🔒 CORS disabled for production (server-to-server only)');
  }

  // 全局验证管道 - 暂时简化配置用于调试
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // 暂时移除这些选项进行调试
      // whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 8090);

  console.log(
    `🚀 Server service is running on port ${process.env.PORT ?? 8090}`,
  );
}
bootstrap();
