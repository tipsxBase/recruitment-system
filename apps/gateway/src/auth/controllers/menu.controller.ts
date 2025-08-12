import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { MenuService } from "../services/menu.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { ResponseUtils } from "@recruitment/shared";

/**
 * 菜单控制器
 * 负责处理用户菜单相关的 API 请求
 */
@Controller("menu")
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private menuService: MenuService) {}

  /**
   * 获取当前用户的菜单权限
   * 根据用户的角色和权限，返回用户可访问的菜单树结构
   *
   * @param req 请求对象，包含用户信息
   * @returns 用户可访问的菜单树结构
   */
  @Get("user-menus")
  async getUserMenus(@Request() req: any) {
    const userId = req.user.sub;
    const menus = await this.menuService.getUserMenus(userId);

    return ResponseUtils.success(menus, "获取菜单成功");
  }

  /**
   * 获取当前用户的按钮权限
   * 返回用户在各个页面可以使用的按钮权限代码列表
   *
   * @param req 请求对象，包含用户信息
   * @returns 用户可使用的按钮权限代码列表
   */
  @Get("user-permissions")
  async getUserPermissions(@Request() req: any) {
    const userId = req.user.sub;
    const permissions = await this.menuService.getUserPermissions(userId);

    return ResponseUtils.success(permissions, "获取权限成功");
  }
}
