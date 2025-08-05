import { z } from "zod";
import {
  UUIDSchema,
  PaginationParamsSchema,
  InterviewStatusSchema,
  InterviewTaskStatusSchema,
  DateStringSchema,
} from "./common.schema.js";

// 面试任务基础信息
export const InterviewTaskBaseSchema = z.object({
  id: UUIDSchema,
  interviewId: UUIDSchema,
  interviewerId: UUIDSchema,
  sequence: z.number().int().positive(),
  status: InterviewTaskStatusSchema,
  scheduledAt: DateStringSchema.optional(),
  actualStartAt: DateStringSchema.optional(),
  actualEndAt: DateStringSchema.optional(),
  feedback: z.string().optional(),
  feedbackScore: z.number().int().min(0).max(100).optional(),
  decision: z.string().optional(),
  feedbackAt: DateStringSchema.optional(),
});

// 面试基础信息
export const InterviewBaseSchema = z.object({
  id: UUIDSchema,
  candidateId: UUIDSchema,
  postId: UUIDSchema,
  round: z.number().int().positive(),
  status: InterviewStatusSchema,
  scheduledAt: DateStringSchema,
  actualStartAt: DateStringSchema.optional(),
  actualEndAt: DateStringSchema.optional(),
  location: z.string().optional(),
  meetingLink: z.string().url().optional(),
  notes: z.string().optional(),
});

// 面试详细信息
export const InterviewDetailSchema = InterviewBaseSchema.extend({
  candidate: z.object({
    id: UUIDSchema,
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    resumeUrl: z.string().optional(),
    currentCompany: z.string().optional(),
    workExperience: z.number().optional(),
    expectedSalary: z.string().optional(),
  }),
  post: z.object({
    id: UUIDSchema,
    name: z.string(),
    department: z.object({
      id: UUIDSchema,
      name: z.string(),
    }),
  }),
  interviewTasks: z.array(
    InterviewTaskBaseSchema.extend({
      interviewer: z.object({
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
    })
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 获取面试列表请求
export const GetInterviewsRequestSchema = PaginationParamsSchema.extend({
  candidateId: UUIDSchema.optional(),
  postId: UUIDSchema.optional(),
  status: InterviewStatusSchema.optional(),
  round: z.number().int().positive().optional(),
  interviewerId: UUIDSchema.optional(),
  departmentId: UUIDSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  keyword: z.string().optional(),
});

// 获取面试列表响应
export const GetInterviewsResponseSchema = z.object({
  interviews: z.array(
    InterviewDetailSchema.omit({
      candidate: true,
      post: true,
    }).extend({
      candidate: z.object({
        id: UUIDSchema,
        name: z.string(),
        currentCompany: z.string().optional(),
      }),
      post: z.object({
        id: UUIDSchema,
        name: z.string(),
      }),
      interviewTasks: z.array(
        z.object({
          id: UUIDSchema,
          interviewer: z.object({
            id: UUIDSchema,
            username: z.string(),
          }),
          status: InterviewTaskStatusSchema,
          sequence: z.number(),
        })
      ),
    })
  ),
});

// 获取我的面试请求
export const GetMyInterviewsRequestSchema = PaginationParamsSchema.extend({
  status: InterviewTaskStatusSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// 获取我的面试响应
export const GetMyInterviewsResponseSchema = z.object({
  interviews: z.array(
    z.object({
      taskId: UUIDSchema,
      interview: z.object({
        id: UUIDSchema,
        round: z.number(),
        scheduledAt: z.string(),
        location: z.string().optional(),
        meetingLink: z.string().optional(),
        notes: z.string().optional(),
      }),
      candidate: z.object({
        id: UUIDSchema,
        name: z.string(),
        resumeUrl: z.string().optional(),
        currentCompany: z.string().optional(),
        workExperience: z.number().optional(),
        expectedSalary: z.string().optional(),
      }),
      post: z.object({
        id: UUIDSchema,
        name: z.string(),
        jd: z.string().optional(),
      }),
      status: InterviewTaskStatusSchema,
      sequence: z.number(),
      feedback: z.string().optional(),
      feedbackScore: z.number().optional(),
      decision: z.string().optional(),
      scheduledAt: z.string().optional(),
      actualStartAt: z.string().optional(),
      actualEndAt: z.string().optional(),
    })
  ),
});

// 创建面试请求
export const CreateInterviewRequestSchema = z.object({
  candidateId: UUIDSchema,
  postId: UUIDSchema,
  round: z.number().int().positive(),
  scheduledAt: DateStringSchema,
  location: z.string().max(200, "面试地点最多200字").optional(),
  meetingLink: z.string().url("请输入正确的会议链接").optional(),
  notes: z.string().max(1000, "面试备注最多1000字").optional(),
  interviewTasks: z
    .array(
      z.object({
        interviewerId: UUIDSchema,
        sequence: z.number().int().positive(),
        scheduledAt: DateStringSchema.optional(),
      })
    )
    .min(1, "至少分配一个面试官")
    .max(10, "最多分配10个面试官"),
});

// 创建面试响应
export const CreateInterviewResponseSchema = z.object({
  id: UUIDSchema,
  round: z.number(),
  status: z.literal("SCHEDULED"),
  scheduledAt: z.string(),
  interviewTasks: z.array(
    z.object({
      id: UUIDSchema,
      interviewerId: UUIDSchema,
      sequence: z.number(),
      status: z.literal("SCHEDULED"),
    })
  ),
});

// 更新面试请求
export const UpdateInterviewRequestSchema = z.object({
  scheduledAt: DateStringSchema.optional(),
  location: z.string().max(200, "面试地点最多200字").optional(),
  meetingLink: z.string().url("请输入正确的会议链接").optional(),
  notes: z.string().max(1000, "面试备注最多1000字").optional(),
});

// 更新面试响应
export const UpdateInterviewResponseSchema = z.object({
  id: UUIDSchema,
  scheduledAt: z.string(),
  location: z.string().optional(),
  meetingLink: z.string().optional(),
  updatedAt: z.string(),
});

// 开始面试响应
export const StartInterviewResponseSchema = z.object({
  taskId: UUIDSchema,
  status: z.literal("IN_PROGRESS"),
  actualStartAt: z.string(),
});

// 提交面试反馈请求
export const SubmitFeedbackRequestSchema = z.object({
  feedback: z
    .string()
    .min(1, "面试反馈不能为空")
    .max(2000, "面试反馈最多2000字"),
  feedbackScore: z
    .number()
    .int()
    .min(0, "评分不能小于0")
    .max(100, "评分不能大于100")
    .optional(),
  decision: z.enum(["PASSED", "FAILED", "PENDING"], {
    errorMap: () => ({ message: "面试决定必须是通过、不通过或待定" }),
  }),
  dimensions: z
    .array(
      z.object({
        name: z.string(),
        score: z.number().min(0).max(10),
        comments: z.string().optional(),
      })
    )
    .optional(),
  nextRoundSuggestion: z.string().max(500, "下轮建议最多500字").optional(),
});

// 提交面试反馈响应
export const SubmitFeedbackResponseSchema = z.object({
  taskId: UUIDSchema,
  status: z.literal("COMPLETED"),
  feedbackAt: z.string(),
  interviewStatus: InterviewStatusSchema,
  candidateStatus: z.string().optional(),
});

// 取消面试请求
export const CancelInterviewRequestSchema = z.object({
  reason: z.string().max(500, "取消原因最多500字").optional(),
});

// 取消面试响应
export const CancelInterviewResponseSchema = z.object({
  id: UUIDSchema,
  status: z.literal("CANCELLED"),
  updatedAt: z.string(),
});

// 面试日程安排请求
export const ScheduleInterviewRequestSchema = z.object({
  interviewId: UUIDSchema,
  taskId: UUIDSchema,
  scheduledAt: DateStringSchema,
  duration: z.number().int().positive().max(480).default(60), // 分钟
  location: z.string().max(200, "面试地点最多200字").optional(),
  meetingLink: z.string().url("请输入正确的会议链接").optional(),
  sendNotification: z.boolean().default(true),
});

// 面试日程安排响应
export const ScheduleInterviewResponseSchema = z.object({
  taskId: UUIDSchema,
  scheduledAt: z.string(),
  duration: z.number(),
  location: z.string().optional(),
  meetingLink: z.string().optional(),
  notificationSent: z.boolean(),
});

// 批量安排面试请求
export const BatchScheduleInterviewsRequestSchema = z.object({
  schedules: z
    .array(
      z.object({
        candidateId: UUIDSchema,
        postId: UUIDSchema,
        round: z.number().int().positive(),
        scheduledAt: DateStringSchema,
        interviewerIds: z.array(UUIDSchema).min(1, "至少分配一个面试官"),
        location: z.string().max(200, "面试地点最多200字").optional(),
        meetingLink: z.string().url("请输入正确的会议链接").optional(),
      })
    )
    .min(1, "批量安排列表不能为空")
    .max(50, "最多批量安排50场面试"),
});

// 批量安排面试响应
export const BatchScheduleInterviewsResponseSchema = z.object({
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

// 面试统计请求
export const GetInterviewStatsRequestSchema = z.object({
  interviewerId: UUIDSchema.optional(),
  departmentId: UUIDSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// 面试统计响应
export const GetInterviewStatsResponseSchema = z.object({
  totalInterviews: z.number(),
  completedInterviews: z.number(),
  cancelledInterviews: z.number(),
  inProgressInterviews: z.number(),
  avgDuration: z.number(),
  avgScore: z.number(),
  passRate: z.number(),
  interviewerStats: z.array(
    z.object({
      interviewerId: UUIDSchema,
      interviewerName: z.string(),
      interviewCount: z.number(),
      completedCount: z.number(),
      avgScore: z.number(),
      passRate: z.number(),
      avgFeedbackTime: z.number(),
    })
  ),
  timeDistribution: z.array(
    z.object({
      hour: z.number(),
      count: z.number(),
    })
  ),
  roundStats: z.array(
    z.object({
      round: z.number(),
      count: z.number(),
      passRate: z.number(),
      avgScore: z.number(),
    })
  ),
  monthlyTrends: z.array(
    z.object({
      month: z.string(),
      totalInterviews: z.number(),
      completedInterviews: z.number(),
      avgScore: z.number(),
    })
  ),
});

// 面试官日程查询请求
export const GetInterviewerScheduleRequestSchema = z.object({
  interviewerId: UUIDSchema,
  startDate: z.string(),
  endDate: z.string(),
});

// 面试官日程查询响应
export const GetInterviewerScheduleResponseSchema = z.object({
  schedule: z.array(
    z.object({
      date: z.string(),
      interviews: z.array(
        z.object({
          taskId: UUIDSchema,
          interviewId: UUIDSchema,
          candidateName: z.string(),
          postName: z.string(),
          round: z.number(),
          scheduledAt: z.string(),
          duration: z.number(),
          location: z.string().optional(),
          status: InterviewTaskStatusSchema,
        })
      ),
      availability: z.array(
        z.object({
          startTime: z.string(),
          endTime: z.string(),
          available: z.boolean(),
        })
      ),
    })
  ),
});

// 类型导出
export type InterviewTaskBase = z.infer<typeof InterviewTaskBaseSchema>;
export type InterviewBase = z.infer<typeof InterviewBaseSchema>;
export type InterviewDetail = z.infer<typeof InterviewDetailSchema>;
export type GetInterviewsRequest = z.infer<typeof GetInterviewsRequestSchema>;
export type GetInterviewsResponse = z.infer<typeof GetInterviewsResponseSchema>;
export type GetMyInterviewsRequest = z.infer<
  typeof GetMyInterviewsRequestSchema
>;
export type GetMyInterviewsResponse = z.infer<
  typeof GetMyInterviewsResponseSchema
>;
export type CreateInterviewRequest = z.infer<
  typeof CreateInterviewRequestSchema
>;
export type CreateInterviewResponse = z.infer<
  typeof CreateInterviewResponseSchema
>;
export type UpdateInterviewRequest = z.infer<
  typeof UpdateInterviewRequestSchema
>;
export type UpdateInterviewResponse = z.infer<
  typeof UpdateInterviewResponseSchema
>;
export type StartInterviewResponse = z.infer<
  typeof StartInterviewResponseSchema
>;
export type SubmitFeedbackRequest = z.infer<typeof SubmitFeedbackRequestSchema>;
export type SubmitFeedbackResponse = z.infer<
  typeof SubmitFeedbackResponseSchema
>;
export type CancelInterviewRequest = z.infer<
  typeof CancelInterviewRequestSchema
>;
export type CancelInterviewResponse = z.infer<
  typeof CancelInterviewResponseSchema
>;
export type ScheduleInterviewRequest = z.infer<
  typeof ScheduleInterviewRequestSchema
>;
export type ScheduleInterviewResponse = z.infer<
  typeof ScheduleInterviewResponseSchema
>;
export type BatchScheduleInterviewsRequest = z.infer<
  typeof BatchScheduleInterviewsRequestSchema
>;
export type BatchScheduleInterviewsResponse = z.infer<
  typeof BatchScheduleInterviewsResponseSchema
>;
export type GetInterviewStatsRequest = z.infer<
  typeof GetInterviewStatsRequestSchema
>;
export type GetInterviewStatsResponse = z.infer<
  typeof GetInterviewStatsResponseSchema
>;
export type GetInterviewerScheduleRequest = z.infer<
  typeof GetInterviewerScheduleRequestSchema
>;
export type GetInterviewerScheduleResponse = z.infer<
  typeof GetInterviewerScheduleResponseSchema
>;
