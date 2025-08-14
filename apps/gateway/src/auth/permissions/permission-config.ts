/**
 * 权限配置文件
 * 定义每个API路径的权限要求
 * 与 seed 脚本的权限代码保持一致
 */

export interface PermissionRule {
  path: string;
  method: string;
  roles?: string[]; // 需要的角色（与 seed 数据一致）
  department?: boolean; // 是否需要部门权限验证
  description?: string;
}

/**
 * API权限配置
 * 采用基于角色的访问控制(RBAC)，简化权限验证逻辑
 * 角色代码与 seed 脚本保持一致
 */
export const API_PERMISSION_CONFIG: PermissionRule[] = [
  // ===== 用户管理 =====
  {
    path: "/users",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "查看用户列表",
  },
  {
    path: "/users/:id",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "查看用户详情",
  },
  {
    path: "/users",
    method: "POST",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "创建用户",
  },
  {
    path: "/users/:id",
    method: "PUT",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "更新用户信息",
  },
  {
    path: "/users/:id",
    method: "DELETE",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "删除用户",
  },
  {
    path: "/users/:id/reset-password",
    method: "POST",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "重置用户密码",
  },
  {
    path: "/users/import",
    method: "POST",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "批量导入用户",
  },
  {
    path: "/users/export",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "批量导出用户",
  },

  // ===== 部门管理 =====
  {
    path: "/departments",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "查看部门列表",
  },
  {
    path: "/departments/:id",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "查看部门详情",
  },
  {
    path: "/departments",
    method: "POST",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "创建部门",
  },
  {
    path: "/departments/:id",
    method: "PUT",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "更新部门",
  },
  {
    path: "/departments/:id",
    method: "DELETE",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "删除部门",
  },

  // ===== 角色管理 =====
  {
    path: "/roles",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "查看角色列表",
  },
  {
    path: "/roles/:id",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "查看角色详情",
  },
  {
    path: "/roles",
    method: "POST",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "创建角色",
  },
  {
    path: "/roles/:id",
    method: "PUT",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "更新角色",
  },
  {
    path: "/roles/:id",
    method: "DELETE",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "删除角色",
  },
  {
    path: "/roles/:id/permissions",
    method: "POST",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "分配角色权限",
  },

  // ===== 组织管理 =====
  {
    path: "/organizations",
    method: "GET",
    roles: ["SUPER_ADMIN"],
    description: "查看组织列表",
  },
  {
    path: "/organizations/:id",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "查看组织详情",
  },
  {
    path: "/organizations",
    method: "POST",
    roles: ["SUPER_ADMIN"],
    description: "创建组织",
  },
  {
    path: "/organizations/:id",
    method: "PUT",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "更新组织",
  },
  {
    path: "/organizations/:id",
    method: "DELETE",
    roles: ["SUPER_ADMIN"],
    description: "删除组织",
  },
  {
    path: "/organizations/:orgId/invitations",
    method: "POST",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "邀请用户加入组织",
  },
  {
    path: "/organizations/invitations/:invitationId/respond",
    method: "POST",
    description: "响应组织邀请（任何已认证用户）",
  },
  {
    path: "/organizations/invitations/list",
    method: "GET",
    description: "查看邀请列表（任何已认证用户）",
  },

  // ===== 岗位管理 =====
  {
    path: "/posts",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "查看岗位列表",
  },
  {
    path: "/posts/:id",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "查看岗位详情",
  },
  {
    path: "/posts",
    method: "POST",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "创建岗位",
  },
  {
    path: "/posts/:id",
    method: "PUT",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "更新岗位",
  },
  {
    path: "/posts/:id",
    method: "DELETE",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "删除岗位",
  },
  {
    path: "/posts/:id/status",
    method: "PATCH",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "更新岗位状态",
  },

  // ===== 候选人管理 =====
  {
    path: "/candidates",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    department: true,
    description: "查看候选人列表（限部门）",
  },
  {
    path: "/candidates/:id",
    method: "GET",
    roles: [
      "SUPER_ADMIN",
      "ORG_ADMIN",
      "HR",
      "DEPARTMENT_LEADER",
      "INTERVIEWER",
    ],
    description: "查看候选人详情",
  },
  {
    path: "/candidates",
    method: "POST",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "创建候选人",
  },
  {
    path: "/candidates/:id",
    method: "PUT",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "更新候选人信息",
  },
  {
    path: "/candidates/:id",
    method: "DELETE",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "删除候选人",
  },
  {
    path: "/candidates/:id/status",
    method: "PATCH",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "更新候选人状态",
  },
  {
    path: "/candidates/import",
    method: "POST",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "批量导入候选人",
  },
  {
    path: "/candidates/export",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "批量导出候选人",
  },

  // ===== 面试管理 =====
  {
    path: "/interviews",
    method: "GET",
    roles: [
      "SUPER_ADMIN",
      "ORG_ADMIN",
      "HR",
      "DEPARTMENT_LEADER",
      "INTERVIEWER",
    ],
    description: "查看面试列表",
  },
  {
    path: "/interviews/:id",
    method: "GET",
    roles: [
      "SUPER_ADMIN",
      "ORG_ADMIN",
      "HR",
      "DEPARTMENT_LEADER",
      "INTERVIEWER",
    ],
    description: "查看面试详情",
  },
  {
    path: "/interviews",
    method: "POST",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "创建面试",
  },
  {
    path: "/interviews/:id",
    method: "PUT",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "更新面试信息",
  },
  {
    path: "/interviews/:id",
    method: "DELETE",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "删除面试",
  },
  {
    path: "/interviews/:id/start",
    method: "POST",
    roles: [
      "SUPER_ADMIN",
      "ORG_ADMIN",
      "HR",
      "DEPARTMENT_LEADER",
      "INTERVIEWER",
    ],
    description: "开始面试",
  },
  {
    path: "/interviews/:id/cancel",
    method: "POST",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "取消面试",
  },
  {
    path: "/interviews/:id/feedback",
    method: "POST",
    roles: [
      "SUPER_ADMIN",
      "ORG_ADMIN",
      "HR",
      "DEPARTMENT_LEADER",
      "INTERVIEWER",
    ],
    description: "提交面试反馈",
  },

  // ===== 评估管理（待办事项） =====
  {
    path: "/assessments",
    method: "GET",
    roles: [
      "SUPER_ADMIN",
      "ORG_ADMIN",
      "HR",
      "DEPARTMENT_LEADER",
      "INTERVIEWER",
    ],
    description: "查看评估列表（我的待办）",
  },
  {
    path: "/assessments/:id",
    method: "GET",
    roles: [
      "SUPER_ADMIN",
      "ORG_ADMIN",
      "HR",
      "DEPARTMENT_LEADER",
      "INTERVIEWER",
    ],
    description: "查看评估详情",
  },
  {
    path: "/assessments",
    method: "POST",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "分配评估任务",
  },
  {
    path: "/assessments/:id",
    method: "PUT",
    roles: [
      "SUPER_ADMIN",
      "ORG_ADMIN",
      "HR",
      "DEPARTMENT_LEADER",
      "INTERVIEWER",
    ],
    description: "执行评估",
  },
  {
    path: "/assessments/:id/confirm",
    method: "POST",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "确认评估结果",
  },

  // ===== 文件管理 =====
  {
    path: "/files/upload",
    method: "POST",
    description: "上传文件（任何已认证用户）",
  },
  {
    path: "/files/:id",
    method: "GET",
    description: "下载文件（任何已认证用户）",
  },
  {
    path: "/files/:id",
    method: "DELETE",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "删除文件",
  },

  // ===== 通知管理 =====
  {
    path: "/notifications",
    method: "GET",
    description: "查看通知列表（任何已认证用户）",
  },
  {
    path: "/notifications/:id",
    method: "PUT",
    description: "标记通知已读（任何已认证用户）",
  },

  // ===== 统计分析 =====
  {
    path: "/analytics",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "查看统计分析",
  },
  {
    path: "/analytics/department",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    department: true,
    description: "查看部门统计分析",
  },

  // ===== 系统日志 =====
  {
    path: "/logs",
    method: "GET",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "查看系统日志",
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
  "/auth/refresh",
  "/auth/send-verification-code",
];
