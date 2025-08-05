import { z } from "zod";

// 通用分页参数
export const PaginationParamsSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().positive().max(100).optional().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// 通用响应格式
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    code: z.number(),
    message: z.string(),
    data: dataSchema.optional(),
    meta: z
      .object({
        total: z.number().optional(),
        page: z.number().optional(),
        pageSize: z.number().optional(),
        totalPages: z.number().optional(),
      })
      .optional(),
  });

// 分页响应数据
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  });

// UUID 校验
export const UUIDSchema = z.string().uuid();

// 日期字符串校验
export const DateStringSchema = z.string().datetime();

// 文件上传大小限制（字节）
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// 密码校验规则
export const PasswordSchema = z
  .string()
  .min(6, "密码至少6位")
  .max(50, "密码最多50位")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "密码必须包含大小写字母和数字");

// 手机号校验
export const PhoneSchema = z
  .string()
  .regex(/^1[3-9]\d{9}$/, "请输入正确的手机号码");

// 邮箱校验
export const EmailSchema = z
  .string()
  .email("请输入正确的邮箱地址")
  .max(100, "邮箱地址过长");

// 工号校验
export const EmployeeNoSchema = z
  .string()
  .min(1, "工号不能为空")
  .max(20, "工号最多20位")
  .regex(/^[A-Za-z0-9]+$/, "工号只能包含字母和数字");

// 通用错误响应
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  code: z.number(),
  message: z.string(),
  errors: z
    .array(
      z.object({
        field: z.string(),
        message: z.string(),
      })
    )
    .optional(),
});

// 状态枚举
export const UserStatusSchema = z.enum(["ACTIVE", "DISABLED"]);
export const DepartmentStatusSchema = z.enum(["ACTIVE", "DISABLED"]);
export const PostStatusSchema = z.enum(["OPEN", "PAUSED", "CLOSED"]);
export const CandidateStatusSchema = z.enum([
  "NEW",
  "DEPARTMENT_ASSESSING",
  "DEPARTMENT_PASSED",
  "DEPARTMENT_FAILED",
  "INTERVIEWING",
  "OFFERED",
  "REJECTED",
]);
export const AssessmentResultSchema = z.enum(["PASSED", "FAILED", "PENDING"]);
export const InterviewStatusSchema = z.enum([
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);
export const InterviewTaskStatusSchema = z.enum([
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);
export const NotificationTypeSchema = z.enum(["SYSTEM", "EMAIL", "SMS"]);
export const LogResultSchema = z.enum(["SUCCESS", "FAILED", "PARTIAL"]);
export const PermissionTypeSchema = z.enum(["MENU", "BUTTON"]);
export const AttachmentCategorySchema = z.enum([
  "RESUME",
  "PORTFOLIO",
  "CERTIFICATE",
  "JOB_DESCRIPTION",
  "INTERVIEW_FEEDBACK",
  "CONTRACT",
  "OTHER",
]);

// 类型导出
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
export type ApiResponse<T = any> = {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
};
export type PaginatedResponse<T = any> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type UserStatus = z.infer<typeof UserStatusSchema>;
export type DepartmentStatus = z.infer<typeof DepartmentStatusSchema>;
export type PostStatus = z.infer<typeof PostStatusSchema>;
export type CandidateStatus = z.infer<typeof CandidateStatusSchema>;
export type AssessmentResult = z.infer<typeof AssessmentResultSchema>;
export type InterviewStatus = z.infer<typeof InterviewStatusSchema>;
export type InterviewTaskStatus = z.infer<typeof InterviewTaskStatusSchema>;
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type LogResult = z.infer<typeof LogResultSchema>;
export type PermissionType = z.infer<typeof PermissionTypeSchema>;
export type AttachmentCategory = z.infer<typeof AttachmentCategorySchema>;
