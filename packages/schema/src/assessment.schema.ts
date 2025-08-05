import { z } from "zod";
import {
  UUIDSchema,
  PaginationParamsSchema,
  AssessmentResultSchema,
} from "./common.schema.js";

// 部门评定基础信息
export const AssessmentBaseSchema = z.object({
  id: UUIDSchema,
  candidateId: UUIDSchema,
  assessorId: UUIDSchema,
  result: AssessmentResultSchema,
  remarks: z.string().optional(),
  assessedAt: z.string(),
});

// 部门评定详细信息
export const AssessmentDetailSchema = AssessmentBaseSchema.extend({
  candidate: z.object({
    id: UUIDSchema,
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    currentCompany: z.string().optional(),
    workExperience: z.number().optional(),
    resumeUrl: z.string().optional(),
    post: z.object({
      id: UUIDSchema,
      name: z.string(),
    }),
    department: z.object({
      id: UUIDSchema,
      name: z.string(),
    }),
  }),
  assessor: z.object({
    id: UUIDSchema,
    username: z.string(),
    email: z.string().optional(),
    department: z
      .object({
        id: UUIDSchema,
        name: z.string(),
      })
      .optional(),
  }),
});

// 获取评定列表请求
export const GetAssessmentsRequestSchema = PaginationParamsSchema.extend({
  candidateId: UUIDSchema.optional(),
  assessorId: UUIDSchema.optional(),
  result: AssessmentResultSchema.optional(),
  departmentId: UUIDSchema.optional(),
  postId: UUIDSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  keyword: z.string().optional(),
});

// 获取评定列表响应
export const GetAssessmentsResponseSchema = z.object({
  assessments: z.array(AssessmentDetailSchema),
});

// 获取待我评定的候选人列表请求
export const GetPendingAssessmentsRequestSchema = PaginationParamsSchema.extend(
  {
    departmentId: UUIDSchema.optional(),
    postId: UUIDSchema.optional(),
    urgency: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  }
);

// 获取待我评定的候选人列表响应
export const GetPendingAssessmentsResponseSchema = z.object({
  candidates: z.array(
    z.object({
      id: UUIDSchema,
      name: z.string(),
      email: z.string().optional(),
      phone: z.string().optional(),
      currentCompany: z.string().optional(),
      workExperience: z.number().optional(),
      expectedSalary: z.string().optional(),
      source: z.string().optional(),
      resumeUrl: z.string().optional(),
      remarks: z.string().optional(),
      post: z.object({
        id: UUIDSchema,
        name: z.string(),
        jd: z.string().optional(),
      }),
      department: z.object({
        id: UUIDSchema,
        name: z.string(),
      }),
      createdBy: z.object({
        id: UUIDSchema,
        username: z.string(),
      }),
      submittedAt: z.string(),
      daysWaiting: z.number(),
      urgency: z.enum(["HIGH", "MEDIUM", "LOW"]),
      existingAssessment: z
        .object({
          id: UUIDSchema,
          result: AssessmentResultSchema,
          remarks: z.string().optional(),
          assessedAt: z.string(),
        })
        .optional(),
    })
  ),
});

// 创建评定请求
export const CreateAssessmentRequestSchema = z.object({
  candidateId: UUIDSchema,
  result: AssessmentResultSchema,
  remarks: z.string().max(1000, "评定备注最多1000字").optional(),
  score: z.number().min(0).max(100).optional(),
  dimensions: z
    .array(
      z.object({
        name: z.string(),
        score: z.number().min(0).max(10),
        comments: z.string().optional(),
      })
    )
    .optional(),
});

// 创建评定响应
export const CreateAssessmentResponseSchema = z.object({
  id: UUIDSchema,
  result: AssessmentResultSchema,
  assessedAt: z.string(),
  candidateStatus: z.string(),
});

// 更新评定请求
export const UpdateAssessmentRequestSchema = z.object({
  result: AssessmentResultSchema.optional(),
  remarks: z.string().max(1000, "评定备注最多1000字").optional(),
  score: z.number().min(0).max(100).optional(),
  dimensions: z
    .array(
      z.object({
        name: z.string(),
        score: z.number().min(0).max(10),
        comments: z.string().optional(),
      })
    )
    .optional(),
});

// 更新评定响应
export const UpdateAssessmentResponseSchema = z.object({
  id: UUIDSchema,
  result: AssessmentResultSchema,
  updatedAt: z.string(),
});

// 批量评定请求
export const BatchAssessmentRequestSchema = z.object({
  assessments: z
    .array(
      z.object({
        candidateId: UUIDSchema,
        result: AssessmentResultSchema,
        remarks: z.string().max(1000, "评定备注最多1000字").optional(),
        score: z.number().min(0).max(100).optional(),
      })
    )
    .min(1, "评定列表不能为空")
    .max(50, "批量评定最多50人"),
});

// 批量评定响应
export const BatchAssessmentResponseSchema = z.object({
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

// 评定统计请求
export const GetAssessmentStatsRequestSchema = z.object({
  assessorId: UUIDSchema.optional(),
  departmentId: UUIDSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// 评定统计响应
export const GetAssessmentStatsResponseSchema = z.object({
  totalAssessments: z.number(),
  passedCount: z.number(),
  failedCount: z.number(),
  pendingCount: z.number(),
  passRate: z.number(),
  avgProcessTime: z.number(),
  assessorStats: z.array(
    z.object({
      assessorId: UUIDSchema,
      assessorName: z.string(),
      assessmentCount: z.number(),
      passRate: z.number(),
      avgScore: z.number(),
      avgProcessTime: z.number(),
    })
  ),
  departmentStats: z.array(
    z.object({
      departmentId: UUIDSchema,
      departmentName: z.string(),
      assessmentCount: z.number(),
      passRate: z.number(),
      avgProcessTime: z.number(),
    })
  ),
  monthlyTrends: z.array(
    z.object({
      month: z.string(),
      totalAssessments: z.number(),
      passedCount: z.number(),
      failedCount: z.number(),
    })
  ),
});

// 评定模板配置请求
export const AssessmentTemplateRequestSchema = z.object({
  name: z.string().min(1, "模板名称不能为空").max(50, "模板名称最多50字"),
  description: z.string().max(200, "模板描述最多200字").optional(),
  dimensions: z
    .array(
      z.object({
        name: z.string().min(1, "维度名称不能为空").max(20, "维度名称最多20字"),
        description: z.string().max(100, "维度描述最多100字").optional(),
        weight: z.number().min(0).max(1),
        required: z.boolean().default(false),
      })
    )
    .min(1, "至少设置一个评价维度"),
  departmentIds: z.array(UUIDSchema).optional(),
  postIds: z.array(UUIDSchema).optional(),
  isDefault: z.boolean().default(false),
});

// 评定模板响应
export const AssessmentTemplateResponseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  description: z.string().optional(),
  dimensions: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      weight: z.number(),
      required: z.boolean(),
    })
  ),
  isDefault: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 获取评定模板列表响应
export const GetAssessmentTemplatesResponseSchema = z.object({
  templates: z.array(
    AssessmentTemplateResponseSchema.extend({
      usageCount: z.number(),
      departments: z.array(
        z.object({
          id: UUIDSchema,
          name: z.string(),
        })
      ),
      posts: z.array(
        z.object({
          id: UUIDSchema,
          name: z.string(),
        })
      ),
    })
  ),
});

// 评定提醒设置请求
export const AssessmentReminderRequestSchema = z.object({
  enabled: z.boolean(),
  reminderDays: z.array(z.number().int().min(1).max(30)).default([1, 3, 7]),
  reminderTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "请输入正确的时间格式 HH:MM"),
  escalationEnabled: z.boolean().default(false),
  escalationDays: z.number().int().min(1).max(30).optional(),
  escalationRecipients: z.array(UUIDSchema).optional(),
});

// 评定提醒设置响应
export const AssessmentReminderResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// 类型导出
export type AssessmentBase = z.infer<typeof AssessmentBaseSchema>;
export type AssessmentDetail = z.infer<typeof AssessmentDetailSchema>;
export type GetAssessmentsRequest = z.infer<typeof GetAssessmentsRequestSchema>;
export type GetAssessmentsResponse = z.infer<
  typeof GetAssessmentsResponseSchema
>;
export type GetPendingAssessmentsRequest = z.infer<
  typeof GetPendingAssessmentsRequestSchema
>;
export type GetPendingAssessmentsResponse = z.infer<
  typeof GetPendingAssessmentsResponseSchema
>;
export type CreateAssessmentRequest = z.infer<
  typeof CreateAssessmentRequestSchema
>;
export type CreateAssessmentResponse = z.infer<
  typeof CreateAssessmentResponseSchema
>;
export type UpdateAssessmentRequest = z.infer<
  typeof UpdateAssessmentRequestSchema
>;
export type UpdateAssessmentResponse = z.infer<
  typeof UpdateAssessmentResponseSchema
>;
export type BatchAssessmentRequest = z.infer<
  typeof BatchAssessmentRequestSchema
>;
export type BatchAssessmentResponse = z.infer<
  typeof BatchAssessmentResponseSchema
>;
export type GetAssessmentStatsRequest = z.infer<
  typeof GetAssessmentStatsRequestSchema
>;
export type GetAssessmentStatsResponse = z.infer<
  typeof GetAssessmentStatsResponseSchema
>;
export type AssessmentTemplateRequest = z.infer<
  typeof AssessmentTemplateRequestSchema
>;
export type AssessmentTemplateResponse = z.infer<
  typeof AssessmentTemplateResponseSchema
>;
export type GetAssessmentTemplatesResponse = z.infer<
  typeof GetAssessmentTemplatesResponseSchema
>;
export type AssessmentReminderRequest = z.infer<
  typeof AssessmentReminderRequestSchema
>;
export type AssessmentReminderResponse = z.infer<
  typeof AssessmentReminderResponseSchema
>;
