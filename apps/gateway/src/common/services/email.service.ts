import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // 在生产环境中，这些配置应该从环境变量读取
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("SMTP_HOST", "smtp.qq.com"),
      port: this.configService.get("SMTP_PORT", 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get("SMTP_USER", "your-email@qq.com"),
        pass: this.configService.get("SMTP_PASS", "your-app-password"),
      },
    });
  }

  /**
   * 发送邮箱验证码
   */
  async sendVerificationCode(email: string, code: string): Promise<boolean> {
    try {
      // 开发环境模拟邮件发送
      if (process.env.NODE_ENV !== "production") {
        console.log("=== 开发环境 - 模拟邮件发送 ===");
        console.log(`收件人: ${email}`);
        console.log(`验证码: ${code}`);
        console.log("邮件内容: 您的验证码是: " + code + "，有效期10分钟");
        console.log("================================");
        return true;
      }

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
      console.log("邮件发送成功:", result.messageId);
      return true;
    } catch (error) {
      console.error("邮件发送失败:", error);
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
