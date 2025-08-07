import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // 读取 SMTP 配置
    const smtpConfig = {
      host: this.configService.get("SMTP_HOST", "smtp.qq.com"),
      port: this.configService.get("SMTP_PORT", 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get("SMTP_USER", "your-email@qq.com"),
        pass: this.configService.get("SMTP_PASS", "your-app-password"),
      },
    };

    // 打印当前配置状态（隐藏敏感信息）
    console.log("📧 邮件服务配置状态:");
    console.log(`  📡 SMTP服务器: ${smtpConfig.host}:${smtpConfig.port}`);
    console.log(`  👤 用户名: ${smtpConfig.auth.user}`);
    console.log(`  🔐 密码: ${smtpConfig.auth.pass ? "已配置" : "未配置"}`);

    // 检查是否为测试环境配置
    if (smtpConfig.host === "sandbox.smtp.mailtrap.io") {
      console.log("  ⚠️  当前使用 Mailtrap 测试环境，邮件不会真实发送");
      console.log("  📱 请访问 https://mailtrap.io/ 查看拦截的邮件");
    } else if (
      smtpConfig.auth.user.includes("your-") ||
      smtpConfig.auth.pass.includes("your-")
    ) {
      console.log("  ❌ 检测到默认配置，邮件将使用模拟模式");
    } else {
      console.log("  ✅ 配置真实邮件服务，将发送真实邮件");
    }
    console.log("");

    this.transporter = nodemailer.createTransport(smtpConfig);
  }

  /**
   * 发送邮箱验证码
   */
  async sendVerificationCode(email: string, code: string): Promise<boolean> {
    try {
      // 检查是否配置了真实的 SMTP 服务
      const smtpHost = this.configService.get("SMTP_HOST");
      const smtpUser = this.configService.get("SMTP_USER");
      const smtpPass = this.configService.get("SMTP_PASS");

      // 如果没有配置真实的 SMTP 服务，则模拟发送
      if (
        !smtpHost ||
        !smtpUser ||
        !smtpPass ||
        smtpUser === "your-email@qq.com" ||
        smtpPass === "your-app-password" ||
        smtpUser === "your_mailtrap_username"
      ) {
        console.log("=== 开发环境 - 模拟邮件发送 ===");
        console.log(`收件人: ${email}`);
        console.log(`验证码: ${code}`);
        console.log("邮件内容: 您的验证码是: " + code + "，有效期10分钟");
        console.log("================================");
        return true;
      }

      // 发送真实邮件
      console.log(`=== 发送邮件到: ${email} ===`);
      console.log(`SMTP服务器: ${smtpHost}`);

      const mailOptions = {
        from: this.configService.get(
          "SMTP_FROM",
          '"招聘系统" <your-email@qq.com>'
        ),
        to: email,
        subject: "【招聘系统】邮箱验证码",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">邮箱验证码</h2>
            <p>您好！</p>
            <p>您正在注册招聘系统账号，您的邮箱验证码是：</p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px;">${code}</span>
            </div>
            <p style="color: #666;">验证码有效期为 <strong>10分钟</strong>，请及时使用。</p>
            <p style="color: #666;">如果这不是您的操作，请忽略此邮件。</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">此邮件由招聘系统自动发送，请勿回复。</p>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("✅ 邮件发送成功!");
      console.log(`📧 MessageID: ${result.messageId}`);
      console.log(`📬 收件人: ${email}`);
      console.log(`🔐 验证码: ${code}`);
      console.log("================================");
      return true;
    } catch (error) {
      console.error("❌ 邮件发送失败:", error);
      return false;
    }
  }

  /**
   * 发送密码重置邮件
   */
  async sendPasswordResetEmail(
    email: string,
    resetUrl: string
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get(
          "SMTP_FROM",
          '"招聘系统" <your-email@qq.com>'
        ),
        to: email,
        subject: "【招聘系统】密码重置",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">密码重置</h2>
            <p>您好！</p>
            <p>您请求重置招聘系统账号密码，请点击下面的链接进行密码重置：</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">重置密码</a>
            </div>
            <p style="color: #666;">如果按钮无法点击，请复制以下链接到浏览器地址栏：</p>
            <p style="color: #007bff; word-break: break-all;">${resetUrl}</p>
            <p style="color: #666;">此链接有效期为 <strong>1小时</strong>，请及时使用。</p>
            <p style="color: #666;">如果这不是您的操作，请忽略此邮件。</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">此邮件由招聘系统自动发送，请勿回复。</p>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("密码重置邮件发送成功:", result.messageId);
      return true;
    } catch (error) {
      console.error("密码重置邮件发送失败:", error);
      return false;
    }
  }
}
