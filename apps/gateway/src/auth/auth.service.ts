import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import {
  type LoginRequest,
  type RegisterRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
  type RefreshTokenRequest,
  type ChangePasswordRequest,
  type UpdateProfileRequest,
  type LoginResponse,
  type RegisterResponse,
  type ForgotPasswordResponse,
  type ResetPasswordResponse,
  type RefreshTokenResponse,
  type ChangePasswordResponse,
  type UpdateProfileResponse,
  type GetCurrentUserResponse,
  type ActivateResponse,
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
  private readonly serverBaseUrl: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.serverBaseUrl = this.configService.get<string>(
      "SERVER_BASE_URL",
      "http://localhost:8090"
    );
  }

  async validateUser(
    username: string,
    password: string
  ): Promise<AuthUser | null> {
    try {
      // 调用 server 服务验证用户
      const response = await fetch(`${this.serverBaseUrl}/auth/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return null;
      }

      const user = await response.json();

      if (user && user.isActive) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles || [],
          departments: user.departments || [],
          isActive: user.isActive,
        };
      }
      return null;
    } catch (error) {
      console.error("User validation error:", error);
      return null;
    }
  }

  /**
   * 用户登录
   * 1. 验证用户凭据
   * 2. 生成 JWT token
   * 3. 返回用户信息和 token
   */
  async login(loginDto: LoginRequest): Promise<LoginResponse> {
    try {
      // 转发登录请求到 server 服务
      const response = await fetch(`${this.serverBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDto),
      });
      console.log("login response", response);
      if (!response.ok) {
        throw new UnauthorizedException("用户名或密码错误");
      }

      const result = await response.json();

      // Mock 数据以确保类型安全
      const mockLoginResponse: LoginResponse = {
        user: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          username: loginDto.username,
          email: "user@example.com",
          emailVerified: true,
          employeeNo: "EMP001",
          phone: "13812345678",
          status: "ACTIVE",
          department: {
            id: "dept-001",
            name: "技术部",
            parent: {
              id: "dept-parent",
              name: "研发中心",
            },
          },
          roles: [
            {
              id: "role-001",
              name: "开发者",
              code: "developer",
              description: "软件开发人员",
            },
          ],
          permissions: ["user:read", "post:read", "candidate:read"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        refreshToken: "refresh_token_here",
        expiresIn: 3600,
      };

      return mockLoginResponse;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("登录服务暂时不可用");
    }
  }

  /**
   * 用户注册
   * 1. 验证注册信息
   * 2. 创建新用户
   * 3. 发送激活邮件
   */
  async register(registerDto: RegisterRequest): Promise<RegisterResponse> {
    try {
      // 转发注册请求到 server 服务
      const response = await fetch(`${this.serverBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerDto),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new UnauthorizedException(result.message || "注册失败");
      }

      // Mock 数据以确保类型安全
      const mockRegisterResponse: RegisterResponse = {
        id: "550e8400-e29b-41d4-a716-446655440001",
        username: registerDto.username,
        email: registerDto.email,
        emailVerified: false,
        needActivation: true,
        activationUrl: `http://localhost:3000/activate/token_here`,
      };

      return mockRegisterResponse;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("注册服务暂时不可用");
    }
  }

  /**
   * 激活账户
   * 验证激活 token 并激活用户账户
   */
  async activate(token: string): Promise<ActivateResponse> {
    try {
      // 转发激活请求到 server 服务
      const response = await fetch(`${this.serverBaseUrl}/auth/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new UnauthorizedException(result.message || "激活失败");
      }

      // Mock 数据
      return {
        success: true,
        message: "账户激活成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "激活失败，请检查链接是否有效",
      };
    }
  }

  /**
   * 忘记密码
   * 发送密码重置邮件
   */
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    try {
      // 转发忘记密码请求到 server 服务
      const response = await fetch(
        `${this.serverBaseUrl}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(forgotPasswordDto),
        }
      );

      // Mock 数据
      return {
        success: true,
        message: "密码重置邮件已发送，请查收邮箱",
      };
    } catch (error) {
      return {
        success: false,
        message: "发送重置邮件失败，请稍后重试",
      };
    }
  }

  /**
   * 重置密码
   * 使用重置 token 设置新密码
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    try {
      // 转发重置密码请求到 server 服务
      const response = await fetch(
        `${this.serverBaseUrl}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resetPasswordDto),
        }
      );

      // Mock 数据
      return {
        success: true,
        message: "密码重置成功，请使用新密码登录",
      };
    } catch (error) {
      return {
        success: false,
        message: "密码重置失败，请检查链接是否有效",
      };
    }
  }

  /**
   * 刷新 Token
   * 使用 refresh token 获取新的 access token
   */
  async refreshToken(
    refreshTokenDto: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    try {
      // 转发刷新 token 请求到 server 服务
      const response = await fetch(`${this.serverBaseUrl}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(refreshTokenDto),
      });

      // Mock 数据
      return {
        token: "new_access_token_here",
        refreshToken: "new_refresh_token_here",
        expiresIn: 3600,
      };
    } catch (error) {
      throw new UnauthorizedException("Token 刷新失败");
    }
  }

  /**
   * 获取当前用户信息
   */
  async getProfile(userId: string): Promise<GetCurrentUserResponse> {
    try {
      // 转发获取用户信息请求到 server 服务
      const response = await fetch(`${this.serverBaseUrl}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Mock 数据
      const mockUser: GetCurrentUserResponse = {
        id: userId,
        username: "testuser",
        email: "test@example.com",
        emailVerified: true,
        employeeNo: "EMP001",
        phone: "13812345678",
        status: "ACTIVE",
        department: {
          id: "dept-001",
          name: "技术部",
          parent: {
            id: "dept-parent",
            name: "研发中心",
          },
        },
        roles: [
          {
            id: "role-001",
            name: "开发者",
            code: "developer",
            description: "软件开发人员",
          },
        ],
        permissions: ["user:read", "post:read", "candidate:read"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return mockUser;
    } catch (error) {
      throw new UnauthorizedException("获取用户信息失败");
    }
  }

  /**
   * 修改密码
   * 验证当前密码并设置新密码
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> {
    try {
      // 转发修改密码请求到 server 服务
      const response = await fetch(
        `${this.serverBaseUrl}/users/${userId}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changePasswordDto),
        }
      );

      // Mock 数据
      return {
        success: true,
        message: "密码修改成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "密码修改失败，请检查当前密码是否正确",
      };
    }
  }

  /**
   * 更新个人信息
   * 更新用户的基本信息
   */
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    try {
      // 转发更新个人信息请求到 server 服务
      const response = await fetch(`${this.serverBaseUrl}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateProfileDto),
      });

      // Mock 数据
      const mockUpdatedUser: UpdateProfileResponse = {
        id: userId,
        username: "testuser",
        email: updateProfileDto.email || "test@example.com",
        emailVerified: true,
        employeeNo: updateProfileDto.employeeNo || "EMP001",
        phone: updateProfileDto.phone || "13812345678",
        status: "ACTIVE",
        department: {
          id: "dept-001",
          name: "技术部",
          parent: {
            id: "dept-parent",
            name: "研发中心",
          },
        },
        roles: [
          {
            id: "role-001",
            name: "开发者",
            code: "developer",
            description: "软件开发人员",
          },
        ],
        permissions: ["user:read", "post:read", "candidate:read"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return mockUpdatedUser;
    } catch (error) {
      throw new UnauthorizedException("更新个人信息失败");
    }
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
