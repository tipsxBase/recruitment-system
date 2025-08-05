import { z } from "zod";
import {
  UUIDSchema,
  EmailSchema,
  PhoneSchema,
  EmployeeNoSchema,
  PaginationParamsSchema,
  UserStatusSchema,
} from "./common.schema.js";

// 基础用户信息
export const UserBaseSchema = z.object({
  id: UUIDSchema,
  username: z.string(),
  email: z.string().optional(),
  emailVerified: z.boolean(),
  employeeNo: z.string().optional(),
  phone: z.string().optional(),
  status: UserStatusSchema,
});

// 完整用户信息
export const UserDetailSchema = UserBaseSchema.extend({
  department: z
    .object({
      id: UUIDSchema,
      name: z.string(),
      parent: z
        .object({
          id: UUIDSchema,
          name: z.string(),
        })
        .optional(),
    })
    .optional(),
  roles: z.array(
    z.object({
      id: UUIDSchema,
      name: z.string(),
      code: z.string(),
      description: z.string().optional(),
    })
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 获取用户列表请求
export const GetUsersRequestSchema = PaginationParamsSchema.extend({
  keyword: z.string().optional(),
  status: UserStatusSchema.optional(),
  departmentId: UUIDSchema.optional(),
  roleId: UUIDSchema.optional(),
  emailVerified: z.boolean().optional(),
});

// 获取用户列表响应
export const GetUsersResponseSchema = z.object({
  users: z.array(
    UserDetailSchema.extend({
      department: z
        .object({
          id: UUIDSchema,
          name: z.string(),
        })
        .optional(),
      roles: z.array(
        z.object({
          id: UUIDSchema,
          name: z.string(),
          code: z.string(),
        })
      ),
    })
  ),
});

// 获取用户详情响应
export const GetUserDetailResponseSchema = UserDetailSchema;

// 创建用户请求
export const CreateUserRequestSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少3位")
    .max(20, "用户名最多20位")
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
  email: EmailSchema.optional(),
  phone: PhoneSchema.optional(),
  employeeNo: EmployeeNoSchema.optional(),
  password: z.string().min(6, "密码至少6位").max(50, "密码最多50位"),
  departmentId: UUIDSchema.optional(),
  roleIds: z.array(UUIDSchema).min(1, "至少分配一个角色"),
  status: UserStatusSchema.optional().default("ACTIVE"),
});

// 创建用户响应
export const CreateUserResponseSchema = z.object({
  id: UUIDSchema,
  username: z.string(),
  email: z.string().optional(),
  status: UserStatusSchema,
  department: z
    .object({
      id: UUIDSchema,
      name: z.string(),
    })
    .optional(),
  roles: z.array(
    z.object({
      id: UUIDSchema,
      name: z.string(),
      code: z.string(),
    })
  ),
});

// 更新用户请求
export const UpdateUserRequestSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少3位")
    .max(20, "用户名最多20位")
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线")
    .optional(),
  email: EmailSchema.optional(),
  phone: PhoneSchema.optional(),
  employeeNo: EmployeeNoSchema.optional(),
  departmentId: UUIDSchema.optional(),
  roleIds: z.array(UUIDSchema).optional(),
  status: UserStatusSchema.optional(),
});

// 更新用户响应
export const UpdateUserResponseSchema = CreateUserResponseSchema;

// 批量导入用户请求
export const BatchImportUsersRequestSchema = z.object({
  users: z
    .array(
      z.object({
        username: z
          .string()
          .min(3, "用户名至少3位")
          .max(20, "用户名最多20位")
          .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
        email: EmailSchema.optional(),
        phone: PhoneSchema.optional(),
        employeeNo: EmployeeNoSchema.optional(),
        password: z.string().min(6, "密码至少6位"),
        departmentId: UUIDSchema.optional(),
        roleIds: z.array(UUIDSchema).min(1, "至少分配一个角色"),
      })
    )
    .min(1, "导入用户列表不能为空"),
});

// 批量导入用户响应
export const BatchImportUsersResponseSchema = z.object({
  success: z.number(),
  failed: z.number(),
  errors: z.array(
    z.object({
      row: z.number(),
      username: z.string(),
      error: z.string(),
    })
  ),
});

// 重置用户密码请求
export const ResetUserPasswordRequestSchema = z.object({
  password: z.string().min(6, "密码至少6位").max(50, "密码最多50位"),
});

// 重置用户密码响应
export const ResetUserPasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  tempPassword: z.string().optional(),
});

// 批量分配角色请求
export const BatchAssignRolesRequestSchema = z.object({
  userIds: z.array(UUIDSchema).min(1, "用户ID列表不能为空"),
  roleIds: z.array(UUIDSchema).min(1, "角色ID列表不能为空"),
  operation: z.enum(["add", "remove", "replace"]).default("add"),
});

// 批量分配角色响应
export const BatchAssignRolesResponseSchema = z.object({
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

// 用户导出请求
export const ExportUsersRequestSchema = z.object({
  filters: GetUsersRequestSchema.omit({
    page: true,
    pageSize: true,
  }).optional(),
  format: z.enum(["xlsx", "csv"]).default("xlsx"),
});

// 用户导出响应
export const ExportUsersResponseSchema = z.object({
  downloadUrl: z.string(),
  filename: z.string(),
  expiresAt: z.string(),
});

// 类型导出
export type UserBase = z.infer<typeof UserBaseSchema>;
export type UserDetail = z.infer<typeof UserDetailSchema>;
export type GetUsersRequest = z.infer<typeof GetUsersRequestSchema>;
export type GetUsersResponse = z.infer<typeof GetUsersResponseSchema>;
export type GetUserDetailResponse = z.infer<typeof GetUserDetailResponseSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;
export type BatchImportUsersRequest = z.infer<
  typeof BatchImportUsersRequestSchema
>;
export type BatchImportUsersResponse = z.infer<
  typeof BatchImportUsersResponseSchema
>;
export type ResetUserPasswordRequest = z.infer<
  typeof ResetUserPasswordRequestSchema
>;
export type ResetUserPasswordResponse = z.infer<
  typeof ResetUserPasswordResponseSchema
>;
export type BatchAssignRolesRequest = z.infer<
  typeof BatchAssignRolesRequestSchema
>;
export type BatchAssignRolesResponse = z.infer<
  typeof BatchAssignRolesResponseSchema
>;
export type ExportUsersRequest = z.infer<typeof ExportUsersRequestSchema>;
export type ExportUsersResponse = z.infer<typeof ExportUsersResponseSchema>;
