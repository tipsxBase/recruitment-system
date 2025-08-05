import { z } from "zod";
import {
  UUIDSchema,
  PaginationParamsSchema,
  PermissionTypeSchema,
} from "./common.schema.js";

// 权限基础信息
export const PermissionBaseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  code: z.string(),
  type: PermissionTypeSchema,
  parentId: UUIDSchema.optional(),
});

// 权限详细信息
export const PermissionDetailSchema = PermissionBaseSchema.extend({
  parent: PermissionBaseSchema.optional(),
  children: z.array(PermissionBaseSchema).optional(),
  path: z.string().optional(),
  icon: z.string().optional(),
  sort: z.number().optional(),
  hidden: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 权限树形结构
export const PermissionTreeSchema: z.ZodType<any> = z.lazy(() =>
  PermissionDetailSchema.extend({
    children: z.array(PermissionTreeSchema).optional(),
  })
);

// 角色基础信息
export const RoleBaseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  code: z.string(),
  description: z.string().optional(),
  isSystem: z.boolean(),
});

// 角色详细信息
export const RoleDetailSchema = RoleBaseSchema.extend({
  permissions: z.array(PermissionDetailSchema),
  userCount: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 获取角色列表请求
export const GetRolesRequestSchema = PaginationParamsSchema.extend({
  keyword: z.string().optional(),
  isSystem: z.boolean().optional(),
});

// 获取角色列表响应
export const GetRolesResponseSchema = z.object({
  roles: z.array(
    RoleDetailSchema.extend({
      permissions: z.array(PermissionBaseSchema),
    })
  ),
});

// 获取权限列表响应
export const GetPermissionsResponseSchema = z.object({
  permissions: z.array(PermissionTreeSchema),
});

// 创建角色请求
export const CreateRoleRequestSchema = z.object({
  name: z.string().min(1, "角色名称不能为空").max(50, "角色名称最多50位"),
  code: z
    .string()
    .min(1, "角色编码不能为空")
    .max(50, "角色编码最多50位")
    .regex(/^[A-Z_]+$/, "角色编码只能包含大写字母和下划线"),
  description: z.string().max(200, "描述最多200位").optional(),
  permissionIds: z.array(UUIDSchema).min(1, "至少选择一个权限"),
});

// 创建角色响应
export const CreateRoleResponseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  code: z.string(),
  description: z.string().optional(),
  isSystem: z.boolean(),
  permissions: z.array(PermissionBaseSchema),
});

// 更新角色请求
export const UpdateRoleRequestSchema = z.object({
  name: z
    .string()
    .min(1, "角色名称不能为空")
    .max(50, "角色名称最多50位")
    .optional(),
  description: z.string().max(200, "描述最多200位").optional(),
  permissionIds: z.array(UUIDSchema).optional(),
});

// 更新角色响应
export const UpdateRoleResponseSchema = CreateRoleResponseSchema;

// 删除角色响应
export const DeleteRoleResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// 菜单项
export const MenuItemSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: UUIDSchema,
    name: z.string(),
    code: z.string(),
    type: PermissionTypeSchema,
    path: z.string().optional(),
    icon: z.string().optional(),
    sort: z.number(),
    hidden: z.boolean(),
    children: z.array(MenuItemSchema).optional(),
  })
);

// 获取用户菜单响应
export const GetUserMenuResponseSchema = z.object({
  menus: z.array(MenuItemSchema),
  buttons: z.array(z.string()),
});

// 检查权限请求
export const CheckPermissionRequestSchema = z.object({
  permission: z.string(),
  resource: z.string().optional(),
  action: z.string().optional(),
});

// 检查权限响应
export const CheckPermissionResponseSchema = z.object({
  hasPermission: z.boolean(),
  reason: z.string().optional(),
});

// 权限申请请求
export const PermissionRequestSchema = z.object({
  permissionIds: z.array(UUIDSchema).min(1, "至少选择一个权限"),
  reason: z.string().min(1, "申请理由不能为空").max(500, "申请理由最多500位"),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

// 权限申请响应
export const PermissionRequestResponseSchema = z.object({
  id: UUIDSchema,
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  submittedAt: z.string(),
});

// 权限申请列表请求
export const GetPermissionRequestsRequestSchema = PaginationParamsSchema.extend(
  {
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    applicantId: UUIDSchema.optional(),
    approverId: UUIDSchema.optional(),
  }
);

// 权限申请列表响应
export const GetPermissionRequestsResponseSchema = z.object({
  requests: z.array(
    z.object({
      id: UUIDSchema,
      applicant: z.object({
        id: UUIDSchema,
        username: z.string(),
        department: z
          .object({
            id: UUIDSchema,
            name: z.string(),
          })
          .optional(),
      }),
      permissions: z.array(PermissionBaseSchema),
      reason: z.string(),
      urgency: z.enum(["LOW", "MEDIUM", "HIGH"]),
      status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
      approver: z
        .object({
          id: UUIDSchema,
          username: z.string(),
        })
        .optional(),
      approvalReason: z.string().optional(),
      submittedAt: z.string(),
      processedAt: z.string().optional(),
    })
  ),
});

// 处理权限申请请求
export const ProcessPermissionRequestSchema = z.object({
  action: z.enum(["approve", "reject"]),
  reason: z.string().optional(),
});

// 处理权限申请响应
export const ProcessPermissionRequestResponseSchema = z.object({
  id: UUIDSchema,
  status: z.enum(["APPROVED", "REJECTED"]),
  processedAt: z.string(),
});

// 批量授权请求
export const BatchGrantPermissionsRequestSchema = z.object({
  userIds: z.array(UUIDSchema).min(1, "用户ID列表不能为空"),
  roleIds: z.array(UUIDSchema).min(1, "角色ID列表不能为空"),
  operation: z.enum(["grant", "revoke"]).default("grant"),
});

// 批量授权响应
export const BatchGrantPermissionsResponseSchema = z.object({
  success: z.number(),
  failed: z.number(),
  errors: z.array(
    z.object({
      userId: UUIDSchema,
      username: z.string(),
      error: z.string(),
    })
  ),
});

// 类型导出
export type PermissionBase = z.infer<typeof PermissionBaseSchema>;
export type PermissionDetail = z.infer<typeof PermissionDetailSchema>;
export type PermissionTree = z.infer<typeof PermissionTreeSchema>;
export type RoleBase = z.infer<typeof RoleBaseSchema>;
export type RoleDetail = z.infer<typeof RoleDetailSchema>;
export type GetRolesRequest = z.infer<typeof GetRolesRequestSchema>;
export type GetRolesResponse = z.infer<typeof GetRolesResponseSchema>;
export type GetPermissionsResponse = z.infer<
  typeof GetPermissionsResponseSchema
>;
export type CreateRoleRequest = z.infer<typeof CreateRoleRequestSchema>;
export type CreateRoleResponse = z.infer<typeof CreateRoleResponseSchema>;
export type UpdateRoleRequest = z.infer<typeof UpdateRoleRequestSchema>;
export type UpdateRoleResponse = z.infer<typeof UpdateRoleResponseSchema>;
export type DeleteRoleResponse = z.infer<typeof DeleteRoleResponseSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type GetUserMenuResponse = z.infer<typeof GetUserMenuResponseSchema>;
export type CheckPermissionRequest = z.infer<
  typeof CheckPermissionRequestSchema
>;
export type CheckPermissionResponse = z.infer<
  typeof CheckPermissionResponseSchema
>;
export type PermissionRequest = z.infer<typeof PermissionRequestSchema>;
export type PermissionRequestResponse = z.infer<
  typeof PermissionRequestResponseSchema
>;
export type GetPermissionRequestsRequest = z.infer<
  typeof GetPermissionRequestsRequestSchema
>;
export type GetPermissionRequestsResponse = z.infer<
  typeof GetPermissionRequestsResponseSchema
>;
export type ProcessPermissionRequest = z.infer<
  typeof ProcessPermissionRequestSchema
>;
export type ProcessPermissionRequestResponse = z.infer<
  typeof ProcessPermissionRequestResponseSchema
>;
export type BatchGrantPermissionsRequest = z.infer<
  typeof BatchGrantPermissionsRequestSchema
>;
export type BatchGrantPermissionsResponse = z.infer<
  typeof BatchGrantPermissionsResponseSchema
>;
