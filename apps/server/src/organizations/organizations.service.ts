import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  type GetOrganizationsRequest,
  type GetOrganizationsResponse,
  type CreateOrganizationRequest,
  type CreateOrganizationResponse,
  type UpdateOrganizationRequest,
  type UpdateOrganizationResponse,
  type GetOrganizationResponse,
  type InviteUserRequest,
  type InviteUserResponse,
  type RespondInvitationRequest,
  type RespondInvitationResponse,
  type GetInvitationsRequest,
  type GetInvitationsResponse,
} from '@recruitment/schema';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取组织列表
   * 仅超级管理员可访问
   */
  async getOrganizations(
    query: GetOrganizationsRequest,
  ): Promise<GetOrganizationsResponse> {
    const { page = 1, pageSize = 10, keyword, status } = query;
    const skip = (page - 1) * pageSize;

    // 构建查询条件
    const where: any = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { code: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    // 获取总数
    const total = await this.prisma.organization.count({ where });

    // 获取组织列表
    const organizations = await this.prisma.organization.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        departments: {
          select: { id: true },
        },
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });

    // 统计每个组织的用户数量
    const orgData = await Promise.all(
      organizations.map(async (org) => {
        const userCount = await this.prisma.user.count({
          where: {
            department: {
              orgId: org.id,
            },
            isDeleted: false,
          },
        });

        return {
          id: org.id,
          name: org.name,
          code: org.code ?? undefined,
          status: org.status,
          userCount,
          departmentCount: org._count.departments,
          createdAt: org.createdAt.toISOString(),
          updatedAt: org.updatedAt.toISOString(),
        };
      }),
    );

    const totalPages = Math.ceil(total / pageSize);

    return {
      organizations: orgData,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * 获取组织详情
   */
  async getOrganization(id: string): Promise<GetOrganizationResponse> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('组织不存在');
    }

    // 统计用户数量
    const userCount = await this.prisma.user.count({
      where: {
        department: {
          orgId: organization.id,
        },
        isDeleted: false,
      },
    });

    return {
      id: organization.id,
      name: organization.name,
      code: organization.code ?? undefined,
      status: organization.status,
      userCount,
      departmentCount: organization._count.departments,
      createdAt: organization.createdAt.toISOString(),
      updatedAt: organization.updatedAt.toISOString(),
    };
  }

  /**
   * 创建组织
   * 仅超级管理员可操作
   */
  async createOrganization(
    data: CreateOrganizationRequest,
  ): Promise<CreateOrganizationResponse> {
    const { name, code, adminId } = data;

    // 检查组织名称是否已存在
    const existingByName = await this.prisma.organization.findFirst({
      where: { name },
    });

    if (existingByName) {
      throw new BadRequestException('组织名称已存在');
    }

    // 检查组织编码是否已存在
    if (code) {
      const existingByCode = await this.prisma.organization.findFirst({
        where: { code },
      });

      if (existingByCode) {
        throw new BadRequestException('组织编码已存在');
      }
    }

    // 如果指定了管理员，验证用户是否存在
    if (adminId) {
      const admin = await this.prisma.user.findUnique({
        where: { id: adminId },
      });

      if (!admin) {
        throw new BadRequestException('指定的管理员不存在');
      }
    }

    // 创建组织
    const organization = await this.prisma.organization.create({
      data: {
        name,
        code,
        status: 'ACTIVE',
      },
    });

    // 创建组织根部门
    await this.prisma.department.create({
      data: {
        name: `${name}总部`,
        orgId: organization.id,
        leaderId: adminId,
        level: 1,
        status: 'ACTIVE',
      },
    });

    return {
      id: organization.id,
      name: organization.name,
      code: organization.code ?? undefined,
      status: organization.status,
    };
  }

  /**
   * 更新组织
   * 仅超级管理员可操作
   */
  async updateOrganization(
    id: string,
    data: UpdateOrganizationRequest,
  ): Promise<UpdateOrganizationResponse> {
    const { name, code, status, adminId } = data;

    // 检查组织是否存在
    const existingOrg = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!existingOrg) {
      throw new NotFoundException('组织不存在');
    }

    // 检查组织名称是否已被其他组织使用
    if (name && name !== existingOrg.name) {
      const existingByName = await this.prisma.organization.findFirst({
        where: { name, id: { not: id } },
      });

      if (existingByName) {
        throw new BadRequestException('组织名称已存在');
      }
    }

    // 检查组织编码是否已被其他组织使用
    if (code && code !== existingOrg.code) {
      const existingByCode = await this.prisma.organization.findFirst({
        where: { code, id: { not: id } },
      });

      if (existingByCode) {
        throw new BadRequestException('组织编码已存在');
      }
    }

    // 如果指定了管理员，验证用户是否存在
    if (adminId) {
      const admin = await this.prisma.user.findUnique({
        where: { id: adminId },
      });

      if (!admin) {
        throw new BadRequestException('指定的管理员不存在');
      }
    }

    // 更新组织
    const organization = await this.prisma.organization.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code !== undefined && { code }),
        ...(status && { status }),
      },
    });

    // 如果指定了管理员，更新根部门的负责人
    if (adminId) {
      const rootDepartment = await this.prisma.department.findFirst({
        where: {
          orgId: id,
          parentId: null,
        },
      });

      if (rootDepartment) {
        await this.prisma.department.update({
          where: { id: rootDepartment.id },
          data: { leaderId: adminId },
        });
      }
    }

    return {
      id: organization.id,
      name: organization.name,
      code: organization.code ?? undefined,
      status: organization.status,
    };
  }

  /**
   * 删除组织
   * 仅超级管理员可操作
   */
  async deleteOrganization(id: string): Promise<void> {
    // 检查组织是否存在
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        departments: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('组织不存在');
    }

    // 检查组织下是否还有用户
    const hasUsers = organization.departments.some(
      (dept) => dept.users.length > 0,
    );
    if (hasUsers) {
      throw new BadRequestException('组织下还有用户，无法删除');
    }

    // 删除组织（级联删除部门和邀请）
    await this.prisma.organization.delete({
      where: { id },
    });
  }

  /**
   * 邀请用户加入组织
   * 仅组织管理员可操作
   */
  async inviteUser(
    organizationId: string,
    inviterId: string,
    data: InviteUserRequest,
  ): Promise<InviteUserResponse> {
    const { inviteeId, role, message, expiresIn = 72 } = data;

    // 检查组织是否存在
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('组织不存在');
    }

    // 检查被邀请用户是否存在
    const invitee = await this.prisma.user.findUnique({
      where: { id: inviteeId },
    });

    if (!invitee) {
      throw new BadRequestException('被邀请用户不存在');
    }

    // 检查用户是否已在组织中
    const existingUser = await this.prisma.user.findFirst({
      where: {
        id: inviteeId,
        department: {
          orgId: organizationId,
        },
      },
    });

    if (existingUser) {
      throw new BadRequestException('用户已在组织中');
    }

    // 检查是否已有待处理的邀请
    const existingInvitation =
      await this.prisma.organizationInvitation.findUnique({
        where: {
          organizationId_inviteeId: {
            organizationId,
            inviteeId,
          },
        },
      });

    if (existingInvitation && existingInvitation.status === 'PENDING') {
      throw new BadRequestException('已存在待处理的邀请');
    }

    // 如果存在过期或已处理的邀请，删除旧邀请
    if (existingInvitation) {
      await this.prisma.organizationInvitation.delete({
        where: { id: existingInvitation.id },
      });
    }

    // 计算过期时间
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresIn);

    // 创建邀请
    const invitation = await this.prisma.organizationInvitation.create({
      data: {
        organizationId,
        inviterId,
        inviteeId,
        role,
        message,
        expiresAt,
        status: 'PENDING',
      },
      include: {
        invitee: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    // TODO: 发送邀请通知

    return {
      id: invitation.id,
      invitee: {
        id: invitation.invitee.id,
        username: invitation.invitee.username,
        email: invitation.invitee.email ?? undefined,
      },
      role: invitation.role,
      expiresAt: invitation.expiresAt.toISOString(),
    };
  }

  /**
   * 响应组织邀请
   */
  async respondInvitation(
    invitationId: string,
    userId: string,
    data: RespondInvitationRequest,
  ): Promise<RespondInvitationResponse> {
    const { action } = data;

    // 查找邀请
    const invitation = await this.prisma.organizationInvitation.findUnique({
      where: { id: invitationId },
      include: {
        organization: true,
        inviter: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundException('邀请不存在');
    }

    // 验证是否为被邀请人
    if (invitation.inviteeId !== userId) {
      throw new ForbiddenException('无权限响应此邀请');
    }

    // 检查邀请状态
    if (invitation.status !== 'PENDING') {
      throw new BadRequestException('邀请已处理');
    }

    // 检查邀请是否过期
    if (new Date() > invitation.expiresAt) {
      await this.prisma.organizationInvitation.update({
        where: { id: invitationId },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('邀请已过期');
    }

    // 更新邀请状态
    await this.prisma.organizationInvitation.update({
      where: { id: invitationId },
      data: {
        status: action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED',
        respondedAt: new Date(),
      },
    });

    let userOrganization;

    if (action === 'ACCEPT') {
      // 将用户加入组织（通过分配到根部门）
      const rootDepartment = await this.prisma.department.findFirst({
        where: {
          orgId: invitation.organizationId,
          parentId: null,
        },
      });

      if (rootDepartment) {
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            departmentId: rootDepartment.id,
          },
        });

        userOrganization = {
          id: invitation.organizationId,
          role: invitation.role,
          joinedAt: new Date().toISOString(),
        };
      }

      // TODO: 分配角色权限
    }

    // TODO: 发送响应通知给邀请人

    return {
      success: true,
      message: action === 'ACCEPT' ? '已成功加入组织' : '已拒绝邀请',
      userOrganization,
    };
  }

  /**
   * 获取邀请列表
   */
  async getInvitations(
    userId: string,
    query: GetInvitationsRequest,
  ): Promise<GetInvitationsResponse> {
    const { page = 1, pageSize = 10, organizationId, status, type } = query;
    const skip = (page - 1) * pageSize;

    // 构建查询条件
    const where: any = {};

    if (organizationId) {
      where.organizationId = organizationId;
    }

    if (status) {
      where.status = status;
    }

    // 根据类型过滤
    if (type === 'sent') {
      where.inviterId = userId;
    } else if (type === 'received') {
      where.inviteeId = userId;
    } else {
      // 默认返回用户相关的所有邀请
      where.OR = [{ inviterId: userId }, { inviteeId: userId }];
    }

    // 获取总数
    const total = await this.prisma.organizationInvitation.count({ where });

    // 获取邀请列表
    const invitations = await this.prisma.organizationInvitation.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        inviter: {
          select: {
            id: true,
            username: true,
          },
        },
        invitee: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    const invitationData = invitations.map((inv) => ({
      id: inv.id,
      organizationId: inv.organizationId,
      organization: {
        id: inv.organization.id,
        name: inv.organization.name,
      },
      inviterId: inv.inviterId,
      inviter: {
        id: inv.inviter.id,
        username: inv.inviter.username,
      },
      inviteeId: inv.inviteeId,
      invitee: {
        id: inv.invitee.id,
        username: inv.invitee.username,
        email: inv.invitee.email ?? undefined,
      },
      role: inv.role,
      message: inv.message ?? undefined,
      status: inv.status as 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED',
      expiresAt: inv.expiresAt.toISOString(),
      createdAt: inv.createdAt.toISOString(),
      updatedAt: inv.updatedAt.toISOString(),
    }));

    const totalPages = Math.ceil(total / pageSize);

    return {
      invitations: invitationData,
      total,
      page,
      pageSize,
      totalPages,
    };
  }
}
