import { z } from "zod";
import { UUIDSchema } from "./common.schema.js";

// 权限类型枚举
export const PermissionTypeSchema = z.enum(["MENU", "BUTTON"]);

// 菜单项 Schema（基础版本，不包含子菜单）
const BaseMenuItemSchema = z.object({
  id: UUIDSchema,
  name: z.string().describe("菜单名称"),
  code: z.string().describe("菜单编码"),
  type: PermissionTypeSchema.describe("权限类型"),
  parentId: UUIDSchema.optional().describe("父级菜单ID"),
});

// 菜单项 Schema（完整版本，包含递归子菜单）
export const MenuItemSchema: z.ZodType<{
  id: string;
  name: string;
  code: string;
  type: "MENU" | "BUTTON";
  parentId?: string;
  children?: Array<{
    id: string;
    name: string;
    code: string;
    type: "MENU" | "BUTTON";
    parentId?: string;
    children?: any;
  }>;
}> = BaseMenuItemSchema.extend({
  children: z
    .array(z.lazy(() => MenuItemSchema))
    .optional()
    .describe("子菜单列表"),
});

// 用户菜单响应 Schema
export const UserMenusResponseSchema = z.object({
  success: z.boolean().default(true),
  data: z.array(MenuItemSchema).describe("用户可访问的菜单树"),
  message: z.string().optional(),
});

// 用户权限响应 Schema
export const UserPermissionsResponseSchema = z.object({
  success: z.boolean().default(true),
  data: z.array(z.string()).describe("用户可使用的按钮权限代码列表"),
  message: z.string().optional(),
});

// TypeScript 类型导出
export type PermissionType = z.infer<typeof PermissionTypeSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type UserMenusResponse = z.infer<typeof UserMenusResponseSchema>;
export type UserPermissionsResponse = z.infer<
  typeof UserPermissionsResponseSchema
>;
