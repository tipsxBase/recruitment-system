import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
          departments: {
            include: {
              department: true,
            },
          },
        },
      });

      if (!user || !user.isActive) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map((ur) => ur.role.name),
        departments: user.departments.map((ud) => ud.department.name),
        isActive: user.isActive,
      };
    } catch (error) {
      console.error('User validation error:', error);
      return null;
    }
  }

  async register(registerDto: any) {
    try {
      // 检查邮箱是否已存在
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('邮箱已被使用');
      }

      // 检查工号是否已存在（如果提供了工号）
      if (registerDto.workId) {
        const existingWorkId = await this.prisma.user.findUnique({
          where: { workId: registerDto.workId },
        });

        if (existingWorkId) {
          throw new BadRequestException('工号已被使用');
        }
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      // 创建用户
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
          phone: registerDto.phone,
          workId: registerDto.workId,
          isActive: false, // 需要管理员激活
        },
      });

      return {
        message: '注册成功，请等待管理员审核激活',
        userId: user.id,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Registration error:', error);
      throw new BadRequestException('注册失败，请稍后重试');
    }
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        departments: {
          include: {
            department: true,
          },
        },
      },
    });
  }
}
