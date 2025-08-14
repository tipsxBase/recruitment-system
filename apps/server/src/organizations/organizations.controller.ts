import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import {
  GetOrganizationsRequestSchema,
  CreateOrganizationRequestSchema,
  UpdateOrganizationRequestSchema,
  InviteUserRequestSchema,
  RespondInvitationRequestSchema,
  GetInvitationsRequestSchema,
  type GetOrganizationsRequest,
  type CreateOrganizationRequest,
  type UpdateOrganizationRequest,
  type InviteUserRequest,
  type RespondInvitationRequest,
  type GetInvitationsRequest,
} from '@recruitment/schema';
import { CurrentUser, User } from '@/common/current-user.decorator';

@Controller('organizations')
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  /**
   * 验证超级管理员权限
   */
  private validateSuperAdminPermission(userRole: string) {
    if (userRole !== 'SUPER_ADMIN') {
      throw new BadRequestException('仅超级管理员可执行此操作');
    }
  }

  /**
   * 获取组织列表
   * 权限：仅超级管理员可访问
   * GET /api/v1/organizations
   */
  @Get()
  async getOrganizations(@Query() query: GetOrganizationsRequest) {
    // 验证查询参数
    const validatedQuery = GetOrganizationsRequestSchema.parse(query);

    return this.organizationsService.getOrganizations(validatedQuery);
  }

  /**
   * 获取组织详情
   * 权限：超级管理员或组织成员
   * GET /api/v1/organizations/:id
   */
  @Get(':id')
  async getOrganization(@Param('id') id: string) {
    return this.organizationsService.getOrganization(id);
  }

  /**
   * 创建组织
   * 权限：仅超级管理员可操作
   * POST /api/v1/organizations
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrganization(@Body() body: CreateOrganizationRequest) {
    // 验证请求参数
    const validatedData = CreateOrganizationRequestSchema.parse(body);

    return this.organizationsService.createOrganization(validatedData);
  }

  /**
   * 更新组织
   * 权限：仅超级管理员可操作
   * PUT /api/v1/organizations/:id
   */
  @Put(':id')
  async updateOrganization(
    @Param('id') id: string,
    @Body() body: UpdateOrganizationRequest,
  ) {
    // 验证请求参数
    const validatedData = UpdateOrganizationRequestSchema.parse(body);

    return this.organizationsService.updateOrganization(id, validatedData);
  }

  /**
   * 删除组织
   * 权限：仅超级管理员可操作
   * DELETE /api/v1/organizations/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrganization(@Param('id') id: string) {
    await this.organizationsService.deleteOrganization(id);
  }

  /**
   * 邀请用户加入组织
   * 权限：组织管理员
   * POST /api/v1/organizations/:orgId/invitations
   */
  @Post(':orgId/invitations')
  @HttpCode(HttpStatus.CREATED)
  async inviteUser(
    @Param('orgId') orgId: string,
    @Body() body: InviteUserRequest,
    @CurrentUser() currentUser: User,
  ) {
    // 验证请求参数
    const validatedData = InviteUserRequestSchema.parse(body);

    return this.organizationsService.inviteUser(
      orgId,
      currentUser.id,
      validatedData,
    );
  }

  /**
   * 响应组织邀请
   * 权限：被邀请用户
   * POST /api/v1/organizations/invitations/:invitationId/respond
   */
  @Post('invitations/:invitationId/respond')
  async respondInvitation(
    @Param('invitationId') invitationId: string,
    @Body() body: RespondInvitationRequest,
    @CurrentUser() currentUser: User,
  ) {
    // 验证请求参数
    const validatedData = RespondInvitationRequestSchema.parse(body);

    return this.organizationsService.respondInvitation(
      invitationId,
      currentUser.id,
      validatedData,
    );
  }

  /**
   * 获取邀请列表
   * 权限：当前用户相关的邀请
   * GET /api/v1/organizations/invitations
   */
  @Get('invitations/list')
  async getInvitations(
    @Query() query: GetInvitationsRequest,
    @CurrentUser() currentUser: User,
  ) {
    // 验证查询参数
    const validatedQuery = GetInvitationsRequestSchema.parse(query);

    return this.organizationsService.getInvitations(
      currentUser.id,
      validatedQuery,
    );
  }
}
