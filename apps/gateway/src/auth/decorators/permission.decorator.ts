import { SetMetadata } from "@nestjs/common";
import { ROLES_KEY, PERMISSIONS_KEY } from "../guards/roles.guard";

/**
 * 角色装饰器
 * @param roles 允许访问的角色列表
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

/**
 * 权限装饰器
 * @param permissions 需要的权限码列表
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * 组合装饰器：需要管理员权限
 */
export const RequireAdmin = () => Roles("admin");

/**
 * 组合装饰器：需要HR权限
 */
export const RequireHR = () => Roles("hr", "admin");

/**
 * 组合装饰器：需要面试官权限
 */
export const RequireInterviewer = () => Roles("interviewer", "hr", "admin");

/**
 * 组合装饰器：用户管理权限
 */
export const RequireUserManagement = () =>
  Permissions("user:read", "user:create", "user:update");

/**
 * 组合装饰器：岗位管理权限
 */
export const RequirePostManagement = () =>
  Permissions("post:read", "post:create", "post:update");
