import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

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
    email: string,
    password: string
  ): Promise<AuthUser | null> {
    try {
      // 调用 server 服务验证用户
      const response = await fetch(`${this.serverBaseUrl}/auth/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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

  async login(
    user: AuthUser
  ): Promise<{ access_token: string; user: AuthUser }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      departments: user.departments,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        departments: user.departments,
        isActive: user.isActive,
      },
    };
  }

  async register(registerDto: any): Promise<{ message: string }> {
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

      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("注册服务暂时不可用");
    }
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }

  async refreshToken(user: AuthUser): Promise<{ access_token: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      departments: user.departments,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
