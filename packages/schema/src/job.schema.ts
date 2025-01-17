import { paginationSchema } from "@/common-schema";
import { z } from "zod";

export const createJobSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "岗位名称不能为空")
    .max(50, "岗位名称最大不能超过50个字"),
  description: z.string().max(1000).optional(),
  status: z.enum(["active", "inactive"], { message: "岗位状态不正确" }),
});

export type CreateJobDto = z.infer<typeof createJobSchema>;

export const updateJobSchema = z.object({
  id: z.number().min(1, "岗位ID不能为空"),
  name: z
    .string()
    .trim()
    .min(1, "岗位名称不能为空")
    .max(50, "岗位名称最大不能超过50个字")
    .optional(),
  description: z.string().max(1000).optional(),
  status: z
    .enum(["active", "inactive"], { message: "岗位状态不正确" })
    .optional(),
});

export type UpdateJobDto = z.infer<typeof updateJobSchema>;

export const queryJobListPaginationSchema = paginationSchema.extend({
  name: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type QueryJobListPaginationDto = z.infer<
  typeof queryJobListPaginationSchema
>;
