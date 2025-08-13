/**
 * 招聘系统数据库初始化脚本 - 新角色架构版本
 *
 * 新架构特点：
 * 1. 超级管理员：唯一系统账号，纯系统管理，不参与业务
 * 2. 组织管理员：组织内业务管理
 * 3. 权限明确分离：系统权限 vs 业务权限
 *
 * 角色职责：
 * - 超级管理员(SUPER_ADMIN): 组织管理、用户分配、系统监控、系统配置（唯一账号）
 * - 组织管理员(ORG_ADMIN): 组织内用户、部门、招聘等业务管理
 * - HR管理员(HR_MANAGER): HR专业工作
 * - 部门负责人(DEPT_LEADER): 部门级招聘管理
 * - 面试官(INTERVIEWER): 面试执行
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 开始执行新架构系统初始化数据 seed...");

  try {
    // 清理现有数据（开发环境）
    if (process.env.NODE_ENV !== "production") {
      await cleanDatabase();
    }

    // 1. 创建新架构权限体系
    await createNewPermissions();

    // 2. 创建新架构角色
    await createNewRoles();

    // 3. 创建超级管理员（纯系统管理）
    await createSystemSuperAdmin();

    console.log("✅ 新架构系统初始化数据 seed 执行完成！");
    console.log("📝 新架构初始化完成，请按以下步骤继续：");
    console.log("   1. 使用超级管理员账号登录系统 (superadmin/superadmin@123)");
    console.log("   2. 超级管理员创建第一个组织");
    console.log("   3. 在组织下创建组织管理员账号");
    console.log("   4. 组织管理员创建部门结构和业务用户");
    console.log("   5. 开始正常的招聘业务操作");
    console.log("");
    console.log("💡 新架构特性：");
    console.log("   - 职责分离：超级管理员专管系统，不参与业务");
    console.log("   - 唯一账号：超级管理员是系统唯一的管理账号");
    console.log("   - 权限清晰：系统权限与业务权限明确分离");
    console.log("   - 用户分配：超级管理员负责为注册用户分配组织");
    console.log("   - 安全性高：避免系统管理与业务管理的权限混淆");
  } catch (error) {
    console.error("❌ 新架构 Seed 执行失败:", error);
    throw error;
  }
}

async function cleanDatabase() {
  console.log("🧹 清理现有数据（仅开发环境）...");

  // 按依赖关系倒序删除
  await prisma.candidateStatusHistory.deleteMany();
  await prisma.interviewTask.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.departmentAssessment.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.post.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.operationLog.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.emailVerificationCode.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();

  console.log("✅ 数据清理完成");
}

async function createNewPermissions() {
  console.log("🔐 创建新架构权限体系...");

  // ==================== 系统级权限（仅超级管理员） ====================
  console.log("   📋 创建系统级权限...");

  // 系统监控菜单
  const systemMonitorMenu = await prisma.permission.create({
    data: {
      id: "perm-system-monitor",
      name: "系统监控",
      code: "SYSTEM_MONITOR",
      type: "MENU",
    },
  });

  // 系统配置菜单
  const systemConfigMenu = await prisma.permission.create({
    data: {
      id: "perm-system-config",
      name: "系统配置",
      code: "SYSTEM_CONFIG",
      type: "MENU",
    },
  });

  // 组织管理菜单（系统级 - 属于超级管理员）
  const orgSystemManageMenu = await prisma.permission.create({
    data: {
      id: "perm-org-system-manage",
      name: "组织管理",
      code: "ORG_SYSTEM_MANAGE",
      type: "MENU",
    },
  });

  // 用户分配管理菜单（系统级 - 属于超级管理员）
  const userAssignManageMenu = await prisma.permission.create({
    data: {
      id: "perm-user-assign-manage",
      name: "用户分配管理",
      code: "USER_ASSIGN_MANAGE",
      type: "MENU",
    },
  });

  // 系统级按钮权限
  await prisma.permission.createMany({
    data: [
      // 系统监控按钮
      {
        name: "查看系统状态",
        code: "SYSTEM_STATUS_VIEW",
        parentId: systemMonitorMenu.id,
        type: "BUTTON",
      },
      {
        name: "查看系统日志",
        code: "SYSTEM_LOG_VIEW",
        parentId: systemMonitorMenu.id,
        type: "BUTTON",
      },

      // 系统配置按钮
      {
        name: "数据备份",
        code: "SYSTEM_BACKUP",
        parentId: systemConfigMenu.id,
        type: "BUTTON",
      },
      {
        name: "数据恢复",
        code: "SYSTEM_RESTORE",
        parentId: systemConfigMenu.id,
        type: "BUTTON",
      },
      {
        name: "系统设置",
        code: "SYSTEM_SETTINGS",
        parentId: systemConfigMenu.id,
        type: "BUTTON",
      },

      // 组织管理按钮（系统级）
      {
        name: "新增组织",
        code: "ORG_CREATE",
        parentId: orgSystemManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "编辑组织",
        code: "ORG_EDIT",
        parentId: orgSystemManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "删除组织",
        code: "ORG_DELETE",
        parentId: orgSystemManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "查看组织",
        code: "ORG_VIEW",
        parentId: orgSystemManageMenu.id,
        type: "BUTTON",
      },

      // 用户分配管理按钮（处理无组织用户分配）
      {
        name: "为用户分配组织",
        code: "USER_ASSIGN_ORG",
        parentId: userAssignManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "转移用户组织",
        code: "USER_TRANSFER_ORG",
        parentId: userAssignManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "查看无组织用户",
        code: "USER_VIEW_UNASSIGNED",
        parentId: userAssignManageMenu.id,
        type: "BUTTON",
      },
    ],
  });

  // ==================== 业务级权限（完全保持原有结构） ====================
  console.log("   📋 创建业务级权限（保持原有结构）...");

  // ==================== 一级菜单权限 ====================
  const dashboardMenu = await prisma.permission.create({
    data: {
      id: "perm-dashboard",
      name: "首页",
      code: "DASHBOARD",
      type: "MENU",
    },
  });

  const systemMenu = await prisma.permission.create({
    data: {
      id: "perm-system",
      name: "系统管理",
      code: "SYSTEM",
      type: "MENU",
    },
  });

  // ==================== 系统管理子菜单 ====================
  const orgUserManageMenu = await prisma.permission.create({
    data: {
      id: "perm-org-user-manage",
      name: "组织用户管理",
      code: "ORG_USER_MANAGE",
      type: "MENU",
      parentId: systemMenu.id,
    },
  });

  const deptManageMenu = await prisma.permission.create({
    data: {
      id: "perm-dept-manage",
      name: "部门管理",
      code: "DEPT_MANAGE",
      type: "MENU",
      parentId: systemMenu.id,
    },
  });

  const roleManageMenu = await prisma.permission.create({
    data: {
      id: "perm-role-manage",
      name: "角色管理",
      code: "ROLE_MANAGE",
      type: "MENU",
      parentId: systemMenu.id,
    },
  });

  // ==================== 招聘管理菜单 ====================
  const recruitmentMenu = await prisma.permission.create({
    data: {
      id: "perm-recruitment",
      name: "招聘管理",
      code: "RECRUITMENT",
      type: "MENU",
    },
  });

  // ==================== 招聘管理子菜单 ====================
  const postManageMenu = await prisma.permission.create({
    data: {
      id: "perm-post-manage",
      name: "岗位管理",
      code: "POST_MANAGE",
      type: "MENU",
      parentId: recruitmentMenu.id,
    },
  });

  const candidateManageMenu = await prisma.permission.create({
    data: {
      id: "perm-candidate-manage",
      name: "候选人管理",
      code: "CANDIDATE_MANAGE",
      type: "MENU",
      parentId: recruitmentMenu.id,
    },
  });

  const interviewManageMenu = await prisma.permission.create({
    data: {
      id: "perm-interview-manage",
      name: "面试管理",
      code: "INTERVIEW_MANAGE",
      type: "MENU",
      parentId: recruitmentMenu.id,
    },
  });

  const analyticsMenu = await prisma.permission.create({
    data: {
      id: "perm-analytics",
      name: "统计分析",
      code: "ANALYTICS",
      type: "MENU",
    },
  });

  // ==================== 待办事项菜单 ====================
  const todoManageMenu = await prisma.permission.create({
    data: {
      id: "perm-todo-manage",
      name: "我的待办",
      code: "TODO_MANAGE",
      type: "MENU",
    },
  });

  // ==================== 按钮权限定义（完全保持原有） ====================
  await prisma.permission.createMany({
    data: [
      // 组织用户管理相关按钮权限（区别于系统用户管理）
      {
        name: "新增用户",
        code: "ORG_USER_CREATE",
        parentId: orgUserManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "邀请用户",
        code: "ORG_USER_INVITE",
        parentId: orgUserManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "编辑用户",
        code: "ORG_USER_EDIT",
        parentId: orgUserManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "删除用户",
        code: "ORG_USER_DELETE",
        parentId: orgUserManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "重置密码",
        code: "ORG_USER_RESET_PASSWORD",
        parentId: orgUserManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "停用用户",
        code: "ORG_USER_DISABLE",
        parentId: orgUserManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "启用用户",
        code: "ORG_USER_ENABLE",
        parentId: orgUserManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "导入用户",
        code: "ORG_USER_IMPORT",
        parentId: orgUserManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "导出用户",
        code: "ORG_USER_EXPORT",
        parentId: orgUserManageMenu.id,
        type: "BUTTON",
      },

      // 部门管理相关按钮权限
      {
        name: "新增部门",
        code: "DEPT_CREATE",
        parentId: deptManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "编辑部门",
        code: "DEPT_EDIT",
        parentId: deptManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "删除部门",
        code: "DEPT_DELETE",
        parentId: deptManageMenu.id,
        type: "BUTTON",
      },

      // 角色管理相关按钮权限
      {
        name: "新增角色",
        code: "ROLE_CREATE",
        parentId: roleManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "编辑角色",
        code: "ROLE_EDIT",
        parentId: roleManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "删除角色",
        code: "ROLE_DELETE",
        parentId: roleManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "分配权限",
        code: "ROLE_ASSIGN_PERMISSION",
        parentId: roleManageMenu.id,
        type: "BUTTON",
      },

      // 岗位管理相关按钮权限
      {
        name: "新增岗位",
        code: "POST_CREATE",
        parentId: postManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "编辑岗位",
        code: "POST_EDIT",
        parentId: postManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "删除岗位",
        code: "POST_DELETE",
        parentId: postManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "岗位状态变更",
        code: "POST_STATUS_CHANGE",
        parentId: postManageMenu.id,
        type: "BUTTON",
      },

      // 候选人管理相关按钮权限
      {
        name: "新增候选人",
        code: "CANDIDATE_CREATE",
        parentId: candidateManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "编辑候选人",
        code: "CANDIDATE_EDIT",
        parentId: candidateManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "删除候选人",
        code: "CANDIDATE_DELETE",
        parentId: candidateManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "候选人状态变更",
        code: "CANDIDATE_STATUS_CHANGE",
        parentId: candidateManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "导入候选人",
        code: "CANDIDATE_IMPORT",
        parentId: candidateManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "导出候选人",
        code: "CANDIDATE_EXPORT",
        parentId: candidateManageMenu.id,
        type: "BUTTON",
      },

      // 面试管理相关按钮权限
      {
        name: "创建面试",
        code: "INTERVIEW_CREATE",
        parentId: interviewManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "编辑面试",
        code: "INTERVIEW_EDIT",
        parentId: interviewManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "取消面试",
        code: "INTERVIEW_CANCEL",
        parentId: interviewManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "开始面试",
        code: "INTERVIEW_START",
        parentId: interviewManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "提交反馈",
        code: "INTERVIEW_FEEDBACK",
        parentId: interviewManageMenu.id,
        type: "BUTTON",
      },

      // ==================== 待办事项相关权限 ====================
      {
        name: "查看待办",
        code: "TODO_VIEW",
        parentId: todoManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "分配评估",
        code: "ASSESSMENT_ASSIGN",
        parentId: todoManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "执行评估",
        code: "ASSESSMENT_EXECUTE",
        parentId: todoManageMenu.id,
        type: "BUTTON",
      },
      {
        name: "确认评估",
        code: "ASSESSMENT_CONFIRM",
        parentId: todoManageMenu.id,
        type: "BUTTON",
      },

      // 通用功能权限
      { name: "上传文件", code: "FILE_UPLOAD", parentId: null, type: "BUTTON" },
      { name: "删除文件", code: "FILE_DELETE", parentId: null, type: "BUTTON" },

      // 统计分析相关权限
      {
        name: "查看统计",
        code: "ANALYTICS_VIEW",
        parentId: analyticsMenu.id,
        type: "BUTTON",
      },
      {
        name: "查看部门统计",
        code: "ANALYTICS_VIEW_DEPT",
        parentId: analyticsMenu.id,
        type: "BUTTON",
      },
      {
        name: "导出统计",
        code: "ANALYTICS_EXPORT",
        parentId: analyticsMenu.id,
        type: "BUTTON",
      },
    ],
  });

  console.log("✅ 新架构权限体系创建完成");
}

async function createNewRoles() {
  console.log("🎭 创建新架构角色...");

  // 获取所有权限
  const allPermissions = await prisma.permission.findMany();

  // ==================== 超级管理员角色（新架构：只有系统级权限） ====================
  // 只拥有系统级权限，包括组织管理和用户分配管理，不参与具体业务
  const systemPermissions = allPermissions.filter(
    (p) =>
      p.code?.includes("SYSTEM_") ||
      p.code?.includes("ORG_CREATE") ||
      p.code?.includes("ORG_EDIT") ||
      p.code?.includes("ORG_DELETE") ||
      p.code?.includes("ORG_VIEW") ||
      p.code === "ORG_SYSTEM_MANAGE" ||
      p.code === "USER_ASSIGN_MANAGE" ||
      p.code?.includes("USER_ASSIGN_ORG") ||
      p.code?.includes("USER_TRANSFER_ORG") ||
      p.code?.includes("USER_VIEW_UNASSIGNED")
  );

  const superAdmin = await prisma.role.create({
    data: {
      id: "role-super-admin",
      name: "超级管理员",
      code: "SUPER_ADMIN",
      description:
        "系统唯一超级管理员账号，负责组织管理、用户分配和系统配置，不参与业务流程",
      isSystem: true,
      permissions: {
        connect: systemPermissions.map((p) => ({ id: p.id })),
      },
    },
  });

  // ==================== 组织管理员角色（保持原有，但排除组织管理） ====================
  // 拥有组织内部业务权限，不包含系统级权限和组织管理权限
  const orgAdminPermissions = allPermissions.filter(
    (p) =>
      !p.code?.includes("ORG_CREATE") &&
      !p.code?.includes("ORG_DELETE") &&
      !p.code?.includes("ORG_EDIT") &&
      !p.code?.includes("ORG_VIEW") &&
      !p.code?.includes("SYSTEM_") &&
      p.code !== "ORG_SYSTEM_MANAGE" &&
      p.code !== "USER_ASSIGN_MANAGE" &&
      !p.code?.includes("USER_ASSIGN_ORG") &&
      !p.code?.includes("USER_TRANSFER_ORG") &&
      !p.code?.includes("USER_VIEW_UNASSIGNED")
  );

  const orgAdmin = await prisma.role.create({
    data: {
      id: "role-org-admin",
      name: "组织管理员",
      code: "ORG_ADMIN",
      description:
        "组织管理员，在组织内拥有完整的管理权限，可管理用户、部门、招聘等",
      isSystem: true,
      permissions: {
        connect: orgAdminPermissions.map((p) => ({ id: p.id })),
      },
    },
  });

  // ==================== HR专员角色（保持原有） ====================
  const hrPermissions = allPermissions.filter((p) => {
    const code = p.code || "";
    return [
      // 基础权限
      "DASHBOARD",

      // 岗位管理权限
      "POST_MANAGE",
      "POST_CREATE",
      "POST_EDIT",
      "POST_STATUS_CHANGE",

      // 候选人管理权限
      "CANDIDATE_MANAGE",
      "CANDIDATE_CREATE",
      "CANDIDATE_EDIT",
      "CANDIDATE_IMPORT",
      "CANDIDATE_EXPORT",
      "CANDIDATE_STATUS_CHANGE",

      // 面试管理权限
      "INTERVIEW_MANAGE",
      "INTERVIEW_CREATE",
      "INTERVIEW_CANCEL",

      // 待办事项权限（包含评估相关）
      "TODO_MANAGE",
      "TODO_VIEW",

      // 统计分析权限
      "ANALYTICS_VIEW",

      // 文件管理权限
      "FILE_UPLOAD",
      "FILE_DELETE",
    ].includes(code);
  });

  const hr = await prisma.role.create({
    data: {
      id: "role-hr",
      name: "HR专员",
      code: "HR",
      description:
        "HR专员，负责招聘流程管理、候选人管理、面试安排等人力资源工作",
      isSystem: true,
      permissions: {
        connect: hrPermissions.map((p) => ({ id: p.id })),
      },
    },
  });

  // ==================== 部门负责人角色（保持原有） ====================
  const deptLeaderPermissions = allPermissions.filter((p) => {
    const code = p.code || "";
    return [
      // 基础权限
      "DASHBOARD",

      // 待办事项权限（核心职责）
      "TODO_MANAGE",
      "TODO_VIEW",

      // 评估相关权限（分配、执行、确认评估）
      "ASSESSMENT_ASSIGN",
      "ASSESSMENT_EXECUTE",
      "ASSESSMENT_CONFIRM",

      // 面试管理权限（查看权限）
      "INTERVIEW_MANAGE",

      // 部门级统计分析权限
      "ANALYTICS_VIEW_DEPT",

      // 文件上传权限
      "FILE_UPLOAD",
    ].includes(code);
  });

  const deptLeader = await prisma.role.create({
    data: {
      id: "role-dept-leader",
      name: "部门负责人",
      code: "DEPARTMENT_LEADER",
      description: "部门负责人，负责本部门候选人评估、面试安排和团队招聘决策",
      isSystem: true,
      permissions: {
        connect: deptLeaderPermissions.map((p) => ({ id: p.id })),
      },
    },
  });

  // ==================== 面试官角色（保持原有） ====================
  const interviewerPermissions = allPermissions.filter((p) => {
    const code = p.code || "";
    return [
      // 基础权限
      "DASHBOARD",

      // 待办事项权限
      "TODO_MANAGE",
      "TODO_VIEW",

      // 评估执行权限
      "ASSESSMENT_EXECUTE",

      // 面试相关权限
      "INTERVIEW_MANAGE",
      "INTERVIEW_START",
      "INTERVIEW_FEEDBACK",

      // 文件上传权限
      "FILE_UPLOAD",
    ].includes(code);
  });

  const interviewer = await prisma.role.create({
    data: {
      id: "role-interviewer",
      name: "面试官",
      code: "INTERVIEWER",
      description: "面试官，负责执行候选人面试、提交面试反馈和候选人评估",
      isSystem: true,
      permissions: {
        connect: interviewerPermissions.map((p) => ({ id: p.id })),
      },
    },
  });

  console.log("✅ 新架构角色创建完成");
  console.log(
    `   👑 超级管理员：${systemPermissions.length} 个权限（仅系统级）`
  );
  console.log(`   🏢 组织管理员：${orgAdminPermissions.length} 个权限`);
  console.log(`   � HR专员：${hrPermissions.length} 个权限`);
  console.log(`   👨‍💼 部门负责人：${deptLeaderPermissions.length} 个权限`);
  console.log(`   🎯 面试官：${interviewerPermissions.length} 个权限`);
}

async function createSystemSuperAdmin() {
  console.log("🔑 创建系统超级管理员账号...");

  // 创建密码哈希
  const hashedPassword = await bcrypt.hash("superadmin@123", 10);

  // 创建超级管理员用户
  const superAdminUser = await prisma.user.create({
    data: {
      id: "user-super-admin",
      username: "superadmin",
      email: "superadmin@system.local",
      emailVerified: true, // 系统账号默认邮箱已验证
      phone: null,
      password: hashedPassword,
      status: "ACTIVE",
      // 超级管理员不归属任何部门
      departmentId: null,
    },
  });

  // 分配超级管理员角色
  const superAdminRole = await prisma.role.findUnique({
    where: { code: "SUPER_ADMIN" },
  });

  await prisma.userRole.create({
    data: {
      userId: superAdminUser.id,
      roleId: superAdminRole!.id,
    },
  });

  console.log("✅ 系统超级管理员账号创建完成");
  console.log("   📧 用户名: superadmin");
  console.log("   🔐 密码: superadmin@123");
  console.log("   🎯 职责: 纯系统管理，不参与业务");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
