import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@recruitment/database";
import {
  LOG_ACTIONS,
  LOG_MODULES,
  LOG_OBJECT_TYPES,
  LOG_RESULTS,
  type LogAction,
  type LogModule,
  type LogObjectType,
  type LogResult,
} from "../constants/operation-log.constants";

export interface OperationLogData {
  userId: string;
  action: LogAction;
  module: LogModule;
  objectType?: LogObjectType;
  objectId?: string;
  objectName?: string;
  details?: any;
  result?: LogResult;
  errorMsg?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class OperationLogService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 记录操作日志
   */
  async log(data: OperationLogData): Promise<void> {
    try {
      await this.prisma.operationLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          module: data.module,
          objectType: data.objectType || null,
          objectId: data.objectId || null,
          objectName: data.objectName || null,
          details: data.details ? JSON.stringify(data.details) : null,
          result: data.result || LOG_RESULTS.SUCCESS,
          errorMsg: data.errorMsg || null,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      // 日志记录失败不应该影响主业务流程
      console.error("记录操作日志失败:", error);
    }
  }

  /**
   * 记录认证相关操作 - 支持无用户ID的情况
   */
  async logAuth(
    action:
      | typeof LOG_ACTIONS.USER_LOGIN
      | typeof LOG_ACTIONS.USER_LOGOUT
      | typeof LOG_ACTIONS.USER_REGISTER,
    userId: string,
    result: typeof LOG_RESULTS.SUCCESS | typeof LOG_RESULTS.FAILED,
    options: {
      email?: string;
      ipAddress?: string;
      userAgent?: string;
      errorMsg?: string;
      details?: any;
    } = {}
  ): Promise<void> {
    // 对于登录失败等情况，如果userId为unknown，则跳过日志记录
    // 或者可以创建一个系统用户ID用于记录这类操作
    if (userId === "unknown") {
      console.log(
        `跳过操作日志记录 - 无有效用户ID: ${action} ${result} ${options.email}`
      );
      return;
    }

    await this.log({
      userId,
      action,
      module: LOG_MODULES.AUTH,
      objectType: LOG_OBJECT_TYPES.USER,
      objectId: userId,
      objectName: options.email,
      details: options.details,
      result,
      errorMsg: options.errorMsg,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
    });
  }

  /**
   * 记录密码操作
   */
  async logPasswordOperation(
    action:
      | typeof LOG_ACTIONS.PASSWORD_CHANGE
      | typeof LOG_ACTIONS.PASSWORD_RESET,
    userId: string,
    result: typeof LOG_RESULTS.SUCCESS | typeof LOG_RESULTS.FAILED,
    options: {
      ipAddress?: string;
      userAgent?: string;
      errorMsg?: string;
    } = {}
  ): Promise<void> {
    await this.log({
      userId,
      action,
      module: LOG_MODULES.AUTH,
      objectType: LOG_OBJECT_TYPES.USER,
      objectId: userId,
      result,
      errorMsg: options.errorMsg,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
    });
  }

  /**
   * 记录用户管理操作
   */
  async logUserOperation(
    action:
      | typeof LOG_ACTIONS.USER_CREATE
      | typeof LOG_ACTIONS.USER_UPDATE
      | typeof LOG_ACTIONS.USER_DELETE
      | typeof LOG_ACTIONS.USER_ACTIVATE
      | typeof LOG_ACTIONS.USER_DEACTIVATE,
    operatorId: string,
    targetUserId: string,
    result: typeof LOG_RESULTS.SUCCESS | typeof LOG_RESULTS.FAILED,
    options: {
      targetUserName?: string;
      ipAddress?: string;
      userAgent?: string;
      errorMsg?: string;
      details?: any;
    } = {}
  ): Promise<void> {
    await this.log({
      userId: operatorId,
      action,
      module: LOG_MODULES.USER,
      objectType: LOG_OBJECT_TYPES.USER,
      objectId: targetUserId,
      objectName: options.targetUserName,
      details: options.details,
      result,
      errorMsg: options.errorMsg,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
    });
  }

  /**
   * 记录权限操作
   */
  async logPermissionOperation(
    action:
      | typeof LOG_ACTIONS.PERMISSION_GRANT
      | typeof LOG_ACTIONS.PERMISSION_REVOKE
      | typeof LOG_ACTIONS.ROLE_ASSIGN
      | typeof LOG_ACTIONS.ROLE_REVOKE,
    operatorId: string,
    targetUserId: string,
    result: typeof LOG_RESULTS.SUCCESS | typeof LOG_RESULTS.FAILED,
    options: {
      targetUserName?: string;
      permissionDetails?: any;
      ipAddress?: string;
      userAgent?: string;
      errorMsg?: string;
    } = {}
  ): Promise<void> {
    await this.log({
      userId: operatorId,
      action,
      module: LOG_MODULES.PERMISSION,
      objectType: LOG_OBJECT_TYPES.USER,
      objectId: targetUserId,
      objectName: options.targetUserName,
      details: options.permissionDetails,
      result,
      errorMsg: options.errorMsg,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
    });
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
