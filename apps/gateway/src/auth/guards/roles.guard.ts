import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const ROLES_KEY = "roles";
export const PERMISSIONS_KEY = "permissions";

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取装饰器设置的角色和权限要求
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    // 如果没有设置任何要求，允许访问
    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      this.logger.warn("User not found in request");
      return false;
    }

    const userRoles = user.roles || [];
    const userPermissions = user.permissions || [];

    // 检查角色权限
    const hasRequiredRole =
      !requiredRoles || requiredRoles.some((role) => userRoles.includes(role));

    // 检查权限码
    const hasRequiredPermission =
      !requiredPermissions ||
      requiredPermissions.some((permission) =>
        userPermissions.includes(permission)
      );

    const hasAccess = hasRequiredRole && hasRequiredPermission;

    if (!hasAccess) {
      this.logger.warn("Access denied", {
        userId: user.sub || user.id,
        requiredRoles,
        userRoles,
        requiredPermissions,
        userPermissions,
      });
    }

    return hasAccess;
  }
}
