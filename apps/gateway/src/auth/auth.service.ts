import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@recruitment/database";
import * as bcrypt from "bcryptjs";
import { EmailService } from "../common/services/email.service";
import { VerificationCodeService } from "../common/services/verification-code.service";
import { MenuService } from "./services/menu.service";
import {
  type LoginRequest,
  type RegisterRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
  type RefreshTokenRequest,
  type ChangePasswordRequest,
  type UpdateProfileRequest,
  type SendVerificationCodeRequest,
  type LoginResponse,
  type RegisterResponse,
  type ForgotPasswordResponse,
  type ResetPasswordResponse,
  type RefreshTokenResponse,
  type ChangePasswordResponse,
  type UpdateProfileResponse,
  type SendVerificationCodeResponse,
  type GetCurrentUserResponse,
} from "@recruitment/schema";

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  departments: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  departments: string[];
  isActive: boolean;
}

@Injectable()
export class AuthService {
  private prisma: PrismaClient;
  private readonly serverBaseUrl: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private verificationCodeService: VerificationCodeService,
    private menuService: MenuService
  ) {
    this.prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    });
    this.serverBaseUrl = this.configService.get<string>(
      "SERVER_BASE_URL",
      "http://localhost:8090"
    );
  }

  async validateUser(username: string, password: string): Promise<AuthUser> {
    console.log("验证用户凭据:", { username });

    try {
      // 根据用户名或邮箱查找用户
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ username: username }, { email: username }],
          isDeleted: false, // 排除已删除的用户
          status: "ACTIVE", // 只允许激活状态的用户登录
        },
        include: {
          department: {
            include: {
              parent: true, // 包含父部门信息
            },
          },
          roles: {
            include: {
              role: {
                include: {
                  permissions: true, // 包含权限信息
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new UnauthorizedException("用户不存在或账户已被禁用");
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException("密码错误");
      }

      // 检查邮箱是否已验证（可选，根据业务需求）
      if (!user.emailVerified && user.email) {
        throw new UnauthorizedException("请先验证您的邮箱");
      }

      // 提取角色和权限信息
      const roles = user.roles.map(
        (userRole) => userRole.role.code || userRole.role.name
      );
      const permissions = user.roles.flatMap((userRole) =>
        userRole.role.permissions.map(
          (permission) => permission.code || permission.name
        )
      );

      // 提取部门信息
      const departments = user.department ? [user.department.id] : [];

      return {
        id: user.id,
        email: user.email || "",
        name: user.username,
        roles,
        departments,
        isActive: user.status === "ACTIVE",
      };
    } catch (error) {
      console.error("用户验证失败:", error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("登录验证失败");
    }
  }

  async login(loginDto: LoginRequest): Promise<LoginResponse> {
    try {
      const authUser = await this.validateUser(
        loginDto.username,
        loginDto.password
      );

      const payload: JwtPayload = {
        sub: authUser.id,
        email: authUser.email,
        roles: authUser.roles,
        departments: authUser.departments,
      };

      const token = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });

      // 获取完整的用户信息用于返回
      const userDetail = await this.prisma.user.findUnique({
        where: { id: authUser.id },
        include: {
          department: {
            include: {
              parent: true,
            },
          },
          roles: {
            include: {
              role: {
                include: {
                  permissions: true,
                },
              },
            },
          },
        },
      });

      if (!userDetail) {
        throw new UnauthorizedException("用户信息获取失败");
      }

      // 获取分离的权限
      const [menuPermissions, buttonPermissions] = await Promise.all([
        this.menuService
          .getUserMenus(userDetail.id)
          .then((menus) => menus.map((menu) => menu.code)),
        this.menuService.getUserPermissions(userDetail.id),
      ]);

      // 获取所有权限（兼容旧版本）
      const allPermissions = userDetail.roles.flatMap((userRole) =>
        userRole.role.permissions.map(
          (permission) => permission.code || permission.name
        )
      );

      // 构建返回的用户信息
      const userInfo = {
        id: userDetail.id,
        username: userDetail.username,
        email: userDetail.email || "",
        emailVerified: userDetail.emailVerified,
        employeeNo: userDetail.employeeNo || "",
        phone: userDetail.phone || "",
        status: userDetail.status,
        department: userDetail.department
          ? {
              id: userDetail.department.id,
              name: userDetail.department.name,
              parent: userDetail.department.parent
                ? {
                    id: userDetail.department.parent.id,
                    name: userDetail.department.parent.name,
                  }
                : undefined,
            }
          : undefined,
        roles: userDetail.roles.map((userRole) => ({
          id: userRole.role.id,
          name: userRole.role.name,
          code: userRole.role.code || "",
          description: userRole.role.description || "",
        })),
        permissions: allPermissions,
        menuPermissions: menuPermissions,
        buttonPermissions: buttonPermissions,
        createdAt: userDetail.createdAt.toISOString(),
        updatedAt: userDetail.updatedAt.toISOString(),
      };

      return {
        user: userInfo,
        token,
        refreshToken,
        expiresIn: 3600,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("登录失败");
    }
  }

  async sendVerificationCode(
    dto: SendVerificationCodeRequest
  ): Promise<SendVerificationCodeResponse> {
    // 检查发送频率限制
    if (!this.verificationCodeService.checkRateLimit(dto.email)) {
      throw new BadRequestException("发送过于频繁，请稍后再试");
    }

    // 生成验证码
    const code = this.verificationCodeService.generateCode();

    // 发送邮件
    const emailSent = await this.emailService.sendVerificationCode(
      dto.email,
      code
    );

    if (!emailSent) {
      throw new BadRequestException("邮件发送失败，请稍后重试");
    }

    // 存储验证码
    this.verificationCodeService.storeCode(dto.email, code);

    return {
      success: true,
      message: "验证码已发送，请检查您的邮箱",
      expiresIn: 600, // 10分钟
    };
  }

  async register(registerDto: RegisterRequest): Promise<RegisterResponse> {
    try {
      // 验证邮箱验证码
      const verifyResult = await this.verificationCodeService.verifyCode(
        registerDto.email,
        registerDto.emailVerificationCode
      );

      if (!verifyResult.success) {
        throw new BadRequestException(verifyResult.message);
      }

      // 检查用户名是否已存在
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { username: registerDto.username },
            { email: registerDto.email },
          ],
        },
      });

      if (existingUser) {
        if (existingUser.username === registerDto.username) {
          throw new BadRequestException("用户名已存在");
        }
        if (existingUser.email === registerDto.email) {
          throw new BadRequestException("邮箱已注册");
        }
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      // 创建用户
      const user = await this.prisma.user.create({
        data: {
          username: registerDto.username,
          email: registerDto.email,
          password: hashedPassword,
          emailVerified: true, // 验证码验证通过，直接设置为已验证
          status: "ACTIVE",
        },
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        message: "注册成功！",
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException("注册失败，请稍后重试");
    }
  }

  async forgotPassword(
    dto: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    // 查找用户
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new BadRequestException("用户不存在");
    }

    // 生成密码重置令牌
    const resetToken = this.jwtService.sign(
      { sub: user.id },
      { secret: this.configService.get<string>("JWT_SECRET"), expiresIn: "1h" }
    );

    // 构建重置链接
    const resetUrl = `${this.serverBaseUrl}/auth/reset-password?token=${resetToken}`;

    // 发送重置邮件
    await this.emailService.sendPasswordResetEmail(user.email, resetUrl);

    return { message: "密码重置邮件已发送", success: true };
  }

  async resetPassword(
    dto: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    // 验证令牌
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(dto.token, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });
    } catch (error) {
      throw new BadRequestException("无效或过期的令牌");
    }

    // 更新用户密码
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { password: hashedPassword },
    });

    return { message: "密码已成功重置", success: true };
  }

  async refreshToken(dto: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const decoded = this.jwtService.verify(dto.refreshToken);
    const payload: JwtPayload = {
      sub: decoded.sub,
      email: decoded.email,
      roles: decoded.roles,
      departments: decoded.departments,
    };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });

    return { token, refreshToken, expiresIn: 3600 };
  }

  async getCurrentUser(userId: string): Promise<GetCurrentUserResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
          isDeleted: false,
          status: "ACTIVE",
        },
        include: {
          department: {
            include: {
              parent: true,
            },
          },
          roles: {
            include: {
              role: {
                include: {
                  permissions: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new UnauthorizedException("用户不存在或已被禁用");
      }

      // 获取分离的权限
      const [menuPermissions, buttonPermissions] = await Promise.all([
        this.menuService
          .getUserMenus(userId)
          .then((menus) => menus.map((menu) => menu.code)),
        this.menuService.getUserPermissions(userId),
      ]);

      // 获取所有权限（兼容旧版本）
      const allPermissions = user.roles.flatMap((userRole) =>
        userRole.role.permissions.map(
          (permission) => permission.code || permission.name
        )
      );

      return {
        id: user.id,
        username: user.username,
        email: user.email || "",
        emailVerified: user.emailVerified,
        employeeNo: user.employeeNo || "",
        phone: user.phone || "",
        status: user.status,
        department: user.department
          ? {
              id: user.department.id,
              name: user.department.name,
              parent: user.department.parent
                ? {
                    id: user.department.parent.id,
                    name: user.department.parent.name,
                  }
                : undefined,
            }
          : undefined,
        roles: user.roles.map((userRole) => ({
          id: userRole.role.id,
          name: userRole.role.name,
          code: userRole.role.code || "",
          description: userRole.role.description || "",
        })),
        permissions: allPermissions,
        menuPermissions: menuPermissions,
        buttonPermissions: buttonPermissions,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error("获取当前用户失败:", error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("获取用户信息失败");
    }
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> {
    const response = await fetch(`${this.serverBaseUrl}/auth/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-user-id": userId },
      body: JSON.stringify(dto),
    });
    return await response.json();
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    const response = await fetch(`${this.serverBaseUrl}/auth/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-user-id": userId },
      body: JSON.stringify(dto),
    });
    return await response.json();
  }

  generateToken(user: AuthUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      departments: user.departments,
    };
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verify(token);
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
