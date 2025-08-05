import { z } from "zod";
import {
  UUIDSchema,
  PaginationParamsSchema,
  LogResultSchema,
} from "./common.schema.js";

// 首页数据响应
export const GetDashboardResponseSchema = z.object({
  statistics: z.object({
    totalUsers: z.number(),
    totalPosts: z.number(),
    totalCandidates: z.number(),
    totalInterviews: z.number(),
    monthlyNewCandidates: z.number(),
    monthlyCompletedInterviews: z.number(),
    activeUsers: z.number(),
    avgProcessTime: z.number(), // 平均招聘周期(天)
  }),
  todoItems: z.array(
    z.object({
      type: z.enum(["assessment", "interview", "feedback", "approval"]),
      count: z.number(),
      description: z.string(),
      priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
      url: z.string().optional(),
    })
  ),
  departmentRankings: z.array(
    z.object({
      departmentId: UUIDSchema,
      departmentName: z.string(),
      completedCount: z.number(),
      successRate: z.number(),
      avgProcessTime: z.number(),
      rank: z.number(),
    })
  ),
  recentActivities: z.array(
    z.object({
      id: UUIDSchema,
      type: z.enum([
        "USER_LOGIN",
        "CANDIDATE_CREATED",
        "INTERVIEW_COMPLETED",
        "OFFER_SENT",
        "POST_CREATED",
      ]),
      description: z.string(),
      actor: z.object({
        id: UUIDSchema,
        username: z.string(),
      }),
      target: z
        .object({
          id: UUIDSchema,
          name: z.string(),
          type: z.string(),
        })
        .optional(),
      createdAt: z.string(),
    })
  ),
  quickStats: z.object({
    todayNewCandidates: z.number(),
    todayCompletedInterviews: z.number(),
    todayOffers: z.number(),
    pendingAssessments: z.number(),
    pendingInterviews: z.number(),
    overdueTasks: z.number(),
  }),
  charts: z.object({
    candidateTrend: z.array(
      z.object({
        date: z.string(),
        newCandidates: z.number(),
        passedAssessment: z.number(),
        completedInterview: z.number(),
        offers: z.number(),
      })
    ),
    departmentDistribution: z.array(
      z.object({
        departmentName: z.string(),
        candidateCount: z.number(),
        successRate: z.number(),
      })
    ),
    sourceDistribution: z.array(
      z.object({
        source: z.string(),
        count: z.number(),
        percentage: z.number(),
      })
    ),
  }),
});

// 操作日志请求
export const GetLogsRequestSchema = PaginationParamsSchema.extend({
  userId: UUIDSchema.optional(),
  module: z
    .enum([
      "USER",
      "DEPARTMENT",
      "POST",
      "CANDIDATE",
      "INTERVIEW",
      "AUTH",
      "SYSTEM",
    ])
    .optional(),
  action: z.string().optional(),
  objectType: z.string().optional(),
  objectId: UUIDSchema.optional(),
  result: LogResultSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  ipAddress: z.string().optional(),
  keyword: z.string().optional(),
});

// 操作日志响应
export const GetLogsResponseSchema = z.object({
  logs: z.array(
    z.object({
      id: UUIDSchema,
      user: z.object({
        id: UUIDSchema,
        username: z.string(),
        department: z
          .object({
            id: UUIDSchema,
            name: z.string(),
          })
          .optional(),
      }),
      action: z.string(),
      module: z.string(),
      objectType: z.string().optional(),
      objectId: UUIDSchema.optional(),
      objectName: z.string().optional(),
      result: LogResultSchema,
      errorMsg: z.string().optional(),
      ipAddress: z.string().optional(),
      userAgent: z.string().optional(),
      duration: z.number().optional(), // 毫秒
      details: z.record(z.any()).optional(),
      createdAt: z.string(),
    })
  ),
});

// 数据导出请求
export const ExportDataRequestSchema = z.object({
  type: z.enum([
    "users",
    "departments",
    "posts",
    "candidates",
    "interviews",
    "logs",
    "assessments",
  ]),
  filters: z.record(z.any()).optional(),
  format: z.enum(["xlsx", "csv", "pdf"]).default("xlsx"),
  fields: z.array(z.string()).optional(), // 指定导出字段
  includeDeleted: z.boolean().default(false),
  dateRange: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
});

// 数据导出响应
export const ExportDataResponseSchema = z.object({
  taskId: UUIDSchema,
  downloadUrl: z.string(),
  filename: z.string(),
  fileSize: z.number().optional(),
  recordCount: z.number(),
  expiresAt: z.string(),
  estimatedTime: z.number().optional(), // 预计处理时间(秒)
});

// 系统配置请求
export const SystemConfigRequestSchema = z.object({
  category: z.enum(["GENERAL", "EMAIL", "SMS", "FILE", "SECURITY", "WORKFLOW"]),
  configs: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      description: z.string().optional(),
    })
  ),
});

// 系统配置响应
export const SystemConfigResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  updatedConfigs: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      updatedAt: z.string(),
    })
  ),
});

// 获取系统配置响应
export const GetSystemConfigResponseSchema = z.object({
  configs: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      category: z.string(),
      description: z.string().optional(),
      type: z.enum(["STRING", "NUMBER", "BOOLEAN", "JSON"]),
      required: z.boolean(),
      editable: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
});

// 系统健康检查响应
export const GetSystemHealthResponseSchema = z.object({
  status: z.enum(["HEALTHY", "WARNING", "CRITICAL"]),
  uptime: z.number(), // 运行时间(秒)
  version: z.string(),
  environment: z.string(),
  services: z.array(
    z.object({
      name: z.string(),
      status: z.enum(["UP", "DOWN", "DEGRADED"]),
      latency: z.number().optional(),
      lastCheck: z.string(),
      error: z.string().optional(),
    })
  ),
  database: z.object({
    status: z.enum(["CONNECTED", "DISCONNECTED", "SLOW"]),
    connectionCount: z.number(),
    queryTime: z.number(),
    lastCheck: z.string(),
  }),
  cache: z.object({
    status: z.enum(["CONNECTED", "DISCONNECTED"]),
    hitRate: z.number(),
    memoryUsage: z.number(),
    lastCheck: z.string(),
  }),
  storage: z.object({
    status: z.enum(["AVAILABLE", "FULL", "ERROR"]),
    usedSpace: z.number(),
    totalSpace: z.number(),
    lastCheck: z.string(),
  }),
  metrics: z.object({
    cpuUsage: z.number(),
    memoryUsage: z.number(),
    diskUsage: z.number(),
    activeConnections: z.number(),
    requestsPerMinute: z.number(),
    errorsPerMinute: z.number(),
  }),
});

// 数据备份请求
export const BackupDataRequestSchema = z.object({
  type: z.enum(["FULL", "INCREMENTAL", "SCHEMA_ONLY"]).default("FULL"),
  includeFiles: z.boolean().default(true),
  compression: z.boolean().default(true),
  encryption: z.boolean().default(false),
  password: z.string().optional(),
  description: z.string().max(200, "备份描述最多200字").optional(),
});

// 数据备份响应
export const BackupDataResponseSchema = z.object({
  backupId: UUIDSchema,
  taskId: UUIDSchema,
  status: z.enum(["PENDING", "RUNNING", "COMPLETED", "FAILED"]),
  downloadUrl: z.string().optional(),
  filename: z.string(),
  fileSize: z.number().optional(),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  error: z.string().optional(),
});

// 获取备份列表响应
export const GetBackupsResponseSchema = z.object({
  backups: z.array(
    z.object({
      id: UUIDSchema,
      type: z.enum(["FULL", "INCREMENTAL", "SCHEMA_ONLY"]),
      filename: z.string(),
      fileSize: z.number(),
      description: z.string().optional(),
      status: z.enum(["COMPLETED", "FAILED", "EXPIRED"]),
      downloadUrl: z.string().optional(),
      expiresAt: z.string().optional(),
      createdBy: z.object({
        id: UUIDSchema,
        username: z.string(),
      }),
      createdAt: z.string(),
    })
  ),
});

// 数据恢复请求
export const RestoreDataRequestSchema = z.object({
  backupId: UUIDSchema,
  password: z.string().optional(),
  overwriteExisting: z.boolean().default(false),
  restoreFiles: z.boolean().default(true),
  targetDatabase: z.string().optional(),
});

// 数据恢复响应
export const RestoreDataResponseSchema = z.object({
  taskId: UUIDSchema,
  status: z.enum(["PENDING", "RUNNING", "COMPLETED", "FAILED"]),
  startedAt: z.string(),
  estimatedTime: z.number().optional(),
  progress: z.number().optional(),
});

// 系统通知请求
export const SystemAnnouncementRequestSchema = z.object({
  title: z.string().min(1, "公告标题不能为空").max(100, "公告标题最多100字"),
  content: z
    .string()
    .min(1, "公告内容不能为空")
    .max(2000, "公告内容最多2000字"),
  type: z.enum(["INFO", "WARNING", "SUCCESS", "ERROR"]).default("INFO"),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  targetAudience: z.enum(["ALL", "DEPARTMENT", "ROLE"]).default("ALL"),
  targetIds: z.array(UUIDSchema).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sticky: z.boolean().default(false), // 是否置顶
  allowDismiss: z.boolean().default(true),
});

// 系统通知响应
export const SystemAnnouncementResponseSchema = z.object({
  id: UUIDSchema,
  title: z.string(),
  recipientCount: z.number(),
  publishedAt: z.string(),
  expiresAt: z.string().optional(),
});

// 获取系统通知列表响应
export const GetSystemAnnouncementsResponseSchema = z.object({
  announcements: z.array(
    z.object({
      id: UUIDSchema,
      title: z.string(),
      content: z.string(),
      type: z.enum(["INFO", "WARNING", "SUCCESS", "ERROR"]),
      priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
      sticky: z.boolean(),
      allowDismiss: z.boolean(),
      readCount: z.number(),
      totalRecipients: z.number(),
      createdBy: z.object({
        id: UUIDSchema,
        username: z.string(),
      }),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
});

// 类型导出
export type GetDashboardResponse = z.infer<typeof GetDashboardResponseSchema>;
export type GetLogsRequest = z.infer<typeof GetLogsRequestSchema>;
export type GetLogsResponse = z.infer<typeof GetLogsResponseSchema>;
export type ExportDataRequest = z.infer<typeof ExportDataRequestSchema>;
export type ExportDataResponse = z.infer<typeof ExportDataResponseSchema>;
export type SystemConfigRequest = z.infer<typeof SystemConfigRequestSchema>;
export type SystemConfigResponse = z.infer<typeof SystemConfigResponseSchema>;
export type GetSystemConfigResponse = z.infer<
  typeof GetSystemConfigResponseSchema
>;
export type GetSystemHealthResponse = z.infer<
  typeof GetSystemHealthResponseSchema
>;
export type BackupDataRequest = z.infer<typeof BackupDataRequestSchema>;
export type BackupDataResponse = z.infer<typeof BackupDataResponseSchema>;
export type GetBackupsResponse = z.infer<typeof GetBackupsResponseSchema>;
export type RestoreDataRequest = z.infer<typeof RestoreDataRequestSchema>;
export type RestoreDataResponse = z.infer<typeof RestoreDataResponseSchema>;
export type SystemAnnouncementRequest = z.infer<
  typeof SystemAnnouncementRequestSchema
>;
export type SystemAnnouncementResponse = z.infer<
  typeof SystemAnnouncementResponseSchema
>;
export type GetSystemAnnouncementsResponse = z.infer<
  typeof GetSystemAnnouncementsResponseSchema
>;
