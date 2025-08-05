/**
 * 招聘系统 Schema 使用示例
 */

import { z } from "zod";
import {
  // 通用类型
  PaginationParamsSchema,
  ApiResponseSchema,

  // 认证相关
  LoginRequestSchema,
  RegisterRequestSchema,

  // 用户管理
  CreateUserRequestSchema,
  GetUsersRequestSchema,

  // 部门管理
  CreateDepartmentRequestSchema,
  GetDepartmentTreeRequestSchema,

  // 岗位管理
  CreatePostRequestSchema,
  GetPostsRequestSchema,

  // 候选人管理
  CreateCandidateRequestSchema,
  UpdateCandidateStatusRequestSchema,

  // 面试管理
  CreateInterviewRequestSchema,
  SubmitFeedbackRequestSchema,

  // 类型导出
  type LoginRequest,
  type CreateUserRequest,
  type CreateCandidateRequest,
  type PaginationParams,
} from "./index.js";

// 示例：校验登录请求
function validateLoginRequest(data: unknown): LoginRequest {
  return LoginRequestSchema.parse(data);
}

// 示例：校验创建用户请求
function validateCreateUserRequest(data: unknown): CreateUserRequest {
  const result = CreateUserRequestSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.message}`);
  }
  return result.data;
}

// 示例：校验分页参数
function validatePaginationParams(
  params: Record<string, any>
): PaginationParams {
  // 使用默认值
  const defaultParams = {
    page: 1,
    pageSize: 10,
  };

  return PaginationParamsSchema.parse({
    ...defaultParams,
    ...params,
  });
}

// 示例：创建 API 响应
function createApiResponse<T>(data: T, success = true, message = "Success") {
  const response = {
    success,
    code: success ? 200 : 400,
    message,
    data,
  };

  return ApiResponseSchema(CreateCandidateRequestSchema).parse(response);
}

// 示例：条件校验
function validateCandidateUpdate(data: unknown, isPartial = false) {
  if (isPartial) {
    // 部分更新，所有字段都是可选的
    return CreateCandidateRequestSchema.partial().parse(data);
  } else {
    // 完整创建
    return CreateCandidateRequestSchema.parse(data);
  }
}

// 示例：扩展 Schema
const ExtendedCreateUserRequestSchema = CreateUserRequestSchema.extend({
  avatarUrl: z.string().url().optional(),
  preferences: z
    .object({
      theme: z.enum(["light", "dark"]),
      language: z.enum(["zh-CN", "en-US"]),
    })
    .optional(),
});

// 示例：组合校验
function validateBulkOperations(data: unknown) {
  const schema = z.object({
    userIds: z.array(z.string().uuid()).min(1).max(100),
    operation: z.enum(["activate", "deactivate", "delete"]),
    reason: z.string().optional(),
  });

  return schema.parse(data);
}

export {
  validateLoginRequest,
  validateCreateUserRequest,
  validatePaginationParams,
  createApiResponse,
  validateCandidateUpdate,
  ExtendedCreateUserRequestSchema,
  validateBulkOperations,
};
