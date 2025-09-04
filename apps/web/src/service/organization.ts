import type {
  GetOrganizationsRequest,
  GetOrganizationsResponse,
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  UpdateOrganizationRequest,
  UpdateOrganizationResponse,
  GetOrganizationResponse,
  InviteUserRequest,
  InviteUserResponse,
  RespondInvitationRequest,
  RespondInvitationResponse,
  GetInvitationsRequest,
  GetInvitationsResponse,
} from "@recruitment/schema";
import { get, post, put, del } from "./xhr/fetch";

/**
 * 组织管理 API 服务
 */
export const organizationApi = {
  /**
   * 获取组织列表
   */
  getOrganizations: (params: GetOrganizationsRequest) =>
    post<GetOrganizationsResponse>("/organizations/page", params),

  /**
   * 获取组织详情
   */
  getOrganization: (id: string) =>
    get<GetOrganizationResponse>(`/organizations/${id}`),

  /**
   * 创建组织
   */
  createOrganization: (data: CreateOrganizationRequest) =>
    post<CreateOrganizationResponse>("/organizations", data),

  /**
   * 更新组织
   */
  updateOrganization: (id: string, data: UpdateOrganizationRequest) =>
    put<UpdateOrganizationResponse>(`/organizations/${id}`, data),

  /**
   * 删除组织
   */
  deleteOrganization: (id: string) => del(`/organizations/${id}`),

  /**
   * 邀请用户加入组织
   */
  inviteUser: (orgId: string, data: InviteUserRequest) =>
    post<InviteUserResponse>(`/organizations/${orgId}/invitations`, data),

  /**
   * 响应组织邀请
   */
  respondInvitation: (invitationId: string, data: RespondInvitationRequest) =>
    post<RespondInvitationResponse>(
      `/organizations/invitations/${invitationId}/respond`,
      data
    ),

  /**
   * 获取邀请列表
   */
  getInvitations: (params: GetInvitationsRequest) =>
    get<GetInvitationsResponse>("/organizations/invitations/list", params),
};
