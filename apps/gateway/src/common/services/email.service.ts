import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // 读取 SMTP 配置
    const smtpHost = this.configService.get("SMTP_HOST", "smtp.qq.com");
    const smtpUser = this.configService.get("SMTP_USER", "your-email@qq.com");
    const smtpPass = this.configService.get("SMTP_PASS", "your-app-password");

    let smtpConfig: any = {
      host: smtpHost,
      port: this.configService.get("SMTP_PORT", 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    };

    // 检查是否为Outlook/Hotmail邮箱，需要特殊配置
    if (smtpHost === "smtp-mail.outlook.com" || smtpHost === "smtp.live.com") {
      smtpConfig = {
        ...smtpConfig,
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          ciphers: "SSLv3",
          rejectUnauthorized: false,
        },
      };
    }

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
      smtpConfig.host === "smtp-mail.outlook.com" ||
      smtpConfig.host === "smtp.live.com"
    ) {
      console.log("  📮 检测到 Outlook/Hotmail 邮箱配置");
      if (
        smtpConfig.auth.user.includes("your-") ||
        smtpConfig.auth.pass.includes("your-")
      ) {
        console.log("  ❌ 检测到默认配置，邮件将使用模拟模式");
      } else {
        console.log(
          "  ⚠️  重要提示：Outlook邮箱需要使用应用专用密码，不能使用普通密码"
        );
        console.log(
          "  🔗 获取应用专用密码: https://account.live.com/proofs/AppPassword"
        );
      }
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
        subject: `【招聘系统】邮箱验证码${code}`,
        html: `
          <!DOCTYPE html>
          <html lang="zh-CN">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>邮箱验证码</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
              <!-- 头部 -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <div style="display: inline-block; background-color: rgba(255,255,255,0.2); border-radius: 50%; padding: 15px; margin-bottom: 20px;">
                  <div style="width: 40px; height: 40px; background-color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 20px; color: #667eea;">✉️</span>
                  </div>
                </div>
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">邮箱验证码</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">招聘系统</p>
              </div>
              
              <!-- 内容区域 -->
              <div style="padding: 40px 30px;">
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">您好！</p>
                <p style="color: #666666; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">感谢您注册招聘系统，请使用以下验证码完成邮箱验证：</p>
                
                <!-- 验证码卡片 -->
                <div style="background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); border-radius: 16px; padding: 30px; text-align: center; margin: 30px 0; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); pointer-events: none;"></div>
                  <p style="color: rgba(255,255,255,0.9); margin: 0 0 15px 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">验证码</p>
                  <div style="background-color: rgba(255,255,255,0.2); border-radius: 12px; padding: 20px; margin: 0 auto; display: inline-block; backdrop-filter: blur(10px);">
                    <span style="font-size: 36px; font-weight: bold; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${code}</span>
                  </div>
                </div>
                
                <!-- 提示信息 -->
                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px 20px; border-radius: 0 8px 8px 0; margin: 25px 0;">
                  <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
                    <span style="font-weight: 600;">⏰ 重要提醒：</span> 验证码有效期为 <strong>10分钟</strong>，请及时使用。为了您的账户安全，请勿将验证码分享给他人。
                  </p>
                </div>
                
                <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">如果这不是您的操作，请忽略此邮件。您的账户安全不会受到影响。</p>
              </div>
              
              <!-- 底部 -->
              <div style="background-color: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e9ecef;">
                <div style="text-align: center;">
                  <p style="color: #6c757d; margin: 0; font-size: 12px; line-height: 1.5;">此邮件由招聘系统自动发送，请勿回复</p>
                  <p style="color: #adb5bd; margin: 10px 0 0 0; font-size: 11px;">© 2025 招聘系统. 保留所有权利.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
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

      // 为Outlook邮箱提供特殊的错误处理和建议
      if (
        error.code === "EAUTH" &&
        error.response?.includes("basic authentication is disabled")
      ) {
        console.error("💡 Outlook邮箱错误解决方案:");
        console.error("   1. 不能使用普通密码，必须使用「应用专用密码」");
        console.error("   2. 获取应用专用密码步骤:");
        console.error(
          "      • 登录 https://account.live.com/proofs/AppPassword"
        );
        console.error("      • 点击「创建新的应用专用密码」");
        console.error("      • 输入应用名称（如：招聘系统）");
        console.error("      • 复制生成的16位密码到 SMTP_PASS 配置中");
        console.error("   3. 确保账户已启用两步验证");
      }

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
          <!DOCTYPE html>
          <html lang="zh-CN">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>密码重置</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
              <!-- 头部 -->
              <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 40px 30px; text-align: center;">
                <div style="display: inline-block; background-color: rgba(255,255,255,0.2); border-radius: 50%; padding: 15px; margin-bottom: 20px;">
                  <div style="width: 40px; height: 40px; background-color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 20px; color: #ff6b6b;">🔒</span>
                  </div>
                </div>
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">密码重置</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">招聘系统</p>
              </div>
              
              <!-- 内容区域 -->
              <div style="padding: 40px 30px;">
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">您好！</p>
                <p style="color: #666666; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">我们收到了您的密码重置请求。请点击下方按钮来重置您的招聘系统账号密码：</p>
                
                <!-- 重置按钮 -->
                <div style="text-align: center; margin: 35px 0;">
                  <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    🔑 重置我的密码
                  </a>
                </div>
                
                <!-- 备用链接 -->
                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0;">
                  <p style="color: #495057; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">如果按钮无法正常工作，请复制以下链接到浏览器地址栏：</p>
                  <div style="background-color: #ffffff; border: 2px dashed #dee2e6; border-radius: 6px; padding: 15px; word-break: break-all;">
                    <span style="color: #007bff; font-size: 13px; font-family: 'Courier New', monospace;">${resetUrl}</span>
                  </div>
                </div>
                
                <!-- 安全提醒 -->
                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px 20px; border-radius: 0 8px 8px 0; margin: 25px 0;">
                  <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
                    <span style="font-weight: 600;">🛡️ 安全提醒：</span>
                  </p>
                  <ul style="color: #856404; margin: 10px 0 0 0; padding-left: 20px; font-size: 13px; line-height: 1.6;">
                    <li>此链接有效期为 <strong>1小时</strong>，请及时使用</li>
                    <li>链接仅能使用一次，使用后自动失效</li>
                    <li>请勿将此链接分享给他人</li>
                  </ul>
                </div>
                
                <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px 20px; border-radius: 0 8px 8px 0; margin: 25px 0;">
                  <p style="color: #155724; margin: 0; font-size: 14px; line-height: 1.5;">
                    <span style="font-weight: 600;">💡 温馨提示：</span> 如果这不是您的操作，请忽略此邮件。您的账户安全不会受到任何影响，无需采取进一步行动。
                  </p>
                </div>
              </div>
              
              <!-- 底部 -->
              <div style="background-color: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e9ecef;">
                <div style="text-align: center;">
                  <p style="color: #6c757d; margin: 0; font-size: 12px; line-height: 1.5;">此邮件由招聘系统自动发送，请勿回复</p>
                  <p style="color: #adb5bd; margin: 10px 0 0 0; font-size: 11px;">© 2025 招聘系统. 保留所有权利.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("密码重置邮件发送成功:", result.messageId);
      return true;
    } catch (error) {
      console.error("密码重置邮件发送失败:", error);

      // 为Outlook邮箱提供特殊的错误处理和建议
      if (
        error.code === "EAUTH" &&
        error.response?.includes("basic authentication is disabled")
      ) {
        console.error("💡 Outlook邮箱错误解决方案:");
        console.error("   1. 不能使用普通密码，必须使用「应用专用密码」");
        console.error("   2. 获取应用专用密码步骤:");
        console.error(
          "      • 登录 https://account.live.com/proofs/AppPassword"
        );
        console.error("      • 点击「创建新的应用专用密码」");
        console.error("      • 输入应用名称（如：招聘系统）");
        console.error("      • 复制生成的16位密码到 SMTP_PASS 配置中");
        console.error("   3. 确保账户已启用两步验证");
      }

      return false;
    }
  }
}
