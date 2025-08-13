/**
 * 权限配置文件
 * 定义每个API路径的权限要求
 * 与 seed 脚本的权限代码保持一致
 */

export interface PermissionRule {
  path: string;
  method: string;
  permissions?: string[]; // 需要的权限码（与 seed 数据一致）
  roles?: string[]; // 需要的角色（与 seed 数据一致）
  department?: boolean; // 是否需要部门权限验证
  description?: string;
}

/**
 * API权限配置
 * 采用最小权限原则，明确定义每个接口的访问要求
 * 权限代码与 seed 脚本保持一致
 */
export const API_PERMISSION_CONFIG: PermissionRule[] = [
  // ===== 用户管理 =====
  {
    path: "/users",
    method: "GET",
    permissions: ["USER_MANAGE"],
    description: "查看用户列表",
  },
  {
    path: "/users/:id",
    method: "GET",
    permissions: ["USER_MANAGE"],
    description: "查看用户详情",
  },
  {
    path: "/users",
    method: "POST",
    permissions: ["USER_CREATE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "创建用户",
  },
  {
    path: "/users/:id",
    method: "PUT",
    permissions: ["USER_EDIT"],
    description: "更新用户信息",
  },
  {
    path: "/users/:id",
    method: "DELETE",
    permissions: ["USER_DELETE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "删除用户",
  },
  {
    path: "/users/:id/reset-password",
    method: "POST",
    permissions: ["USER_RESET_PASSWORD"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "重置用户密码",
  },
  {
    path: "/users/import",
    method: "POST",
    permissions: ["USER_IMPORT"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "批量导入用户",
  },
  {
    path: "/users/export",
    method: "GET",
    permissions: ["USER_EXPORT"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "批量导出用户",
  },

  // ===== 部门管理 =====
  {
    path: "/departments",
    method: "GET",
    permissions: ["DEPT_MANAGE"],
    description: "查看部门列表",
  },
  {
    path: "/departments/:id",
    method: "GET",
    permissions: ["DEPT_MANAGE"],
    description: "查看部门详情",
  },
  {
    path: "/departments",
    method: "POST",
    permissions: ["DEPT_CREATE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "创建部门",
  },
  {
    path: "/departments/:id",
    method: "PUT",
    permissions: ["DEPT_EDIT"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "更新部门",
  },
  {
    path: "/departments/:id",
    method: "DELETE",
    permissions: ["DEPT_DELETE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "删除部门",
  },

  // ===== 角色管理 =====
  {
    path: "/roles",
    method: "GET",
    permissions: ["ROLE_MANAGE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "查看角色列表",
  },
  {
    path: "/roles/:id",
    method: "GET",
    permissions: ["ROLE_MANAGE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "查看角色详情",
  },
  {
    path: "/roles",
    method: "POST",
    permissions: ["ROLE_CREATE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "创建角色",
  },
  {
    path: "/roles/:id",
    method: "PUT",
    permissions: ["ROLE_EDIT"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "更新角色",
  },
  {
    path: "/roles/:id",
    method: "DELETE",
    permissions: ["ROLE_DELETE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "删除角色",
  },
  {
    path: "/roles/:id/permissions",
    method: "POST",
    permissions: ["ROLE_ASSIGN_PERMISSION"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "分配角色权限",
  },

  // ===== 组织管理 =====
  {
    path: "/organizations",
    method: "GET",
    permissions: ["ORG_MANAGE"],
    roles: ["SUPER_ADMIN"],
    description: "查看组织列表",
  },
  {
    path: "/organizations/:id",
    method: "GET",
    permissions: ["ORG_MANAGE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "查看组织详情",
  },
  {
    path: "/organizations",
    method: "POST",
    permissions: ["ORG_CREATE"],
    roles: ["SUPER_ADMIN"],
    description: "创建组织",
  },
  {
    path: "/organizations/:id",
    method: "PUT",
    permissions: ["ORG_EDIT"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "更新组织",
  },
  {
    path: "/organizations/:id",
    method: "DELETE",
    permissions: ["ORG_DELETE"],
    roles: ["SUPER_ADMIN"],
    description: "删除组织",
  },

  // ===== 岗位管理 =====
  {
    path: "/posts",
    method: "GET",
    permissions: ["POST_MANAGE"],
    description: "查看岗位列表",
  },
  {
    path: "/posts/:id",
    method: "GET",
    permissions: ["POST_MANAGE"],
    description: "查看岗位详情",
  },
  {
    path: "/posts",
    method: "POST",
    permissions: ["POST_CREATE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "创建岗位",
  },
  {
    path: "/posts/:id",
    method: "PUT",
    permissions: ["POST_EDIT"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "更新岗位",
  },
  {
    path: "/posts/:id",
    method: "DELETE",
    permissions: ["POST_DELETE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "删除岗位",
  },
  {
    path: "/posts/:id/status",
    method: "PATCH",
    permissions: ["POST_STATUS_CHANGE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "更新岗位状态",
  },

  // ===== 候选人管理 =====
  {
    path: "/candidates",
    method: "GET",
    permissions: ["CANDIDATE_MANAGE"],
    department: true,
    description: "查看候选人列表（限部门）",
  },
  {
    path: "/candidates/:id",
    method: "GET",
    permissions: ["CANDIDATE_MANAGE"],
    description: "查看候选人详情",
  },
  {
    path: "/candidates",
    method: "POST",
    permissions: ["CANDIDATE_CREATE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "创建候选人",
  },
  {
    path: "/candidates/:id",
    method: "PUT",
    permissions: ["CANDIDATE_EDIT"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "更新候选人信息",
  },
  {
    path: "/candidates/:id",
    method: "DELETE",
    permissions: ["CANDIDATE_DELETE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "删除候选人",
  },
  {
    path: "/candidates/:id/status",
    method: "PATCH",
    permissions: ["CANDIDATE_STATUS_CHANGE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "更新候选人状态",
  },
  {
    path: "/candidates/import",
    method: "POST",
    permissions: ["CANDIDATE_IMPORT"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "批量导入候选人",
  },
  {
    path: "/candidates/export",
    method: "GET",
    permissions: ["CANDIDATE_EXPORT"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "批量导出候选人",
  },

  // ===== 面试管理 =====
  {
    path: "/interviews",
    method: "GET",
    permissions: ["INTERVIEW_MANAGE"],
    description: "查看面试列表",
  },
  {
    path: "/interviews/:id",
    method: "GET",
    permissions: ["INTERVIEW_MANAGE"],
    description: "查看面试详情",
  },
  {
    path: "/interviews",
    method: "POST",
    permissions: ["INTERVIEW_CREATE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "创建面试",
  },
  {
    path: "/interviews/:id",
    method: "PUT",
    permissions: ["INTERVIEW_EDIT"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "更新面试信息",
  },
  {
    path: "/interviews/:id",
    method: "DELETE",
    permissions: ["INTERVIEW_DELETE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR"],
    description: "删除面试",
  },
  {
    path: "/interviews/:id/start",
    method: "POST",
    permissions: ["INTERVIEW_START"],
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
    permissions: ["INTERVIEW_CANCEL"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "取消面试",
  },
  {
    path: "/interviews/:id/feedback",
    method: "POST",
    permissions: ["INTERVIEW_FEEDBACK"],
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
    permissions: ["TODO_VIEW"],
    description: "查看评估列表（我的待办）",
  },
  {
    path: "/assessments/:id",
    method: "GET",
    permissions: ["TODO_VIEW"],
    description: "查看评估详情",
  },
  {
    path: "/assessments",
    method: "POST",
    permissions: ["ASSESSMENT_ASSIGN"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "分配评估任务",
  },
  {
    path: "/assessments/:id",
    method: "PUT",
    permissions: ["ASSESSMENT_EXECUTE"],
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
    permissions: ["ASSESSMENT_CONFIRM"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "HR", "DEPARTMENT_LEADER"],
    description: "确认评估结果",
  },

  // ===== 文件管理 =====
  {
    path: "/files/upload",
    method: "POST",
    permissions: ["FILE_UPLOAD"],
    description: "上传文件",
  },
  {
    path: "/files/:id",
    method: "GET",
    permissions: ["FILE_UPLOAD"], // 有上传权限的才能下载
    description: "下载文件",
  },
  {
    path: "/files/:id",
    method: "DELETE",
    permissions: ["FILE_DELETE"],
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
    description: "删除文件",
  },

  // ===== 通知管理 =====
  {
    path: "/notifications",
    method: "GET",
    description: "查看通知列表（无需特殊权限，已认证用户可查看）",
  },
  {
    path: "/notifications/:id",
    method: "PUT",
    description: "标记通知已读（无需特殊权限）",
  },

  // ===== 统计分析 =====
  {
    path: "/analytics",
    method: "GET",
    permissions: ["ANALYTICS_VIEW"],
    description: "查看统计分析",
  },
  {
    path: "/analytics/department",
    method: "GET",
    permissions: ["ANALYTICS_VIEW_DEPT"],
    department: true,
    description: "查看部门统计分析",
  },

  // ===== 系统日志 =====
  {
    path: "/logs",
    method: "GET",
    permissions: ["LOG_VIEW"],
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
