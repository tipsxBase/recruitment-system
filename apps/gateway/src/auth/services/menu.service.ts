import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@recruitment/database";
import type { MenuItem } from "@recruitment/schema";

/**
 * 菜单服务
 * 负责处理用户菜单权限的业务逻辑
 */
@Injectable()
export class MenuService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 获取用户的菜单权限
   * 根据用户的角色权限，返回用户可访问的菜单树结构
   *
   * @param userId 用户ID
   * @returns 菜单树结构数组
   */
  async getUserMenus(userId: string): Promise<MenuItem[]> {
    // 1. 获取用户的所有权限
    const userPermissions = await this.getUserPermissionsFromDB(userId);

    // 2. 筛选出菜单类型的权限
    const menuPermissions = userPermissions.filter((p) => p.type === "MENU");

    // 3. 构建菜单树结构
    const menuTree = this.buildMenuTree(menuPermissions);

    return menuTree;
  }

  /**
   * 获取用户的按钮权限
   * 返回用户可使用的所有按钮权限代码
   *
   * @param userId 用户ID
   * @returns 按钮权限代码数组
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    // 1. 获取用户的所有权限
    const userPermissions = await this.getUserPermissionsFromDB(userId);

    // 2. 筛选出按钮类型的权限，返回权限代码
    const buttonPermissions = userPermissions
      .filter((p) => p.type === "BUTTON")
      .map((p) => p.code)
      .filter((code) => code !== null) as string[];

    return buttonPermissions;
  }

  /**
   * 从数据库获取用户的所有权限
   * 通过用户角色关联查询用户拥有的所有权限
   *
   * @param userId 用户ID
   * @returns 权限列表
   */
  private async getUserPermissionsFromDB(userId: string) {
    // 查询用户的所有角色及其关联的权限
    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId: userId,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    // 提取所有权限，去重（用户可能通过多个角色获得相同权限）
    const allPermissions = userRoles.flatMap(
      (userRole) => userRole.role.permissions
    );

    // 去重：根据权限ID去重
    const uniquePermissions = allPermissions.filter(
      (permission, index, self) =>
        index === self.findIndex((p) => p.id === permission.id)
    );

    return uniquePermissions;
  }

  /**
   * 构建菜单树结构
   * 将扁平的菜单权限数据构建成树形结构
   *
   * @param permissions 菜单权限列表
   * @returns 菜单树结构
   */
  private buildMenuTree(permissions: any[]): MenuItem[] {
    // 创建权限映射表
    const permissionMap = new Map();
    permissions.forEach((permission) => {
      permissionMap.set(permission.id, {
        ...permission,
        children: [],
      });
    });

    // 构建树结构
    const rootMenus: MenuItem[] = [];
    permissions.forEach((permission) => {
      const menuItem = permissionMap.get(permission.id);

      if (permission.parentId && permissionMap.has(permission.parentId)) {
        // 有父级菜单，添加到父级的children中
        const parent = permissionMap.get(permission.parentId);
        parent.children.push(menuItem);
      } else {
        // 没有父级或父级不在权限列表中，作为根菜单
        rootMenus.push(menuItem);
      }
    });

    // 递归删除空的children数组
    const cleanTree = (nodes: MenuItem[]): MenuItem[] => {
      return nodes.map((node) => {
        const cleanNode: MenuItem = {
          id: node.id,
          name: node.name,
          code: node.code,
          type: node.type,
          sort: node.sort || 0,
          hidden: node.hidden || false,
        };

        if (node.parentId) {
          cleanNode.parentId = node.parentId;
        }

        if (node.path) {
          cleanNode.path = node.path;
        }

        if (node.icon) {
          cleanNode.icon = node.icon;
        }

        if (node.children && node.children.length > 0) {
          cleanNode.children = cleanTree(node.children);
        }

        return cleanNode;
      });
    };

    return cleanTree(rootMenus);
  }
}
