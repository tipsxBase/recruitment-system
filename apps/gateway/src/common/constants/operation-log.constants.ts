/**
 * 操作日志常量定义
 * 根据 Prisma Schema 中的 OperationLog 模型定义
 * 用于统一管理系统中所有操作的日志记录标识，避免魔法字符串
 */

// 操作类型常量 - 定义系统中所有可记录的操作类型
export const LOG_ACTIONS = {
  // 用户相关操作
  USER_LOGIN: "USER_LOGIN", // 用户登录
  USER_LOGOUT: "USER_LOGOUT", // 用户退出登录
  USER_REGISTER: "USER_REGISTER", // 用户注册
  USER_CREATE: "USER_CREATE", // 创建用户（管理员操作）
  USER_UPDATE: "USER_UPDATE", // 更新用户信息
  USER_DELETE: "USER_DELETE", // 删除用户
  USER_ACTIVATE: "USER_ACTIVATE", // 激活用户账号
  USER_DEACTIVATE: "USER_DEACTIVATE", // 停用用户账号

  // 密码相关操作
  PASSWORD_CHANGE: "PASSWORD_CHANGE", // 修改密码
  PASSWORD_RESET: "PASSWORD_RESET", // 重置密码

  // 角色权限相关操作
  ROLE_ASSIGN: "ROLE_ASSIGN", // 分配角色
  ROLE_REVOKE: "ROLE_REVOKE", // 撤销角色
  PERMISSION_GRANT: "PERMISSION_GRANT", // 授予权限
  PERMISSION_REVOKE: "PERMISSION_REVOKE", // 撤销权限

  // 部门相关操作
  DEPARTMENT_CREATE: "DEPARTMENT_CREATE", // 创建部门
  DEPARTMENT_UPDATE: "DEPARTMENT_UPDATE", // 更新部门信息
  DEPARTMENT_DELETE: "DEPARTMENT_DELETE", // 删除部门

  // 岗位相关操作
  POST_CREATE: "POST_CREATE", // 创建招聘岗位
  POST_UPDATE: "POST_UPDATE", // 更新岗位信息
  POST_DELETE: "POST_DELETE", // 删除岗位
  POST_OPEN: "POST_OPEN", // 开放岗位招聘
  POST_PAUSE: "POST_PAUSE", // 暂停岗位招聘
  POST_CLOSE: "POST_CLOSE", // 关闭岗位招聘

  // 候选人相关操作
  CANDIDATE_CREATE: "CANDIDATE_CREATE", // 创建候选人档案
  CANDIDATE_UPDATE: "CANDIDATE_UPDATE", // 更新候选人信息
  CANDIDATE_DELETE: "CANDIDATE_DELETE", // 删除候选人档案
  CANDIDATE_STATUS_CHANGE: "CANDIDATE_STATUS_CHANGE", // 变更候选人状态
  CANDIDATE_ASSESSMENT: "CANDIDATE_ASSESSMENT", // 候选人评估

  // 面试相关操作
  INTERVIEW_CREATE: "INTERVIEW_CREATE", // 创建面试安排
  INTERVIEW_UPDATE: "INTERVIEW_UPDATE", // 更新面试信息
  INTERVIEW_DELETE: "INTERVIEW_DELETE", // 删除面试安排
  INTERVIEW_SCHEDULE: "INTERVIEW_SCHEDULE", // 安排面试时间
  INTERVIEW_RESCHEDULE: "INTERVIEW_RESCHEDULE", // 重新安排面试时间
  INTERVIEW_CANCEL: "INTERVIEW_CANCEL", // 取消面试
  INTERVIEW_COMPLETE: "INTERVIEW_COMPLETE", // 完成面试
  INTERVIEW_FEEDBACK: "INTERVIEW_FEEDBACK", // 提交面试反馈

  // 文件相关操作
  FILE_UPLOAD: "FILE_UPLOAD", // 上传文件（简历、附件等）
  FILE_DOWNLOAD: "FILE_DOWNLOAD", // 下载文件
  FILE_DELETE: "FILE_DELETE", // 删除文件

  // 通知相关操作
  NOTIFICATION_SEND: "NOTIFICATION_SEND", // 发送通知
  NOTIFICATION_READ: "NOTIFICATION_READ", // 标记通知为已读
  NOTIFICATION_DELETE: "NOTIFICATION_DELETE", // 删除通知

  // 系统相关操作
  SYSTEM_BACKUP: "SYSTEM_BACKUP", // 系统备份
  SYSTEM_RESTORE: "SYSTEM_RESTORE", // 系统恢复
  SYSTEM_CONFIG_UPDATE: "SYSTEM_CONFIG_UPDATE", // 更新系统配置

  // 数据导入导出操作
  DATA_EXPORT: "DATA_EXPORT", // 数据导出
  DATA_IMPORT: "DATA_IMPORT", // 数据导入
} as const;

// 业务模块常量 - 定义系统中的业务模块分类
export const LOG_MODULES = {
  AUTH: "AUTH", // 认证模块（登录、注册、密码等）
  USER: "USER", // 用户管理模块
  ROLE: "ROLE", // 角色管理模块
  PERMISSION: "PERMISSION", // 权限管理模块
  DEPARTMENT: "DEPARTMENT", // 部门管理模块
  POST: "POST", // 岗位管理模块
  CANDIDATE: "CANDIDATE", // 候选人管理模块
  INTERVIEW: "INTERVIEW", // 面试管理模块
  ASSESSMENT: "ASSESSMENT", // 评估管理模块
  NOTIFICATION: "NOTIFICATION", // 通知管理模块
  FILE: "FILE", // 文件管理模块
  SYSTEM: "SYSTEM", // 系统管理模块
} as const;

// 对象类型常量 - 定义操作对象的类型，对应 Prisma Schema 中的实体模型
export const LOG_OBJECT_TYPES = {
  USER: "User", // 用户实体
  ROLE: "Role", // 角色实体
  PERMISSION: "Permission", // 权限实体
  DEPARTMENT: "Department", // 部门实体
  POST: "Post", // 岗位实体
  CANDIDATE: "Candidate", // 候选人实体
  INTERVIEW: "Interview", // 面试实体
  INTERVIEW_TASK: "InterviewTask", // 面试任务实体
  ASSESSMENT: "DepartmentAssessment", // 部门评估实体
  NOTIFICATION: "Notification", // 通知实体
  ATTACHMENT: "Attachment", // 附件实体
} as const;

// 操作结果常量 - 定义操作执行的结果状态（对应 Prisma Schema 中的 LogResult enum）
export const LOG_RESULTS = {
  SUCCESS: "SUCCESS", // 操作成功
  FAILED: "FAILED", // 操作失败
  PARTIAL: "PARTIAL", // 部分成功（批量操作中部分成功）
} as const;

// TypeScript 类型定义 - 提供类型安全的常量类型
export type LogAction = (typeof LOG_ACTIONS)[keyof typeof LOG_ACTIONS]; // 操作类型
export type LogModule = (typeof LOG_MODULES)[keyof typeof LOG_MODULES]; // 业务模块类型
export type LogObjectType = // 对象类型
  (typeof LOG_OBJECT_TYPES)[keyof typeof LOG_OBJECT_TYPES];
export type LogResult = (typeof LOG_RESULTS)[keyof typeof LOG_RESULTS]; // 操作结果类型
