import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module";
import { ProxyModule } from "./proxy/proxy.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),

    // 限流模块
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 1000, // 1 秒
        limit: 3, // 每秒最多 3 次请求
      },
      {
        name: "medium",
        ttl: 10000, // 10 秒
        limit: 20, // 每 10 秒最多 20 次请求
      },
      {
        name: "long",
        ttl: 60000, // 1 分钟
        limit: 100, // 每分钟最多 100 次请求
      },
    ]),

    AuthModule,
    HealthModule,
    ProxyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
