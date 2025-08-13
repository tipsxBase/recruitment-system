import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { Request } from "express";
import { PermissionService, UserInfo } from "../permissions/permission.service";

@Injectable()
export class ApiPermissionGuard implements CanActivate {
  private readonly logger = new Logger(ApiPermissionGuard.name);

  constructor(private permissionService: PermissionService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const { path, method, user } = request as any;

    // 提取用户信息
    const userInfo: UserInfo | undefined = user
      ? {
          id: user.sub || user.id,
          email: user.email,
          // 从 JWT payload 中获取角色代码数组
          roles: user.roles || [],
          // 从 JWT payload 中获取权限代码数组
          permissions: user.permissions || [],
          departments: user.departments || [],
        }
      : undefined;

    // 记录权限检查日志
    this.logger.debug(`Permission check: ${method} ${path}`, {
      userId: userInfo?.id,
      userRoles: userInfo?.roles,
      userPermissions: userInfo?.permissions?.slice(0, 5), // 只记录前5个权限，避免日志过长
    });

    // 执行权限检查
    const checkResult = this.permissionService.checkPermission(
      path,
      method,
      userInfo
    );

    if (!checkResult.allowed) {
      this.logger.warn(`Permission denied: ${method} ${path}`, {
        userId: userInfo?.id,
        reason: checkResult.reason,
        matchedRule: checkResult.matchedRule,
      });

      // 区分认证错误和授权错误
      if (!userInfo) {
        throw new UnauthorizedException("Authentication required");
      } else {
        throw new ForbiddenException(`Access denied: ${checkResult.reason}`);
      }
    }

    this.logger.debug(`Permission granted: ${method} ${path}`, {
      userId: userInfo?.id,
      reason: checkResult.reason,
    });

    return true;
  }
}
