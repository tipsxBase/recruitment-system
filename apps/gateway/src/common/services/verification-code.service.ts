import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@recruitment/database";

@Injectable()
export class VerificationCodeService {
  private prisma: PrismaClient;

  // 验证码配置
  private readonly CODE_LENGTH = 6;
  private readonly CODE_EXPIRES_IN: number; // 毫秒
  private readonly MAX_ATTEMPTS: number;
  private readonly RATE_LIMIT_WINDOW: number; // 毫秒

  constructor(private configService: ConfigService) {
    this.prisma = new PrismaClient();

    // 从环境变量读取配置
    this.CODE_EXPIRES_IN =
      this.configService.get("VERIFICATION_CODE_EXPIRES_MINUTES", 10) *
      60 *
      1000;
    this.MAX_ATTEMPTS = this.configService.get(
      "VERIFICATION_CODE_MAX_ATTEMPTS",
      5
    );
    this.RATE_LIMIT_WINDOW =
      this.configService.get("VERIFICATION_CODE_RATE_LIMIT_MINUTES", 1) *
      60 *
      1000;
  }

  /**
   * 生成验证码
   */
  generateCode(): string {
    return Math.random()
      .toString()
      .slice(2, 2 + this.CODE_LENGTH)
      .padStart(this.CODE_LENGTH, "0");
  }

  /**
   * 检查发送频率限制
   */
  async checkRateLimit(email: string): Promise<boolean> {
    const now = new Date();
    const rateLimitTime = new Date(now.getTime() - this.RATE_LIMIT_WINDOW);

    const recentCode = await this.prisma.emailVerificationCode.findFirst({
      where: {
        email,
        createdAt: {
          gte: rateLimitTime,
        },
      },
    });

    return !recentCode;
  }

  /**
   * 存储验证码到数据库
   */
  async storeCode(email: string, code: string): Promise<void> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.CODE_EXPIRES_IN);

    // 删除该邮箱的旧验证码
    await this.prisma.emailVerificationCode.deleteMany({
      where: { email },
    });

    // 存储新验证码
    await this.prisma.emailVerificationCode.create({
      data: {
        email,
        code,
        expiresAt,
        attempts: 0,
      },
    });
  }

  /**
   * 验证验证码
   */
  async verifyCode(
    email: string,
    inputCode: string
  ): Promise<{
    success: boolean;
    message: string;
    remainingAttempts?: number;
  }> {
    const storedData = await this.prisma.emailVerificationCode.findFirst({
      where: { email },
    });

    if (!storedData) {
      return {
        success: false,
        message: "验证码不存在或已过期，请重新获取",
      };
    }

    // 检查是否过期
    if (new Date() > storedData.expiresAt) {
      await this.prisma.emailVerificationCode.delete({
        where: { id: storedData.id },
      });
      return {
        success: false,
        message: "验证码已过期，请重新获取",
      };
    }

    // 检查尝试次数
    if (storedData.attempts >= this.MAX_ATTEMPTS) {
      await this.prisma.emailVerificationCode.delete({
        where: { id: storedData.id },
      });
      return {
        success: false,
        message: "验证失败次数过多，请重新获取验证码",
      };
    }

    // 验证码错误
    if (storedData.code !== inputCode) {
      const newAttempts = storedData.attempts + 1;
      await this.prisma.emailVerificationCode.update({
        where: { id: storedData.id },
        data: { attempts: newAttempts },
      });

      const remainingAttempts = this.MAX_ATTEMPTS - newAttempts;
      return {
        success: false,
        message: `验证码错误，还有 ${remainingAttempts} 次尝试机会`,
        remainingAttempts,
      };
    }

    // 验证成功，删除验证码
    await this.prisma.emailVerificationCode.delete({
      where: { id: storedData.id },
    });

    return {
      success: true,
      message: "验证成功",
    };
  }

  /**
   * 清理过期验证码（定时任务调用）
   */
  async cleanupExpiredCodes(): Promise<number> {
    const now = new Date();
    const result = await this.prisma.emailVerificationCode.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    console.log(`清理过期验证码: ${result.count} 条`);
    return result.count;
  }

  /**
   * 获取验证码剩余有效时间（秒）
   */
  async getTimeRemaining(email: string): Promise<number> {
    const storedData = await this.prisma.emailVerificationCode.findFirst({
      where: { email },
    });

    if (!storedData) return 0;

    const now = new Date();
    const remaining = Math.max(
      0,
      Math.floor((storedData.expiresAt.getTime() - now.getTime()) / 1000)
    );
    return remaining;
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
