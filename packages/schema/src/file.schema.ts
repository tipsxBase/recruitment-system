import { z } from "zod";
import {
  UUIDSchema,
  PaginationParamsSchema,
  AttachmentCategorySchema,
} from "./common.schema.js";

// 文件基础信息
export const FileBaseSchema = z.object({
  id: UUIDSchema,
  url: z.string().url(),
  fileName: z.string(),
  originalName: z.string(),
  fileType: z.string(),
  fileSize: z.number().int().positive(),
  category: AttachmentCategorySchema,
});

// 文件详细信息
export const FileDetailSchema = FileBaseSchema.extend({
  description: z.string().optional(),
  entityType: z.string(),
  entityId: UUIDSchema,
  uploader: z.object({
    id: UUIDSchema,
    username: z.string(),
    email: z.string().optional(),
  }),
  downloadCount: z.number().default(0),
  isPublic: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 文件上传请求
export const UploadFileRequestSchema = z.object({
  category: AttachmentCategorySchema.default("OTHER"),
  entityType: z.string().optional(),
  entityId: UUIDSchema.optional(),
  description: z.string().max(200, "文件描述最多200字").optional(),
  isPublic: z.boolean().default(false),
});

// 文件上传响应
export const UploadFileResponseSchema = FileBaseSchema.extend({
  uploadedAt: z.string(),
});

// 获取文件列表请求
export const GetFilesRequestSchema = PaginationParamsSchema.extend({
  category: AttachmentCategorySchema.optional(),
  entityType: z.string().optional(),
  entityId: UUIDSchema.optional(),
  uploaderId: UUIDSchema.optional(),
  keyword: z.string().optional(),
  fileType: z.string().optional(),
  isPublic: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// 获取文件列表响应
export const GetFilesResponseSchema = z.object({
  files: z.array(FileDetailSchema),
});

// 删除文件响应
export const DeleteFileResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// 批量上传文件请求
export const BatchUploadFilesRequestSchema = z.object({
  files: z
    .array(
      z.object({
        fileName: z.string(),
        originalName: z.string(),
        fileType: z.string(),
        fileSize: z.number().int().positive(),
        base64Data: z.string(),
        category: AttachmentCategorySchema.default("OTHER"),
        description: z.string().max(200, "文件描述最多200字").optional(),
      })
    )
    .min(1, "文件列表不能为空")
    .max(20, "最多批量上传20个文件"),
  entityType: z.string().optional(),
  entityId: UUIDSchema.optional(),
});

// 批量上传文件响应
export const BatchUploadFilesResponseSchema = z.object({
  success: z.number(),
  failed: z.number(),
  files: z.array(UploadFileResponseSchema),
  errors: z.array(
    z.object({
      fileName: z.string(),
      error: z.string(),
    })
  ),
});

// 文件分享请求
export const ShareFileRequestSchema = z.object({
  expiresIn: z.number().int().positive().max(365).default(7), // 天数
  password: z.string().optional(),
  downloadLimit: z.number().int().positive().optional(),
  allowDownload: z.boolean().default(true),
  allowPreview: z.boolean().default(true),
});

// 文件分享响应
export const ShareFileResponseSchema = z.object({
  shareId: UUIDSchema,
  shareUrl: z.string().url(),
  expiresAt: z.string(),
  downloadLimit: z.number().optional(),
  password: z.string().optional(),
});

// 获取分享文件信息请求
export const GetSharedFileRequestSchema = z.object({
  shareId: UUIDSchema,
  password: z.string().optional(),
});

// 获取分享文件信息响应
export const GetSharedFileResponseSchema = z.object({
  file: FileDetailSchema.omit({ uploader: true }),
  uploader: z.object({
    username: z.string(),
  }),
  shareInfo: z.object({
    expiresAt: z.string(),
    downloadCount: z.number(),
    downloadLimit: z.number().optional(),
    allowDownload: z.boolean(),
    allowPreview: z.boolean(),
  }),
});

// 文件预览请求
export const PreviewFileRequestSchema = z.object({
  width: z.number().int().positive().max(2000).optional(),
  height: z.number().int().positive().max(2000).optional(),
  page: z.number().int().positive().optional(), // 对于PDF等多页文档
});

// 文件预览响应
export const PreviewFileResponseSchema = z.object({
  previewUrl: z.string().url(),
  previewType: z.enum(["image", "pdf", "text", "unsupported"]),
  totalPages: z.number().optional(),
});

// 文件统计请求
export const GetFileStatsRequestSchema = z.object({
  entityType: z.string().optional(),
  entityId: UUIDSchema.optional(),
  uploaderId: UUIDSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// 文件统计响应
export const GetFileStatsResponseSchema = z.object({
  totalFiles: z.number(),
  totalSize: z.number(), // 字节
  totalDownloads: z.number(),
  categoryDistribution: z.array(
    z.object({
      category: AttachmentCategorySchema,
      count: z.number(),
      size: z.number(),
    })
  ),
  typeDistribution: z.array(
    z.object({
      fileType: z.string(),
      count: z.number(),
      size: z.number(),
    })
  ),
  uploaderStats: z.array(
    z.object({
      uploaderId: UUIDSchema,
      uploaderName: z.string(),
      fileCount: z.number(),
      totalSize: z.number(),
    })
  ),
  monthlyStats: z.array(
    z.object({
      month: z.string(),
      uploadCount: z.number(),
      uploadSize: z.number(),
      downloadCount: z.number(),
    })
  ),
});

// 文件压缩请求
export const CompressFilesRequestSchema = z.object({
  fileIds: z
    .array(UUIDSchema)
    .min(1, "文件ID列表不能为空")
    .max(100, "最多压缩100个文件"),
  archiveName: z.string().max(100, "压缩包名称最多100字").optional(),
  password: z.string().optional(),
});

// 文件压缩响应
export const CompressFilesResponseSchema = z.object({
  archiveId: UUIDSchema,
  downloadUrl: z.string().url(),
  fileName: z.string(),
  fileSize: z.number(),
  expiresAt: z.string(),
});

// 清理文件请求
export const CleanupFilesRequestSchema = z.object({
  olderThanDays: z.number().int().positive().default(30),
  orphaned: z.boolean().default(true), // 清理孤立文件
  categories: z.array(AttachmentCategorySchema).optional(),
  dryRun: z.boolean().default(false), // 是否只是预览而不实际删除
});

// 清理文件响应
export const CleanupFilesResponseSchema = z.object({
  candidateFiles: z.number(),
  deletedSize: z.number(), // 字节
  errors: z.array(
    z.object({
      fileId: UUIDSchema,
      fileName: z.string(),
      error: z.string(),
    })
  ),
  dryRun: z.boolean(),
});

// 文件重命名请求
export const RenameFileRequestSchema = z.object({
  originalName: z.string().min(1, "文件名不能为空").max(255, "文件名最多255字"),
  description: z.string().max(200, "文件描述最多200字").optional(),
});

// 文件重命名响应
export const RenameFileResponseSchema = z.object({
  id: UUIDSchema,
  originalName: z.string(),
  updatedAt: z.string(),
});

// 文件移动请求
export const MoveFileRequestSchema = z.object({
  targetEntityType: z.string(),
  targetEntityId: UUIDSchema,
  category: AttachmentCategorySchema.optional(),
});

// 文件移动响应
export const MoveFileResponseSchema = z.object({
  id: UUIDSchema,
  entityType: z.string(),
  entityId: UUIDSchema,
  category: AttachmentCategorySchema,
  updatedAt: z.string(),
});

// 类型导出
export type FileBase = z.infer<typeof FileBaseSchema>;
export type FileDetail = z.infer<typeof FileDetailSchema>;
export type UploadFileRequest = z.infer<typeof UploadFileRequestSchema>;
export type UploadFileResponse = z.infer<typeof UploadFileResponseSchema>;
export type GetFilesRequest = z.infer<typeof GetFilesRequestSchema>;
export type GetFilesResponse = z.infer<typeof GetFilesResponseSchema>;
export type DeleteFileResponse = z.infer<typeof DeleteFileResponseSchema>;
export type BatchUploadFilesRequest = z.infer<
  typeof BatchUploadFilesRequestSchema
>;
export type BatchUploadFilesResponse = z.infer<
  typeof BatchUploadFilesResponseSchema
>;
export type ShareFileRequest = z.infer<typeof ShareFileRequestSchema>;
export type ShareFileResponse = z.infer<typeof ShareFileResponseSchema>;
export type GetSharedFileRequest = z.infer<typeof GetSharedFileRequestSchema>;
export type GetSharedFileResponse = z.infer<typeof GetSharedFileResponseSchema>;
export type PreviewFileRequest = z.infer<typeof PreviewFileRequestSchema>;
export type PreviewFileResponse = z.infer<typeof PreviewFileResponseSchema>;
export type GetFileStatsRequest = z.infer<typeof GetFileStatsRequestSchema>;
export type GetFileStatsResponse = z.infer<typeof GetFileStatsResponseSchema>;
export type CompressFilesRequest = z.infer<typeof CompressFilesRequestSchema>;
export type CompressFilesResponse = z.infer<typeof CompressFilesResponseSchema>;
export type CleanupFilesRequest = z.infer<typeof CleanupFilesRequestSchema>;
export type CleanupFilesResponse = z.infer<typeof CleanupFilesResponseSchema>;
export type RenameFileRequest = z.infer<typeof RenameFileRequestSchema>;
export type RenameFileResponse = z.infer<typeof RenameFileResponseSchema>;
export type MoveFileRequest = z.infer<typeof MoveFileRequestSchema>;
export type MoveFileResponse = z.infer<typeof MoveFileResponseSchema>;
