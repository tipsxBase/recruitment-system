/**
 * 招聘系统数据库初始化脚本 (Database Seed Script)
 *
 * 功能说明：
 * 1. 创建完整的权限体系和角色结构
 * 2. 创建超级管理员账号用于系统管理
 *
 * 使用方法：
 * npm run db:seed 或 pnpm db:seed
 *
 * 注意事项：
 * - 生产环境请立即修改超级管理员默认密码
 * - 系统采用多租户架构，组织数据需要在系统中创建
 *
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 开始执行系统初始化数据 seed...");

  try {
    // 1. 创建系统权限（必需）
    // 包含菜单权限和按钮权限，构建完整的权限树结构
    // 注意：已将"评估管理"功能整合到"待办事项"中，避免功能重复
    await createPermissions();

    // 2. 创建内置角色（必需）
    // 基于权限创建系统预定义角色，支持不同层级的用户管理
    await createRoles();

    // 3. 创建超级管理员（必需）
    // 系统冷启动必需的超级管理员账号，用于初始系统管理
    await createSuperAdmin();

    console.log("✅ 系统初始化数据 seed 执行完成！");
    console.log("📝 系统初始化完成，请按以下步骤继续：");
    console.log(
      "   1. 使用超级管理员账号登录系统 (superadmin/superadmin@system)"
    );
    console.log("   2. 创建第一个组织");
    console.log("   3. 在组织下创建部门结构");
    console.log("   4. 创建组织管理员账号");
    console.log("   5. 开始正常的招聘业务操作");
    console.log("");
    console.log("💡 系统特性：");
    console.log("   - 多租户架构：支持多个组织独立管理");
    console.log("   - 权限控制：基于角色的精细化权限管理");
    console.log("   - 招聘流程：候选人 → 评估 → 面试 → 录用");
    console.log("   - 待办统一：评估和面试任务统一在待办事项中管理");
  } catch (error) {
    console.error("❌ Seed 执行失败:", error);
    throw error;
  }
}

async function cleanDatabase() {
  console.log("🧹 清理现有数据（仅开发环境）...");

  // 按数据库外键依赖关系倒序删除，避免外键约束错误
  // 最深层级的业务数据先删除
  await prisma.candidateStatusHistory.deleteMany(); // 候选人状态历史
  await prisma.interviewTask.deleteMany(); // 面试任务
  await prisma.interview.deleteMany(); // 面试记录
  await prisma.departmentAssessment.deleteMany(); // 部门评估
  await prisma.candidate.deleteMany(); // 候选人
  await prisma.post.deleteMany(); // 职位
  await prisma.notification.deleteMany(); // 通知
  await prisma.operationLog.deleteMany(); // 操作日志
  await prisma.attachment.deleteMany(); // 附件
  await prisma.emailVerificationCode.deleteMany(); // 邮箱验证码

  // 用户相关数据
  await prisma.userRole.deleteMany(); // 用户角色关联
  await prisma.user.deleteMany(); // 用户

  // 组织架构数据
  await prisma.department.deleteMany(); // 部门

  // 权限系统数据
  await prisma.role.deleteMany(); // 角色
  await prisma.permission.deleteMany(); // 权限

  // 最顶层的组织数据最后删除
  await prisma.organization.deleteMany(); // 组织

  console.log("✅ 数据清理完成");
}

async function createPermissions() {
  console.log("🔐 创建系统权限...");

  // ==================== 一级菜单权限 ====================
  // 系统核心功能模块的顶级菜单权限
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
  // 系统管理模块下的二级菜单权限
  const userManageMenu = await prisma.permission.create({
    data: {
      id: "perm-user-manage",
      name: "用户管理",
      code: "USER_MANAGE",
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

  const orgManageMenu = await prisma.permission.create({
    data: {
      id: "perm-org-manage",
      name: "组织管理",
      code: "ORG_MANAGE",
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
  // 招聘业务模块下的二级菜单权限
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

  // ==================== 按钮权限定义 ====================
  // 各功能模块下的具体操作权限
  const buttonPermissions = [
    // 用户管理相关按钮权限
    { name: "新增用户", code: "USER_CREATE", parentId: userManageMenu.id },
    { name: "编辑用户", code: "USER_EDIT", parentId: userManageMenu.id },
    { name: "删除用户", code: "USER_DELETE", parentId: userManageMenu.id },
    {
      name: "重置密码",
      code: "USER_RESET_PASSWORD",
      parentId: userManageMenu.id,
    },
    { name: "导入用户", code: "USER_IMPORT", parentId: userManageMenu.id },
    { name: "导出用户", code: "USER_EXPORT", parentId: userManageMenu.id },

    // 部门管理相关按钮权限
    { name: "新增部门", code: "DEPT_CREATE", parentId: deptManageMenu.id },
    { name: "编辑部门", code: "DEPT_EDIT", parentId: deptManageMenu.id },
    { name: "删除部门", code: "DEPT_DELETE", parentId: deptManageMenu.id },

    // 角色管理相关按钮权限
    { name: "新增角色", code: "ROLE_CREATE", parentId: roleManageMenu.id },
    { name: "编辑角色", code: "ROLE_EDIT", parentId: roleManageMenu.id },
    { name: "删除角色", code: "ROLE_DELETE", parentId: roleManageMenu.id },
    {
      name: "分配权限",
      code: "ROLE_ASSIGN_PERMISSION",
      parentId: roleManageMenu.id,
    },

    // 组织管理相关按钮权限
    { name: "新增组织", code: "ORG_CREATE", parentId: orgManageMenu.id },
    { name: "编辑组织", code: "ORG_EDIT", parentId: orgManageMenu.id },
    { name: "删除组织", code: "ORG_DELETE", parentId: orgManageMenu.id },

    // 岗位管理相关按钮权限
    { name: "新增岗位", code: "POST_CREATE", parentId: postManageMenu.id },
    { name: "编辑岗位", code: "POST_EDIT", parentId: postManageMenu.id },
    { name: "删除岗位", code: "POST_DELETE", parentId: postManageMenu.id },
    {
      name: "岗位状态变更",
      code: "POST_STATUS_CHANGE",
      parentId: postManageMenu.id,
    },

    // 候选人管理相关按钮权限
    {
      name: "新增候选人",
      code: "CANDIDATE_CREATE",
      parentId: candidateManageMenu.id,
    },
    {
      name: "编辑候选人",
      code: "CANDIDATE_EDIT",
      parentId: candidateManageMenu.id,
    },
    {
      name: "删除候选人",
      code: "CANDIDATE_DELETE",
      parentId: candidateManageMenu.id,
    },
    {
      name: "候选人状态变更",
      code: "CANDIDATE_STATUS_CHANGE",
      parentId: candidateManageMenu.id,
    },
    {
      name: "导入候选人",
      code: "CANDIDATE_IMPORT",
      parentId: candidateManageMenu.id,
    },
    {
      name: "导出候选人",
      code: "CANDIDATE_EXPORT",
      parentId: candidateManageMenu.id,
    },

    // 面试管理相关按钮权限
    {
      name: "创建面试",
      code: "INTERVIEW_CREATE",
      parentId: interviewManageMenu.id,
    },
    {
      name: "编辑面试",
      code: "INTERVIEW_EDIT",
      parentId: interviewManageMenu.id,
    },
    {
      name: "取消面试",
      code: "INTERVIEW_CANCEL",
      parentId: interviewManageMenu.id,
    },
    {
      name: "开始面试",
      code: "INTERVIEW_START",
      parentId: interviewManageMenu.id,
    },
    {
      name: "提交反馈",
      code: "INTERVIEW_FEEDBACK",
      parentId: interviewManageMenu.id,
    },

    // ==================== 待办事项相关权限 ====================
    // 优化后的待办权限，统一管理评估和面试等任务
    { name: "查看待办", code: "TODO_VIEW", parentId: todoManageMenu.id },
    {
      name: "分配评估",
      code: "ASSESSMENT_ASSIGN",
      parentId: todoManageMenu.id,
    },
    {
      name: "执行评估",
      code: "ASSESSMENT_EXECUTE",
      parentId: todoManageMenu.id,
    },
    {
      name: "确认评估",
      code: "ASSESSMENT_CONFIRM",
      parentId: todoManageMenu.id,
    },

    // 通用功能权限（不归属特定菜单）
    { name: "上传文件", code: "FILE_UPLOAD", parentId: null },
    { name: "删除文件", code: "FILE_DELETE", parentId: null },

    // 统计分析相关权限
    { name: "查看统计", code: "ANALYTICS_VIEW", parentId: analyticsMenu.id },
    {
      name: "查看部门统计",
      code: "ANALYTICS_VIEW_DEPT",
      parentId: analyticsMenu.id,
    },

    // 系统日志权限
    { name: "查看日志", code: "LOG_VIEW", parentId: systemMenu.id },
  ];

  // 批量创建按钮权限
  for (const perm of buttonPermissions) {
    await prisma.permission.create({
      data: {
        id: `perm-${perm.code.toLowerCase().replace(/_/g, "-")}`,
        name: perm.name,
        code: perm.code,
        type: "BUTTON",
        parentId: perm.parentId,
      },
    });
  }

  console.log("✅ 系统权限创建完成");
  console.log(`   📊 共创建 ${4} 个一级菜单`);
  console.log(`   📁 共创建 ${7} 个二级菜单`);
  console.log(`   🔘 共创建 ${buttonPermissions.length} 个按钮权限`);
}

async function createRoles() {
  console.log("👥 创建系统内置角色...");

  // 获取所有已创建的权限，用于角色权限分配
  const allPermissions = await prisma.permission.findMany();

  // ==================== 超级管理员角色 ====================
  // 系统最高权限角色，拥有所有权限，用于系统初始化和紧急管理
  const superAdmin = await prisma.role.create({
    data: {
      id: "role-super-admin",
      name: "超级管理员",
      code: "SUPER_ADMIN",
      description: "系统超级管理员，拥有所有权限，用于系统初始化和紧急管理",
      isSystem: true,
      permissions: {
        connect: allPermissions.map((p) => ({ id: p.id })),
      },
    },
  });

  // ==================== 组织管理员角色 ====================
  // 组织级别的管理员，在组织内拥有几乎所有权限
  // 排除：创建/删除组织（避免影响其他组织）
  const orgAdminPermissions = allPermissions.filter(
    (p) => !p.code?.includes("ORG_CREATE") && !p.code?.includes("ORG_DELETE")
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

  // ==================== HR专员角色 ====================
  // 人力资源专员，主要负责招聘流程的管理和执行
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

  // ==================== 部门负责人角色 ====================
  // 部门负责人，主要负责本部门的评估和面试工作
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

  // ==================== 面试官角色 ====================
  // 面试官，主要负责执行面试和评估工作
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

  console.log("✅ 系统角色创建完成");
  console.log(`   👑 超级管理员：${allPermissions.length} 个权限`);
  console.log(`   🏢 组织管理员：${orgAdminPermissions.length} 个权限`);
  console.log(`   👔 HR专员：${hrPermissions.length} 个权限`);
  console.log(`   👨‍💼 部门负责人：${deptLeaderPermissions.length} 个权限`);
  console.log(`   🎯 面试官：${interviewerPermissions.length} 个权限`);
}

async function createSuperAdmin() {
  console.log("🔑 创建超级管理员账号...");

  // ==================== 密码加密 ====================
  // 使用bcrypt对默认密码进行加密，提高安全性
  // 默认密码：superadmin@system
  const hashedPassword = await bcrypt.hash("superadmin@system", 10);

  // ==================== 创建超级管理员用户 ====================
  // 系统冷启动必需的管理员账号，用于后续的组织和用户管理
  const superAdmin = await prisma.user.create({
    data: {
      id: "user-super-admin",
      username: "superadmin", // 登录用户名
      password: hashedPassword, // 加密后的密码
      email: "superadmin@system.local", // 系统邮箱
      emailVerified: true, // 邮箱已验证
      employeeNo: "SUPER001", // 员工编号
      status: "ACTIVE", // 账号状态：激活
      // 注意：超级管理员不归属任何组织和部门
      // 这样可以跨组织进行管理
    },
  });

  // ==================== 分配超级管理员角色 ====================
  // 将用户与超级管理员角色进行关联
  await prisma.userRole.create({
    data: {
      userId: superAdmin.id,
      roleId: "role-super-admin",
    },
  });

  console.log("✅ 超级管理员账号创建完成");
  console.log("   📧 邮箱: superadmin@system.local");
  console.log("   � 用户名: superadmin");
}

main()
  .catch((e) => {
    console.error("❌ Seed 脚本执行失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
