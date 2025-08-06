import { SetMetadata } from "@nestjs/common";
import { ROLES_KEY, PERMISSIONS_KEY } from "../guards/roles.guard";

/**
 * 角色装饰器
 * 注意：仅用于Gateway自身的接口，不用于代理的业务API
 * @param roles 允许访问的角色列表
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

/**
 * 权限装饰器
 * 注意：仅用于Gateway自身的接口，不用于代理的业务API
 * @param permissions 需要的权限码列表
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * 组合装饰器：需要管理员权限
 * 适用场景：Gateway的权限管理、系统配置等接口
 */
export const RequireAdmin = () => Roles("admin");

/**
 * 组合装饰器：需要HR权限
 * 适用场景：Gateway的用户管理等接口
 */
export const RequireHR = () => Roles("hr", "admin");

/**
 * 注意：以下装饰器主要用于Gateway自身的管理接口
 * 业务API的权限控制通过 permission-config.ts 配置文件管理
 */
