import { Injectable } from "@nestjs/common";
import {
  API_PERMISSION_CONFIG,
  PUBLIC_PATHS,
  PermissionRule,
} from "./permission-config";

export interface UserInfo {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
  departments: string[];
}

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  matchedRule?: PermissionRule;
}

@Injectable()
export class PermissionService {
  /**
   * 检查用户是否有权限访问指定的API
   */
  checkPermission(
    path: string,
    method: string,
    user?: UserInfo
  ): PermissionCheckResult {
    // 1. 检查是否为公开路径
    if (this.isPublicPath(path)) {
      return { allowed: true, reason: "Public path" };
    }

    // 2. 未认证用户不能访问受保护的资源
    if (!user) {
      return {
        allowed: false,
        reason: "Authentication required",
      };
    }

    // 3. 查找匹配的权限规则
    const matchedRule = this.findMatchingRule(path, method);

    if (!matchedRule) {
      // 没有配置权限规则的接口，默认允许已认证用户访问
      return {
        allowed: true,
        reason:
          "No specific permission rule found, allowing authenticated user",
      };
    }

    // 4. 验证权限规则
    return this.validatePermissionRule(matchedRule, user);
  }

  /**
   * 检查是否为公开路径
   */
  private isPublicPath(path: string): boolean {
    return PUBLIC_PATHS.some((publicPath) => {
      if (publicPath.includes("*")) {
        const pattern = publicPath.replace(/\*/g, ".*");
        return new RegExp(`^${pattern}$`).test(path);
      }
      return path === publicPath || path.startsWith(publicPath);
    });
  }

  /**
   * 查找匹配的权限规则
   */
  private findMatchingRule(
    path: string,
    method: string
  ): PermissionRule | null {
    return (
      API_PERMISSION_CONFIG.find((rule) => {
        return (
          this.pathMatches(rule.path, path) &&
          rule.method.toLowerCase() === method.toLowerCase()
        );
      }) || null
    );
  }

  /**
   * 路径匹配检查（支持参数化路径 :id）
   */
  private pathMatches(rulePath: string, requestPath: string): boolean {
    // 处理参数化路径，如 /users/:id
    const rulePattern = rulePath
      .replace(/:[^/]+/g, "[^/]+") // :id -> [^/]+
      .replace(/\//g, "\\/"); // 转义斜杠

    const regex = new RegExp(`^${rulePattern}$`);
    return regex.test(requestPath);
  }

  /**
   * 验证权限规则
   */
  private validatePermissionRule(
    rule: PermissionRule,
    user: UserInfo
  ): PermissionCheckResult {
    const checks: Array<{ passed: boolean; reason: string }> = [];

    // 1. 检查角色权限
    if (rule.roles && rule.roles.length > 0) {
      const hasRequiredRole = rule.roles.some((role) =>
        user.roles.includes(role)
      );
      checks.push({
        passed: hasRequiredRole,
        reason: hasRequiredRole
          ? "Role check passed"
          : `Required roles: ${rule.roles.join(", ")}, user roles: ${user.roles.join(", ")}`,
      });
    }

    // 2. 检查权限码
    if (rule.permissions && rule.permissions.length > 0) {
      const hasRequiredPermission = rule.permissions.some((permission) =>
        user.permissions.includes(permission)
      );
      checks.push({
        passed: hasRequiredPermission,
        reason: hasRequiredPermission
          ? "Permission check passed"
          : `Required permissions: ${rule.permissions.join(", ")}, user permissions: ${user.permissions.join(", ")}`,
      });
    }

    // 3. 检查部门权限（如果需要）
    if (rule.department) {
      const hasDepartment = user.departments && user.departments.length > 0;
      checks.push({
        passed: hasDepartment,
        reason: hasDepartment
          ? "Department check passed"
          : "User must belong to at least one department",
      });
    }

    // 如果没有任何检查条件，默认允许
    if (checks.length === 0) {
      return {
        allowed: true,
        reason: "No specific restrictions",
        matchedRule: rule,
      };
    }

    // 所有检查都必须通过
    const failedCheck = checks.find((check) => !check.passed);
    if (failedCheck) {
      return {
        allowed: false,
        reason: failedCheck.reason,
        matchedRule: rule,
      };
    }

    return {
      allowed: true,
      reason: "All permission checks passed",
      matchedRule: rule,
    };
  }

  /**
   * 获取用户可访问的路径列表（用于调试）
   */
  getUserAccessiblePaths(
    user: UserInfo
  ): Array<{ path: string; method: string; description?: string }> {
    const accessiblePaths: Array<{
      path: string;
      method: string;
      description?: string;
    }> = [];

    // 添加公开路径
    PUBLIC_PATHS.forEach((path) => {
      accessiblePaths.push({ path, method: "ALL", description: "Public path" });
    });

    // 检查配置的权限路径
    API_PERMISSION_CONFIG.forEach((rule) => {
      const checkResult = this.validatePermissionRule(rule, user);
      if (checkResult.allowed) {
        accessiblePaths.push({
          path: rule.path,
          method: rule.method,
          description: rule.description,
        });
      }
    });

    return accessiblePaths;
  }

  /**
   * 获取权限规则列表（用于管理界面）
   */
  getAllPermissionRules(): PermissionRule[] {
    return API_PERMISSION_CONFIG;
  }
}
