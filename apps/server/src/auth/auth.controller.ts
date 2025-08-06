import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  LoginResponse,
  RegisterResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ChangePasswordResponse,
  UpdateProfileResponse,
  GetCurrentUserResponse,
  ActivateResponse,
} from '@recruitment/schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 用户注册
   * 注意：这里不需要认证，因为是新用户注册
   */
  @Post('register')
  async register(
    @Body() registerDto: RegisterRequest,
  ): Promise<RegisterResponse> {
    return this.authService.register(registerDto);
  }

  /**
   * 激活账户
   * 注意：这里不需要认证，因为是通过邮件链接激活
   */
  @Post('activate/:token')
  async activate(@Param('token') token: string): Promise<ActivateResponse> {
    return this.authService.activate(token);
  }

  /**
   * 忘记密码
   * 注意：这里不需要认证，因为是忘记密码的场景
   */
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * 重置密码
   * 注意：这里不需要认证，因为是通过邮件链接重置
   */
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * 修改密码
   * 注意：用户ID从 Gateway 通过请求头传递过来
   */
  @Put('change-password')
  async changePassword(
    @Headers('x-user-id') userId: string,
    @Body() changePasswordDto: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    return this.authService.changePassword(userId, changePasswordDto);
  }

  /**
   * 更新个人信息
   * 注意：用户ID从 Gateway 通过请求头传递过来
   */
  @Put('profile')
  async updateProfile(
    @Headers('x-user-id') userId: string,
    @Body() updateProfileDto: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> {
    return this.authService.updateProfile(userId, updateProfileDto);
  }

  /**
   * 获取当前用户信息
   * 注意：用户ID从 Gateway 通过请求头传递过来
   */
  @Get('me')
  async getCurrentUser(
    @Headers('x-user-id') userId: string,
  ): Promise<GetCurrentUserResponse> {
    return this.authService.getUserById(userId);
  }

  /**
   * 验证用户凭据（供 Gateway 调用）
   * 这是一个内部 API，用于 Gateway 验证用户登录
   */
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateUser(@Body() loginDto: LoginRequest): Promise<any> {
    // 这里需要实现用户验证逻辑
    console.log('验证用户凭据:', loginDto);

    // 实际业务逻辑：
    // const user = await this.prisma.user.findFirst({
    //   where: {
    //     OR: [
    //       { username: loginDto.username },
    //       { email: loginDto.username }
    //     ]
    //   },
    //   include: {
    //     department: true,
    //     roles: {
    //       include: {
    //         permissions: true
    //       }
    //     }
    //   }
    // });

    // if (!user || !bcrypt.compareSync(loginDto.password, user.password)) {
    //   throw new UnauthorizedException('用户名或密码错误');
    // }

    // Mock 返回数据
    return {
      id: '550e8400-e29b-41d4-a716-446655440000',
      username: loginDto.username,
      email: 'user@example.com',
      name: '测试用户',
      roles: ['user'],
      departments: ['tech'],
      isActive: true,
    };
  }

  /**
   * 登录业务逻辑（供 Gateway 调用）
   * 返回用户完整信息，不包含 token（token 由 Gateway 生成）
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginRequest,
  ): Promise<Omit<LoginResponse, 'token' | 'refreshToken' | 'expiresIn'>> {
    console.log('用户登录业务逻辑:', loginDto);

    // 这里只处理登录相关的业务逻辑，如更新最后登录时间、记录登录日志等
    // 实际的用户验证由 Gateway 通过 /auth/validate 端点处理

    const mockUserData = {
      user: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        username: loginDto.username,
        email: 'user@example.com',
        emailVerified: true,
        employeeNo: 'EMP001',
        phone: '13812345678',
        status: 'ACTIVE' as const,
        department: {
          id: 'dept-001',
          name: '技术部',
          parent: {
            id: 'dept-parent',
            name: '研发中心',
          },
        },
        roles: [
          {
            id: 'role-001',
            name: '开发者',
            code: 'developer',
            description: '软件开发人员',
          },
        ],
        permissions: ['user:read', 'post:read', 'candidate:read'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    return mockUserData;
  }

  /**
   * 刷新令牌（供 Gateway 调用）
   * 这里主要处理刷新令牌相关的业务逻辑，实际的 JWT 处理由 Gateway 完成
   */
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: any): Promise<any> {
    console.log('刷新令牌业务逻辑:', refreshTokenDto);

    // 这里可以处理一些业务逻辑，比如：
    // 1. 记录刷新日志
    // 2. 检查用户状态是否仍然有效
    // 3. 更新用户活跃时间

    // 返回用户基本信息供 Gateway 生成新的 token
    return {
      user: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        username: 'testuser',
        email: 'user@example.com',
        roles: ['user'],
        departments: ['tech'],
        isActive: true,
      },
    };
  }
}
