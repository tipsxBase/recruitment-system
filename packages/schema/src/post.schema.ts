import { z } from "zod";
import {
  UUIDSchema,
  PaginationParamsSchema,
  PostStatusSchema,
} from "./common.schema.js";

// 岗位基础信息
export const PostBaseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  status: PostStatusSchema,
  hiringCount: z.number().optional(),
  priority: z.number().optional(),
  location: z.string().optional(),
});

// 岗位详细信息
export const PostDetailSchema = PostBaseSchema.extend({
  jd: z.string().optional(),
  department: z.object({
    id: UUIDSchema,
    name: z.string(),
  }),
  createdBy: z.object({
    id: UUIDSchema,
    username: z.string(),
  }),
  candidateCount: z.number(),
  interviewCount: z.number(),
  closedAt: z.string().optional(),
  restoredAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 获取岗位列表请求
export const GetPostsRequestSchema = PaginationParamsSchema.extend({
  keyword: z.string().optional(),
  status: PostStatusSchema.optional(),
  departmentId: UUIDSchema.optional(),
  location: z.string().optional(),
  priority: z.number().int().min(1).max(5).optional(),
  createdById: UUIDSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// 获取岗位列表响应
export const GetPostsResponseSchema = z.object({
  posts: z.array(PostDetailSchema),
});

// 获取岗位详情响应
export const GetPostDetailResponseSchema = PostDetailSchema;

// 创建岗位请求
export const CreatePostRequestSchema = z.object({
  name: z.string().min(1, "岗位名称不能为空").max(100, "岗位名称最多100位"),
  departmentId: UUIDSchema,
  jd: z.string().max(5000, "JD描述最多5000字").optional(),
  hiringCount: z.number().int().positive().optional(),
  priority: z.number().int().min(1).max(5).optional(),
  location: z.string().max(100, "工作地点最多100位").optional(),
  status: PostStatusSchema.optional().default("OPEN"),
});

// 创建岗位响应
export const CreatePostResponseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  status: PostStatusSchema,
  department: z.object({
    id: UUIDSchema,
    name: z.string(),
  }),
});

// 更新岗位请求
export const UpdatePostRequestSchema = z.object({
  name: z
    .string()
    .min(1, "岗位名称不能为空")
    .max(100, "岗位名称最多100位")
    .optional(),
  departmentId: UUIDSchema.optional(),
  jd: z.string().max(5000, "JD描述最多5000字").optional(),
  hiringCount: z.number().int().positive().optional(),
  priority: z.number().int().min(1).max(5).optional(),
  location: z.string().max(100, "工作地点最多100位").optional(),
  status: PostStatusSchema.optional(),
});

// 更新岗位响应
export const UpdatePostResponseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  status: PostStatusSchema,
  updatedAt: z.string(),
});

// 删除岗位响应
export const DeletePostResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// 岗位状态变更请求
export const ChangePostStatusRequestSchema = z.object({
  status: PostStatusSchema,
  reason: z.string().max(500, "变更原因最多500字").optional(),
});

// 岗位状态变更响应
export const ChangePostStatusResponseSchema = z.object({
  id: UUIDSchema,
  status: PostStatusSchema,
  changedAt: z.string(),
  affectedCandidates: z.number().optional(),
});

// 批量导入岗位请求
export const BatchImportPostsRequestSchema = z.object({
  posts: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "岗位名称不能为空")
          .max(100, "岗位名称最多100位"),
        departmentName: z.string(),
        jd: z.string().max(5000, "JD描述最多5000字").optional(),
        hiringCount: z.number().int().positive().optional(),
        priority: z.number().int().min(1).max(5).optional(),
        location: z.string().max(100, "工作地点最多100位").optional(),
      })
    )
    .min(1, "导入岗位列表不能为空"),
});

// 批量导入岗位响应
export const BatchImportPostsResponseSchema = z.object({
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

// 岗位统计请求
export const GetPostStatsRequestSchema = z.object({
  departmentId: UUIDSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// 岗位统计响应
export const GetPostStatsResponseSchema = z.object({
  totalPosts: z.number(),
  openPosts: z.number(),
  pausedPosts: z.number(),
  closedPosts: z.number(),
  totalHiring: z.number(),
  totalCandidates: z.number(),
  totalInterviews: z.number(),
  avgCandidatesPerPost: z.number(),
  avgProcessTime: z.number(),
  departmentStats: z.array(
    z.object({
      departmentId: UUIDSchema,
      departmentName: z.string(),
      postCount: z.number(),
      candidateCount: z.number(),
      successRate: z.number(),
    })
  ),
  monthlyTrends: z.array(
    z.object({
      month: z.string(),
      newPosts: z.number(),
      completedPosts: z.number(),
      newCandidates: z.number(),
    })
  ),
});

// 复制岗位请求
export const CopyPostRequestSchema = z.object({
  name: z.string().min(1, "岗位名称不能为空").max(100, "岗位名称最多100位"),
  departmentId: UUIDSchema.optional(),
  copyJd: z.boolean().default(true),
  copyRequirements: z.boolean().default(true),
});

// 复制岗位响应
export const CopyPostResponseSchema = CreatePostResponseSchema;

// 岗位搜索建议请求
export const GetPostSuggestionsRequestSchema = z.object({
  query: z.string().min(1, "搜索关键词不能为空"),
  limit: z.number().int().positive().max(20).default(10),
});

// 岗位搜索建议响应
export const GetPostSuggestionsResponseSchema = z.object({
  suggestions: z.array(
    z.object({
      id: UUIDSchema,
      name: z.string(),
      department: z.string(),
      status: PostStatusSchema,
    })
  ),
});

// 类型导出
export type PostBase = z.infer<typeof PostBaseSchema>;
export type PostDetail = z.infer<typeof PostDetailSchema>;
export type GetPostsRequest = z.infer<typeof GetPostsRequestSchema>;
export type GetPostsResponse = z.infer<typeof GetPostsResponseSchema>;
export type GetPostDetailResponse = z.infer<typeof GetPostDetailResponseSchema>;
export type CreatePostRequest = z.infer<typeof CreatePostRequestSchema>;
export type CreatePostResponse = z.infer<typeof CreatePostResponseSchema>;
export type UpdatePostRequest = z.infer<typeof UpdatePostRequestSchema>;
export type UpdatePostResponse = z.infer<typeof UpdatePostResponseSchema>;
export type DeletePostResponse = z.infer<typeof DeletePostResponseSchema>;
export type ChangePostStatusRequest = z.infer<
  typeof ChangePostStatusRequestSchema
>;
export type ChangePostStatusResponse = z.infer<
  typeof ChangePostStatusResponseSchema
>;
export type BatchImportPostsRequest = z.infer<
  typeof BatchImportPostsRequestSchema
>;
export type BatchImportPostsResponse = z.infer<
  typeof BatchImportPostsResponseSchema
>;
export type GetPostStatsRequest = z.infer<typeof GetPostStatsRequestSchema>;
export type GetPostStatsResponse = z.infer<typeof GetPostStatsResponseSchema>;
export type CopyPostRequest = z.infer<typeof CopyPostRequestSchema>;
export type CopyPostResponse = z.infer<typeof CopyPostResponseSchema>;
export type GetPostSuggestionsRequest = z.infer<
  typeof GetPostSuggestionsRequestSchema
>;
export type GetPostSuggestionsResponse = z.infer<
  typeof GetPostSuggestionsResponseSchema
>;
