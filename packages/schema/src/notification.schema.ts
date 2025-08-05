import { z } from "zod";
import {
  UUIDSchema,
  PaginationParamsSchema,
  NotificationTypeSchema,
} from "./common.schema.js";

// 通知基础信息
export const NotificationBaseSchema = z.object({
  id: UUIDSchema,
  type: NotificationTypeSchema,
  title: z.string(),
  content: z.string(),
  receiverId: UUIDSchema,
  isRead: z.boolean(),
  sentAt: z.string(),
  relatedPostId: UUIDSchema.optional(),
  relatedCandidateId: UUIDSchema.optional(),
});

// 通知详细信息
export const NotificationDetailSchema = NotificationBaseSchema.extend({
  receiver: z.object({
    id: UUIDSchema,
    username: z.string(),
    email: z.string().optional(),
  }),
  relatedPost: z
    .object({
      id: UUIDSchema,
      name: z.string(),
    })
    .optional(),
  relatedCandidate: z
    .object({
      id: UUIDSchema,
      name: z.string(),
    })
    .optional(),
  readAt: z.string().optional(),
});

// 获取通知列表请求
export const GetNotificationsRequestSchema = PaginationParamsSchema.extend({
  type: NotificationTypeSchema.optional(),
  isRead: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  keyword: z.string().optional(),
});

// 获取通知列表响应
export const GetNotificationsResponseSchema = z.object({
  notifications: z.array(NotificationDetailSchema.omit({ receiver: true })),
});

// 标记通知已读响应
export const MarkNotificationReadResponseSchema = z.object({
  id: UUIDSchema,
  isRead: z.boolean(),
  readAt: z.string(),
});

// 批量标记已读请求
export const BatchMarkReadRequestSchema = z.object({
  notificationIds: z
    .array(UUIDSchema)
    .min(1, "通知ID列表不能为空")
    .max(100, "最多批量标记100条通知"),
  markAll: z.boolean().default(false),
});

// 批量标记已读响应
export const BatchMarkReadResponseSchema = z.object({
  updatedCount: z.number(),
  success: z.boolean(),
});

// 删除通知请求
export const DeleteNotificationsRequestSchema = z.object({
  notificationIds: z
    .array(UUIDSchema)
    .min(1, "通知ID列表不能为空")
    .max(100, "最多批量删除100条通知"),
  deleteAll: z.boolean().default(false),
  olderThanDays: z.number().int().positive().optional(),
});

// 删除通知响应
export const DeleteNotificationsResponseSchema = z.object({
  deletedCount: z.number(),
  success: z.boolean(),
});

// 发送通知请求
export const SendNotificationRequestSchema = z.object({
  type: NotificationTypeSchema,
  title: z.string().min(1, "通知标题不能为空").max(100, "通知标题最多100字"),
  content: z
    .string()
    .min(1, "通知内容不能为空")
    .max(1000, "通知内容最多1000字"),
  receiverIds: z
    .array(UUIDSchema)
    .min(1, "接收人列表不能为空")
    .max(1000, "最多发送给1000人"),
  relatedPostId: UUIDSchema.optional(),
  relatedCandidateId: UUIDSchema.optional(),
  scheduled: z.boolean().default(false),
  scheduledAt: z.string().optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
});

// 发送通知响应
export const SendNotificationResponseSchema = z.object({
  success: z.number(),
  failed: z.number(),
  errors: z.array(
    z.object({
      receiverId: UUIDSchema,
      receiverName: z.string(),
      error: z.string(),
    })
  ),
  notificationIds: z.array(UUIDSchema),
});

// 广播通知请求
export const BroadcastNotificationRequestSchema = z.object({
  type: NotificationTypeSchema,
  title: z.string().min(1, "通知标题不能为空").max(100, "通知标题最多100字"),
  content: z
    .string()
    .min(1, "通知内容不能为空")
    .max(1000, "通知内容最多1000字"),
  target: z.enum(["ALL", "DEPARTMENT", "ROLE"]),
  targetIds: z.array(UUIDSchema).optional(),
  excludeIds: z.array(UUIDSchema).optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  scheduled: z.boolean().default(false),
  scheduledAt: z.string().optional(),
});

// 广播通知响应
export const BroadcastNotificationResponseSchema = z.object({
  recipientCount: z.number(),
  notificationIds: z.array(UUIDSchema),
  success: z.boolean(),
});

// 通知模板请求
export const NotificationTemplateRequestSchema = z.object({
  name: z.string().min(1, "模板名称不能为空").max(50, "模板名称最多50字"),
  type: NotificationTypeSchema,
  title: z.string().min(1, "模板标题不能为空").max(100, "模板标题最多100字"),
  content: z
    .string()
    .min(1, "模板内容不能为空")
    .max(1000, "模板内容最多1000字"),
  variables: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        required: z.boolean().default(false),
        defaultValue: z.string().optional(),
      })
    )
    .optional(),
  category: z.string().max(50, "分类最多50字").optional(),
  isSystem: z.boolean().default(false),
});

// 通知模板响应
export const NotificationTemplateResponseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  content: z.string(),
  variables: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        required: z.boolean(),
        defaultValue: z.string().optional(),
      })
    )
    .optional(),
  category: z.string().optional(),
  isSystem: z.boolean(),
  usageCount: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 获取通知模板列表响应
export const GetNotificationTemplatesResponseSchema = z.object({
  templates: z.array(NotificationTemplateResponseSchema),
});

// 使用模板发送通知请求
export const SendTemplateNotificationRequestSchema = z.object({
  templateId: UUIDSchema,
  receiverIds: z.array(UUIDSchema).min(1, "接收人列表不能为空"),
  variables: z.record(z.string()).optional(),
  relatedPostId: UUIDSchema.optional(),
  relatedCandidateId: UUIDSchema.optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
});

// 通知设置请求
export const NotificationSettingsRequestSchema = z.object({
  emailEnabled: z.boolean().default(true),
  smsEnabled: z.boolean().default(false),
  systemEnabled: z.boolean().default(true),
  digestMode: z.enum(["IMMEDIATE", "HOURLY", "DAILY"]).default("IMMEDIATE"),
  quietHours: z
    .object({
      enabled: z.boolean().default(false),
      startTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional(),
      endTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional(),
    })
    .optional(),
  categories: z
    .array(
      z.object({
        category: z.string(),
        emailEnabled: z.boolean(),
        smsEnabled: z.boolean(),
        systemEnabled: z.boolean(),
      })
    )
    .optional(),
});

// 通知设置响应
export const NotificationSettingsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// 获取通知设置响应
export const GetNotificationSettingsResponseSchema =
  NotificationSettingsRequestSchema;

// 通知统计请求
export const GetNotificationStatsRequestSchema = z.object({
  receiverId: UUIDSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// 通知统计响应
export const GetNotificationStatsResponseSchema = z.object({
  totalNotifications: z.number(),
  unreadCount: z.number(),
  readCount: z.number(),
  typeDistribution: z.array(
    z.object({
      type: NotificationTypeSchema,
      count: z.number(),
      unreadCount: z.number(),
    })
  ),
  dailyStats: z.array(
    z.object({
      date: z.string(),
      totalCount: z.number(),
      readCount: z.number(),
      unreadCount: z.number(),
    })
  ),
  topSenders: z.array(
    z.object({
      senderId: UUIDSchema,
      senderName: z.string(),
      count: z.number(),
    })
  ),
});

// 类型导出
export type NotificationBase = z.infer<typeof NotificationBaseSchema>;
export type NotificationDetail = z.infer<typeof NotificationDetailSchema>;
export type GetNotificationsRequest = z.infer<
  typeof GetNotificationsRequestSchema
>;
export type GetNotificationsResponse = z.infer<
  typeof GetNotificationsResponseSchema
>;
export type MarkNotificationReadResponse = z.infer<
  typeof MarkNotificationReadResponseSchema
>;
export type BatchMarkReadRequest = z.infer<typeof BatchMarkReadRequestSchema>;
export type BatchMarkReadResponse = z.infer<typeof BatchMarkReadResponseSchema>;
export type DeleteNotificationsRequest = z.infer<
  typeof DeleteNotificationsRequestSchema
>;
export type DeleteNotificationsResponse = z.infer<
  typeof DeleteNotificationsResponseSchema
>;
export type SendNotificationRequest = z.infer<
  typeof SendNotificationRequestSchema
>;
export type SendNotificationResponse = z.infer<
  typeof SendNotificationResponseSchema
>;
export type BroadcastNotificationRequest = z.infer<
  typeof BroadcastNotificationRequestSchema
>;
export type BroadcastNotificationResponse = z.infer<
  typeof BroadcastNotificationResponseSchema
>;
export type NotificationTemplateRequest = z.infer<
  typeof NotificationTemplateRequestSchema
>;
export type NotificationTemplateResponse = z.infer<
  typeof NotificationTemplateResponseSchema
>;
export type GetNotificationTemplatesResponse = z.infer<
  typeof GetNotificationTemplatesResponseSchema
>;
export type SendTemplateNotificationRequest = z.infer<
  typeof SendTemplateNotificationRequestSchema
>;
export type NotificationSettingsRequest = z.infer<
  typeof NotificationSettingsRequestSchema
>;
export type NotificationSettingsResponse = z.infer<
  typeof NotificationSettingsResponseSchema
>;
export type GetNotificationSettingsResponse = z.infer<
  typeof GetNotificationSettingsResponseSchema
>;
export type GetNotificationStatsRequest = z.infer<
  typeof GetNotificationStatsRequestSchema
>;
export type GetNotificationStatsResponse = z.infer<
  typeof GetNotificationStatsResponseSchema
>;
