import { z } from "zod";
import {
  UUIDSchema,
  EmailSchema,
  PhoneSchema,
  PaginationParamsSchema,
  CandidateStatusSchema,
} from "./common.schema.js";

// 候选人基础信息
export const CandidateBaseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  email: EmailSchema.optional(),
  phone: PhoneSchema.optional(),
  status: CandidateStatusSchema,
  source: z.string().optional(),
  expectedSalary: z.string().optional(),
  currentCompany: z.string().optional(),
  workExperience: z.number().int().min(0).optional(),
});

// 候选人详细信息
export const CandidateDetailSchema = CandidateBaseSchema.extend({
  resumeUrl: z.string().url().optional(),
  remarks: z.string().optional(),
  department: z.object({
    id: UUIDSchema,
    name: z.string(),
  }),
  post: z.object({
    id: UUIDSchema,
    name: z.string(),
  }),
  createdBy: z.object({
    id: UUIDSchema,
    username: z.string(),
  }),
  assessments: z.array(
    z.object({
      id: UUIDSchema,
      result: z.enum(["PASSED", "FAILED", "PENDING"]),
      remarks: z.string().optional(),
      assessor: z.object({
        id: UUIDSchema,
        username: z.string(),
      }),
      assessedAt: z.string(),
    })
  ),
  interviews: z.array(
    z.object({
      id: UUIDSchema,
      round: z.number(),
      status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
      scheduledAt: z.string(),
    })
  ),
  statusHistory: z.array(
    z.object({
      id: UUIDSchema,
      fromStatus: CandidateStatusSchema.optional(),
      toStatus: CandidateStatusSchema,
      reason: z.string().optional(),
      operator: z.object({
        id: UUIDSchema,
        username: z.string(),
      }),
      createdAt: z.string(),
    })
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 获取候选人列表请求
export const GetCandidatesRequestSchema = PaginationParamsSchema.extend({
  keyword: z.string().optional(),
  status: CandidateStatusSchema.optional(),
  departmentId: UUIDSchema.optional(),
  postId: UUIDSchema.optional(),
  source: z.string().optional(),
  workExperience: z.number().int().min(0).optional(),
  createdById: UUIDSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  salaryRange: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
});

// 获取候选人列表响应
export const GetCandidatesResponseSchema = z.object({
  candidates: z.array(
    CandidateDetailSchema.omit({
      assessments: true,
      interviews: true,
      statusHistory: true,
    }).extend({
      currentStage: z.string().optional(),
      daysInCurrentStage: z.number().optional(),
    })
  ),
});

// 获取候选人详情响应
export const GetCandidateDetailResponseSchema = CandidateDetailSchema;

// 创建候选人请求
export const CreateCandidateRequestSchema = z.object({
  name: z.string().min(1, "候选人姓名不能为空").max(50, "候选人姓名最多50位"),
  email: EmailSchema.optional(),
  phone: PhoneSchema.optional(),
  resumeUrl: z.string().url("请输入正确的简历链接").optional(),
  remarks: z.string().max(1000, "备注最多1000字").optional(),
  source: z.string().max(50, "来源最多50位").optional(),
  expectedSalary: z.string().max(50, "期望薪资最多50位").optional(),
  currentCompany: z.string().max(100, "当前公司最多100位").optional(),
  workExperience: z.number().int().min(0).max(50).optional(),
  departmentId: UUIDSchema,
  postId: UUIDSchema,
});

// 创建候选人响应
export const CreateCandidateResponseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  status: z.literal("NEW"),
  department: z.object({
    id: UUIDSchema,
    name: z.string(),
  }),
  post: z.object({
    id: UUIDSchema,
    name: z.string(),
  }),
});

// 更新候选人请求
export const UpdateCandidateRequestSchema = z.object({
  name: z
    .string()
    .min(1, "候选人姓名不能为空")
    .max(50, "候选人姓名最多50位")
    .optional(),
  email: EmailSchema.optional(),
  phone: PhoneSchema.optional(),
  resumeUrl: z.string().url("请输入正确的简历链接").optional(),
  remarks: z.string().max(1000, "备注最多1000字").optional(),
  source: z.string().max(50, "来源最多50位").optional(),
  expectedSalary: z.string().max(50, "期望薪资最多50位").optional(),
  currentCompany: z.string().max(100, "当前公司最多100位").optional(),
  workExperience: z.number().int().min(0).max(50).optional(),
  departmentId: UUIDSchema.optional(),
  postId: UUIDSchema.optional(),
});

// 更新候选人响应
export const UpdateCandidateResponseSchema = CreateCandidateResponseSchema;

// 批量导入候选人请求
export const BatchImportCandidatesRequestSchema = z.object({
  candidates: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "候选人姓名不能为空")
          .max(50, "候选人姓名最多50位"),
        email: EmailSchema.optional(),
        phone: PhoneSchema.optional(),
        resumeUrl: z.string().url("请输入正确的简历链接").optional(),
        remarks: z.string().max(1000, "备注最多1000字").optional(),
        source: z.string().max(50, "来源最多50位").optional(),
        expectedSalary: z.string().max(50, "期望薪资最多50位").optional(),
        currentCompany: z.string().max(100, "当前公司最多100位").optional(),
        workExperience: z.number().int().min(0).max(50).optional(),
        departmentName: z.string(),
        postName: z.string(),
      })
    )
    .min(1, "导入候选人列表不能为空"),
});

// 批量导入候选人响应
export const BatchImportCandidatesResponseSchema = z.object({
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

// 更新候选人状态请求
export const UpdateCandidateStatusRequestSchema = z.object({
  status: CandidateStatusSchema,
  reason: z.string().max(500, "变更原因最多500字").optional(),
});

// 更新候选人状态响应
export const UpdateCandidateStatusResponseSchema = z.object({
  id: UUIDSchema,
  status: CandidateStatusSchema,
  updatedAt: z.string(),
});

// 候选人流程追踪响应
export const GetCandidateTimelineResponseSchema = z.object({
  timeline: z.array(
    z.object({
      id: UUIDSchema,
      type: z.enum(["STATUS_CHANGE", "ASSESSMENT", "INTERVIEW", "COMMENT"]),
      title: z.string(),
      description: z.string(),
      operator: z.object({
        id: UUIDSchema,
        username: z.string(),
      }),
      data: z.record(z.any()).optional(),
      createdAt: z.string(),
    })
  ),
});

// 候选人标签请求
export const ManageCandidateTagsRequestSchema = z.object({
  tags: z.array(z.string().max(20, "标签最多20字")).max(10, "最多10个标签"),
  operation: z.enum(["add", "remove", "replace"]).default("replace"),
});

// 候选人标签响应
export const ManageCandidateTagsResponseSchema = z.object({
  id: UUIDSchema,
  tags: z.array(z.string()),
});

// 候选人搜索建议请求
export const GetCandidateSuggestionsRequestSchema = z.object({
  query: z.string().min(1, "搜索关键词不能为空"),
  field: z.enum(["name", "email", "phone", "company"]).default("name"),
  limit: z.number().int().positive().max(20).default(10),
});

// 候选人搜索建议响应
export const GetCandidateSuggestionsResponseSchema = z.object({
  suggestions: z.array(
    z.object({
      id: UUIDSchema,
      name: z.string(),
      email: z.string().optional(),
      currentCompany: z.string().optional(),
      status: CandidateStatusSchema,
      post: z.string(),
    })
  ),
});

// 候选人统计请求
export const GetCandidateStatsRequestSchema = z.object({
  departmentId: UUIDSchema.optional(),
  postId: UUIDSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// 候选人统计响应
export const GetCandidateStatsResponseSchema = z.object({
  totalCandidates: z.number(),
  newCandidates: z.number(),
  inAssessment: z.number(),
  inInterview: z.number(),
  offered: z.number(),
  rejected: z.number(),
  conversionRate: z.number(),
  avgProcessTime: z.number(),
  sourceDistribution: z.array(
    z.object({
      source: z.string(),
      count: z.number(),
      percentage: z.number(),
    })
  ),
  statusDistribution: z.array(
    z.object({
      status: CandidateStatusSchema,
      count: z.number(),
      percentage: z.number(),
    })
  ),
  monthlyTrends: z.array(
    z.object({
      month: z.string(),
      newCandidates: z.number(),
      passedAssessment: z.number(),
      completedInterviews: z.number(),
      offers: z.number(),
    })
  ),
});

// 批量操作候选人请求
export const BatchCandidateOperationRequestSchema = z.object({
  candidateIds: z.array(UUIDSchema).min(1, "候选人ID列表不能为空"),
  operation: z.enum(["status_change", "assign_post", "add_tags", "export"]),
  params: z.record(z.any()).optional(),
});

// 批量操作候选人响应
export const BatchCandidateOperationResponseSchema = z.object({
  success: z.number(),
  failed: z.number(),
  errors: z.array(
    z.object({
      candidateId: UUIDSchema,
      candidateName: z.string(),
      error: z.string(),
    })
  ),
});

// 类型导出
export type CandidateBase = z.infer<typeof CandidateBaseSchema>;
export type CandidateDetail = z.infer<typeof CandidateDetailSchema>;
export type GetCandidatesRequest = z.infer<typeof GetCandidatesRequestSchema>;
export type GetCandidatesResponse = z.infer<typeof GetCandidatesResponseSchema>;
export type GetCandidateDetailResponse = z.infer<
  typeof GetCandidateDetailResponseSchema
>;
export type CreateCandidateRequest = z.infer<
  typeof CreateCandidateRequestSchema
>;
export type CreateCandidateResponse = z.infer<
  typeof CreateCandidateResponseSchema
>;
export type UpdateCandidateRequest = z.infer<
  typeof UpdateCandidateRequestSchema
>;
export type UpdateCandidateResponse = z.infer<
  typeof UpdateCandidateResponseSchema
>;
export type BatchImportCandidatesRequest = z.infer<
  typeof BatchImportCandidatesRequestSchema
>;
export type BatchImportCandidatesResponse = z.infer<
  typeof BatchImportCandidatesResponseSchema
>;
export type UpdateCandidateStatusRequest = z.infer<
  typeof UpdateCandidateStatusRequestSchema
>;
export type UpdateCandidateStatusResponse = z.infer<
  typeof UpdateCandidateStatusResponseSchema
>;
export type GetCandidateTimelineResponse = z.infer<
  typeof GetCandidateTimelineResponseSchema
>;
export type ManageCandidateTagsRequest = z.infer<
  typeof ManageCandidateTagsRequestSchema
>;
export type ManageCandidateTagsResponse = z.infer<
  typeof ManageCandidateTagsResponseSchema
>;
export type GetCandidateSuggestionsRequest = z.infer<
  typeof GetCandidateSuggestionsRequestSchema
>;
export type GetCandidateSuggestionsResponse = z.infer<
  typeof GetCandidateSuggestionsResponseSchema
>;
export type GetCandidateStatsRequest = z.infer<
  typeof GetCandidateStatsRequestSchema
>;
export type GetCandidateStatsResponse = z.infer<
  typeof GetCandidateStatsResponseSchema
>;
export type BatchCandidateOperationRequest = z.infer<
  typeof BatchCandidateOperationRequestSchema
>;
export type BatchCandidateOperationResponse = z.infer<
  typeof BatchCandidateOperationResponseSchema
>;
