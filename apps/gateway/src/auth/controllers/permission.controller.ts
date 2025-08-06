import { Controller, Get, UseGuards, Request, Query } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { PermissionService, UserInfo } from "../permissions/permission.service";
import { Roles } from "../decorators/permission.decorator";

@Controller("auth/permissions")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  /**
   * 获取当前用户可访问的路径列表
   */
  @Get("my-access")
  getMyAccessiblePaths(@Request() req: any) {
    const userInfo: UserInfo = {
      id: req.user.sub || req.user.id,
      email: req.user.email,
      roles: req.user.roles || [],
      permissions: req.user.permissions || [],
      departments: req.user.departments || [],
    };

    return {
      accessiblePaths: this.permissionService.getUserAccessiblePaths(userInfo),
      userInfo,
    };
  }

  /**
   * 检查特定路径的权限
   */
  @Get("check")
  checkPermission(
    @Request() req: any,
    @Query("path") path: string,
    @Query("method") method: string = "GET"
  ) {
    const userInfo: UserInfo = {
      id: req.user.sub || req.user.id,
      email: req.user.email,
      roles: req.user.roles || [],
      permissions: req.user.permissions || [],
      departments: req.user.departments || [],
    };

    const result = this.permissionService.checkPermission(
      path,
      method,
      userInfo
    );

    return {
      path,
      method,
      ...result,
    };
  }

  /**
   * 获取所有权限规则配置（仅管理员）
   */
  @Get("rules")
  @Roles("admin")
  getAllPermissionRules() {
    return {
      rules: this.permissionService.getAllPermissionRules(),
    };
  }
}
