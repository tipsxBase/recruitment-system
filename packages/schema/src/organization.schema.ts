import { z } from "zod";
import {
  PaginationParamsSchema,
  PaginatedResponseSchema,
} from "./common.schema";

// ================== 基础类型定义 ==================

export const OrganizationStatusSchema = z.enum(["ACTIVE", "DISABLED"]);
export type OrganizationStatus = z.infer<typeof OrganizationStatusSchema>;

export const InvitationStatusSchema = z.enum([
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
]);
export type InvitationStatus = z.infer<typeof InvitationStatusSchema>;

export const InvitationActionSchema = z.enum(["ACCEPT", "REJECT"]);
export type InvitationAction = z.infer<typeof InvitationActionSchema>;

// ================== 组织数据模型 ==================

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().optional(),
  status: OrganizationStatusSchema,
  admin: z
    .object({
      id: z.string(),
      username: z.string(),
    })
    .optional(),
  userCount: z.number(),
  departmentCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Organization = z.infer<typeof OrganizationSchema>;

export const OrganizationInvitationSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  organization: z.object({
    id: z.string(),
    name: z.string(),
  }),
  inviterId: z.string(),
  inviter: z.object({
    id: z.string(),
    username: z.string(),
  }),
  inviteeId: z.string(),
  invitee: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string().optional(),
  }),
  role: z.string(),
  message: z.string().optional(),
  status: InvitationStatusSchema,
  expiresAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type OrganizationInvitation = z.infer<
  typeof OrganizationInvitationSchema
>;

// ================== 请求参数 Schema ==================

// 获取组织列表
export const GetOrganizationsRequestSchema = PaginationParamsSchema.extend({
  keyword: z.string().optional(),
  status: OrganizationStatusSchema.optional(),
});
export type GetOrganizationsRequest = z.infer<
  typeof GetOrganizationsRequestSchema
>;

// 创建组织
export const CreateOrganizationRequestSchema = z.object({
  name: z
    .string()
    .min(1, "组织名称不能为空")
    .max(100, "组织名称不能超过100个字符"),
  code: z.string().max(50, "组织编码不能超过50个字符").optional(),
  adminId: z.string().uuid("管理员ID格式不正确").optional(),
});
export type CreateOrganizationRequest = z.infer<
  typeof CreateOrganizationRequestSchema
>;

// 更新组织
export const UpdateOrganizationRequestSchema = z.object({
  name: z
    .string()
    .min(1, "组织名称不能为空")
    .max(100, "组织名称不能超过100个字符")
    .optional(),
  code: z.string().max(50, "组织编码不能超过50个字符").optional(),
  status: OrganizationStatusSchema.optional(),
  adminId: z.string().uuid("管理员ID格式不正确").optional(),
});
export type UpdateOrganizationRequest = z.infer<
  typeof UpdateOrganizationRequestSchema
>;

// 邀请用户加入组织
export const InviteUserRequestSchema = z.object({
  inviteeId: z.string().uuid("被邀请用户ID格式不正确"),
  role: z.string().min(1, "角色不能为空"),
  message: z.string().max(500, "邀请消息不能超过500个字符").optional(),
  expiresIn: z.number().min(1).max(168).optional(), // 1小时到7天（168小时）
});
export type InviteUserRequest = z.infer<typeof InviteUserRequestSchema>;

// 响应组织邀请
export const RespondInvitationRequestSchema = z.object({
  action: InvitationActionSchema,
});
export type RespondInvitationRequest = z.infer<
  typeof RespondInvitationRequestSchema
>;

// 获取组织邀请列表
export const GetInvitationsRequestSchema = PaginationParamsSchema.extend({
  organizationId: z.string().uuid().optional(),
  status: InvitationStatusSchema.optional(),
  type: z.enum(["sent", "received"]).optional(), // sent: 我发出的邀请, received: 我收到的邀请
});
export type GetInvitationsRequest = z.infer<typeof GetInvitationsRequestSchema>;

// ================== 响应数据 Schema ==================

// 获取组织列表响应
export const GetOrganizationsResponseSchema = z.object({
  organizations: z.array(OrganizationSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});
export type GetOrganizationsResponse = z.infer<
  typeof GetOrganizationsResponseSchema
>;

// 创建组织响应
export const CreateOrganizationResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().optional(),
  status: OrganizationStatusSchema,
});
export type CreateOrganizationResponse = z.infer<
  typeof CreateOrganizationResponseSchema
>;

// 更新组织响应
export const UpdateOrganizationResponseSchema =
  CreateOrganizationResponseSchema;
export type UpdateOrganizationResponse = z.infer<
  typeof UpdateOrganizationResponseSchema
>;

// 获取组织详情响应
export const GetOrganizationResponseSchema = OrganizationSchema;
export type GetOrganizationResponse = z.infer<
  typeof GetOrganizationResponseSchema
>;

// 邀请用户响应
export const InviteUserResponseSchema = z.object({
  id: z.string(),
  invitee: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string().optional(),
  }),
  role: z.string(),
  expiresAt: z.string(),
});
export type InviteUserResponse = z.infer<typeof InviteUserResponseSchema>;

// 响应邀请响应
export const RespondInvitationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  userOrganization: z
    .object({
      id: z.string(),
      role: z.string(),
      joinedAt: z.string(),
    })
    .optional(),
});
export type RespondInvitationResponse = z.infer<
  typeof RespondInvitationResponseSchema
>;

// 获取邀请列表响应
export const GetInvitationsResponseSchema = z.object({
  invitations: z.array(OrganizationInvitationSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});
export type GetInvitationsResponse = z.infer<
  typeof GetInvitationsResponseSchema
>;

// ================== 错误响应 Schema ==================

export const OrganizationErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.any()).optional(),
});
export type OrganizationError = z.infer<typeof OrganizationErrorSchema>;
