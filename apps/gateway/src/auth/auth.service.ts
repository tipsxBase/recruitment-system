import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@recruitment/database";
import * as bcrypt from "bcryptjs";
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
  private prisma: PrismaClient;
  private readonly serverBaseUrl: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
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
    console.log("验证用户凭据:", { username, password });

    // Mock 返回数据 - 实际实现时替换为真正的数据库查询
    return {
      id: "550e8400-e29b-41d4-a716-446655440000",
      email: "user@example.com",
      name: "测试用户",
      roles: ["user"],
      departments: ["tech"],
      isActive: true,
    };
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

      return {
        user: {
          id: authUser.id,
          username: authUser.name,
          email: authUser.email,
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
        token,
        refreshToken,
        expiresIn: 3600,
      };
    } catch (error) {
      throw new UnauthorizedException("登录失败");
    }
  }

  async register(registerDto: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${this.serverBaseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerDto),
    });
    return await response.json();
  }

  async activate(token: string): Promise<ActivateResponse> {
    const response = await fetch(
      `${this.serverBaseUrl}/auth/activate/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    return await response.json();
  }

  async forgotPassword(
    dto: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    const response = await fetch(`${this.serverBaseUrl}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return await response.json();
  }

  async resetPassword(
    dto: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    const response = await fetch(`${this.serverBaseUrl}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return await response.json();
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
    return {
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
