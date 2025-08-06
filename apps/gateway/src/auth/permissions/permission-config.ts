/**
 * 权限配置文件
 * 定义每个API路径的权限要求
 */

export interface PermissionRule {
  path: string;
  method: string;
  permissions?: string[]; // 需要的权限码
  roles?: string[]; // 需要的角色
  department?: boolean; // 是否需要部门权限验证
  description?: string;
}

/**
 * API权限配置
 * 采用最小权限原则，明确定义每个接口的访问要求
 */
export const API_PERMISSION_CONFIG: PermissionRule[] = [
  // ===== 用户管理 =====
  {
    path: "/users",
    method: "GET",
    permissions: ["user:read"],
    description: "查看用户列表",
  },
  {
    path: "/users/:id",
    method: "GET",
    permissions: ["user:read"],
    description: "查看用户详情",
  },
  {
    path: "/users",
    method: "POST",
    permissions: ["user:create"],
    roles: ["admin", "hr"],
    description: "创建用户",
  },
  {
    path: "/users/:id",
    method: "PUT",
    permissions: ["user:update"],
    description: "更新用户信息",
  },
  {
    path: "/users/:id",
    method: "DELETE",
    permissions: ["user:delete"],
    roles: ["admin"],
    description: "删除用户",
  },

  // ===== 岗位管理 =====
  {
    path: "/posts",
    method: "GET",
    permissions: ["post:read"],
    description: "查看岗位列表",
  },
  {
    path: "/posts/:id",
    method: "GET",
    permissions: ["post:read"],
    description: "查看岗位详情",
  },
  {
    path: "/posts",
    method: "POST",
    permissions: ["post:create"],
    roles: ["hr", "admin"],
    description: "创建岗位",
  },
  {
    path: "/posts/:id",
    method: "PUT",
    permissions: ["post:update"],
    roles: ["hr", "admin"],
    description: "更新岗位",
  },
  {
    path: "/posts/:id",
    method: "DELETE",
    permissions: ["post:delete"],
    roles: ["hr", "admin"],
    description: "删除岗位",
  },
  {
    path: "/posts/:id/status",
    method: "PATCH",
    permissions: ["post:status:update"],
    roles: ["hr", "admin"],
    description: "更新岗位状态",
  },

  // ===== 候选人管理 =====
  {
    path: "/candidates",
    method: "GET",
    permissions: ["candidate:read"],
    department: true,
    description: "查看候选人列表（限部门）",
  },
  {
    path: "/candidates/:id",
    method: "GET",
    permissions: ["candidate:read"],
    description: "查看候选人详情",
  },
  {
    path: "/candidates",
    method: "POST",
    permissions: ["candidate:create"],
    description: "创建候选人",
  },
  {
    path: "/candidates/:id",
    method: "PUT",
    permissions: ["candidate:update"],
    description: "更新候选人信息",
  },
  {
    path: "/candidates/:id",
    method: "DELETE",
    permissions: ["candidate:delete"],
    roles: ["hr", "admin"],
    description: "删除候选人",
  },

  // ===== 面试管理 =====
  {
    path: "/interviews",
    method: "GET",
    permissions: ["interview:read"],
    description: "查看面试列表",
  },
  {
    path: "/interviews/:id",
    method: "GET",
    permissions: ["interview:read"],
    description: "查看面试详情",
  },
  {
    path: "/interviews",
    method: "POST",
    permissions: ["interview:create"],
    roles: ["hr", "interviewer", "admin"],
    description: "创建面试",
  },
  {
    path: "/interviews/:id",
    method: "PUT",
    permissions: ["interview:update"],
    description: "更新面试信息",
  },
  {
    path: "/interviews/:id",
    method: "DELETE",
    permissions: ["interview:delete"],
    roles: ["hr", "admin"],
    description: "删除面试",
  },

  // ===== 角色权限管理 =====
  {
    path: "/roles",
    method: "GET",
    permissions: ["role:read"],
    roles: ["admin"],
    description: "查看角色列表",
  },
  {
    path: "/roles/:id",
    method: "GET",
    permissions: ["role:read"],
    roles: ["admin"],
    description: "查看角色详情",
  },
  {
    path: "/roles",
    method: "POST",
    permissions: ["role:create"],
    roles: ["admin"],
    description: "创建角色",
  },
  {
    path: "/roles/:id",
    method: "PUT",
    permissions: ["role:update"],
    roles: ["admin"],
    description: "更新角色",
  },
  {
    path: "/roles/:id",
    method: "DELETE",
    permissions: ["role:delete"],
    roles: ["admin"],
    description: "删除角色",
  },
  {
    path: "/roles/permissions",
    method: "GET",
    permissions: ["permission:read"],
    roles: ["admin"],
    description: "查看权限列表",
  },

  // ===== 部门管理 =====
  {
    path: "/departments",
    method: "GET",
    permissions: ["department:read"],
    description: "查看部门列表",
  },
  {
    path: "/departments/:id",
    method: "GET",
    permissions: ["department:read"],
    description: "查看部门详情",
  },
  {
    path: "/departments",
    method: "POST",
    permissions: ["department:create"],
    roles: ["admin"],
    description: "创建部门",
  },
  {
    path: "/departments/:id",
    method: "PUT",
    permissions: ["department:update"],
    roles: ["admin"],
    description: "更新部门",
  },
  {
    path: "/departments/:id",
    method: "DELETE",
    permissions: ["department:delete"],
    roles: ["admin"],
    description: "删除部门",
  },

  // ===== 系统管理 =====
  {
    path: "/system/settings",
    method: "GET",
    permissions: ["system:read"],
    roles: ["admin"],
    description: "查看系统设置",
  },
  {
    path: "/system/settings",
    method: "PUT",
    permissions: ["system:update"],
    roles: ["admin"],
    description: "更新系统设置",
  },

  // ===== 文件管理 =====
  {
    path: "/files/upload",
    method: "POST",
    permissions: ["file:upload"],
    description: "上传文件",
  },
  {
    path: "/files/:id",
    method: "GET",
    permissions: ["file:read"],
    description: "下载文件",
  },
  {
    path: "/files/:id",
    method: "DELETE",
    permissions: ["file:delete"],
    description: "删除文件",
  },

  // ===== 通知管理 =====
  {
    path: "/notifications",
    method: "GET",
    permissions: ["notification:read"],
    description: "查看通知列表",
  },
  {
    path: "/notifications/:id",
    method: "PUT",
    permissions: ["notification:update"],
    description: "标记通知已读",
  },

  // ===== 评估管理 =====
  {
    path: "/assessments",
    method: "GET",
    permissions: ["assessment:read"],
    description: "查看评估列表",
  },
  {
    path: "/assessments/:id",
    method: "GET",
    permissions: ["assessment:read"],
    description: "查看评估详情",
  },
  {
    path: "/assessments",
    method: "POST",
    permissions: ["assessment:create"],
    description: "创建评估",
  },
  {
    path: "/assessments/:id",
    method: "PUT",
    permissions: ["assessment:update"],
    description: "更新评估",
  },
  {
    path: "/assessments/:id",
    method: "DELETE",
    permissions: ["assessment:delete"],
    roles: ["hr", "admin"],
    description: "删除评估",
  },
];

/**
 * 公开访问的路径（无需权限验证）
 */
export const PUBLIC_PATHS = [
  "/health",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/activate",
];
