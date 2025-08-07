import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { VerificationCodeService } from "../services/verification-code.service";

@Injectable()
export class CleanupTask {
  private readonly logger = new Logger(CleanupTask.name);

  constructor(
    private readonly verificationCodeService: VerificationCodeService
  ) {}

  /**
   * 每小时清理一次过期的验证码
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredVerificationCodes() {
    this.logger.log("开始清理过期验证码...");

    try {
      const count = await this.verificationCodeService.cleanupExpiredCodes();
      this.logger.log(`清理完成，删除了 ${count} 条过期验证码`);
    } catch (error) {
      this.logger.error("清理过期验证码时发生错误:", error);
    }
  }

  /**
   * 每天凌晨2点进行深度清理
   * 清理超过24小时的所有验证码记录
   */
  @Cron("0 2 * * *")
  async deepCleanup() {
    this.logger.log("开始深度清理验证码...");

    try {
      // 这里可以添加更复杂的清理逻辑
      // 比如清理超过24小时的记录，即使还没过期
      const count = await this.verificationCodeService.cleanupExpiredCodes();
      this.logger.log(`深度清理完成，删除了 ${count} 条记录`);
    } catch (error) {
      this.logger.error("深度清理时发生错误:", error);
    }
  }
}
