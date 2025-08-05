import { z } from "zod";
import {
  UUIDSchema,
  PaginationParamsSchema,
  DepartmentStatusSchema,
} from "./common.schema.js";

// 基础部门信息
export const DepartmentBaseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  status: DepartmentStatusSchema,
  level: z.number(),
  parentId: UUIDSchema.optional(),
  leaderId: UUIDSchema.optional(),
});

// 完整部门信息
export const DepartmentDetailSchema = DepartmentBaseSchema.extend({
  parent: z
    .object({
      id: UUIDSchema,
      name: z.string(),
    })
    .optional(),
  leader: z
    .object({
      id: UUIDSchema,
      username: z.string(),
      email: z.string().optional(),
    })
    .optional(),
  org: z
    .object({
      id: UUIDSchema,
      name: z.string(),
    })
    .optional(),
  children: z.array(DepartmentBaseSchema).optional(),
  userCount: z.number().optional(),
  postCount: z.number().optional(),
  candidateCount: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 获取部门列表请求
export const GetDepartmentsRequestSchema = PaginationParamsSchema.extend({
  keyword: z.string().optional(),
  status: DepartmentStatusSchema.optional(),
  parentId: UUIDSchema.optional(),
  leaderId: UUIDSchema.optional(),
  orgId: UUIDSchema.optional(),
  includeChildren: z.boolean().optional().default(false),
});

// 获取部门列表响应
export const GetDepartmentsResponseSchema = z.object({
  departments: z.array(
    DepartmentDetailSchema.extend({
      children: z
        .array(
          DepartmentBaseSchema.extend({
            userCount: z.number(),
            postCount: z.number(),
          })
        )
        .optional(),
    })
  ),
});

// 获取部门详情响应
export const GetDepartmentDetailResponseSchema = DepartmentDetailSchema.extend({
  users: z
    .array(
      z.object({
        id: UUIDSchema,
        username: z.string(),
        email: z.string().optional(),
        status: z.string(),
        roles: z.array(
          z.object({
            id: UUIDSchema,
            name: z.string(),
            code: z.string(),
          })
        ),
      })
    )
    .optional(),
  posts: z
    .array(
      z.object({
        id: UUIDSchema,
        name: z.string(),
        status: z.string(),
        candidateCount: z.number(),
      })
    )
    .optional(),
});

// 创建部门请求
export const CreateDepartmentRequestSchema = z.object({
  name: z.string().min(1, "部门名称不能为空").max(50, "部门名称最多50位"),
  parentId: UUIDSchema.optional(),
  leaderId: UUIDSchema.optional(),
  orgId: UUIDSchema.optional(),
  status: DepartmentStatusSchema.optional().default("ACTIVE"),
});

// 创建部门响应
export const CreateDepartmentResponseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  status: DepartmentStatusSchema,
  level: z.number(),
  parent: z
    .object({
      id: UUIDSchema,
      name: z.string(),
    })
    .optional(),
  leader: z
    .object({
      id: UUIDSchema,
      username: z.string(),
    })
    .optional(),
});

// 更新部门请求
export const UpdateDepartmentRequestSchema = z.object({
  name: z
    .string()
    .min(1, "部门名称不能为空")
    .max(50, "部门名称最多50位")
    .optional(),
  parentId: UUIDSchema.optional(),
  leaderId: UUIDSchema.optional(),
  status: DepartmentStatusSchema.optional(),
});

// 更新部门响应
export const UpdateDepartmentResponseSchema = CreateDepartmentResponseSchema;

// 删除部门响应
export const DeleteDepartmentResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// 批量导入部门请求
export const BatchImportDepartmentsRequestSchema = z.object({
  departments: z
    .array(
      z.object({
        name: z.string().min(1, "部门名称不能为空").max(50, "部门名称最多50位"),
        parentName: z.string().optional(),
        leaderEmployeeNo: z.string().optional(),
        orgName: z.string().optional(),
      })
    )
    .min(1, "导入部门列表不能为空"),
});

// 批量导入部门响应
export const BatchImportDepartmentsResponseSchema = z.object({
  success: z.number(),
  failed: z.number(),
  errors: z.array(
    z.object({
      row: z.number(),
      name: z.string(),
      error: z.string(),
    })
  ),
});

// 部门树形结构
export const DepartmentTreeSchema: z.ZodType<any> = z.lazy(() =>
  DepartmentBaseSchema.extend({
    parent: DepartmentBaseSchema.optional(),
    leader: z
      .object({
        id: UUIDSchema,
        username: z.string(),
      })
      .optional(),
    children: z.array(DepartmentTreeSchema).optional(),
    userCount: z.number(),
    postCount: z.number(),
  })
);

// 获取部门树请求
export const GetDepartmentTreeRequestSchema = z.object({
  includeDisabled: z.boolean().optional().default(false),
  maxLevel: z.number().int().positive().optional(),
  orgId: UUIDSchema.optional(),
});

// 获取部门树响应
export const GetDepartmentTreeResponseSchema = z.object({
  tree: z.array(DepartmentTreeSchema),
});

// 移动部门请求
export const MoveDepartmentRequestSchema = z.object({
  targetParentId: UUIDSchema.optional(),
});

// 移动部门响应
export const MoveDepartmentResponseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  level: z.number(),
  parent: z
    .object({
      id: UUIDSchema,
      name: z.string(),
    })
    .optional(),
});

// 类型导出
export type DepartmentBase = z.infer<typeof DepartmentBaseSchema>;
export type DepartmentDetail = z.infer<typeof DepartmentDetailSchema>;
export type GetDepartmentsRequest = z.infer<typeof GetDepartmentsRequestSchema>;
export type GetDepartmentsResponse = z.infer<
  typeof GetDepartmentsResponseSchema
>;
export type GetDepartmentDetailResponse = z.infer<
  typeof GetDepartmentDetailResponseSchema
>;
export type CreateDepartmentRequest = z.infer<
  typeof CreateDepartmentRequestSchema
>;
export type CreateDepartmentResponse = z.infer<
  typeof CreateDepartmentResponseSchema
>;
export type UpdateDepartmentRequest = z.infer<
  typeof UpdateDepartmentRequestSchema
>;
export type UpdateDepartmentResponse = z.infer<
  typeof UpdateDepartmentResponseSchema
>;
export type DeleteDepartmentResponse = z.infer<
  typeof DeleteDepartmentResponseSchema
>;
export type BatchImportDepartmentsRequest = z.infer<
  typeof BatchImportDepartmentsRequestSchema
>;
export type BatchImportDepartmentsResponse = z.infer<
  typeof BatchImportDepartmentsResponseSchema
>;
export type DepartmentTree = z.infer<typeof DepartmentTreeSchema>;
export type GetDepartmentTreeRequest = z.infer<
  typeof GetDepartmentTreeRequestSchema
>;
export type GetDepartmentTreeResponse = z.infer<
  typeof GetDepartmentTreeResponseSchema
>;
export type MoveDepartmentRequest = z.infer<typeof MoveDepartmentRequestSchema>;
export type MoveDepartmentResponse = z.infer<
  typeof MoveDepartmentResponseSchema
>;
