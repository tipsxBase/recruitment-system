export { PrismaClient } from "@prisma/client";
export * from "@prisma/client";

// 导出一个创建数据库连接的工厂函数
import { PrismaClient } from "@prisma/client";

export function createPrismaClient() {
  return new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });
}

// 单例模式的数据库连接
let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = createPrismaClient();
  }
  return prismaInstance;
}
