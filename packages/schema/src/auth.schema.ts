import { z } from "zod";
import {
  UUIDSchema,
  EmailSchema,
  PasswordSchema,
  PaginationParamsSchema,
  UserStatusSchema,
} from "./common.schema.js";

// 发送邮箱验证码请求
export const SendVerificationCodeRequestSchema = z.object({
  email: EmailSchema,
});

// 发送邮箱验证码响应
export const SendVerificationCodeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  expiresIn: z.number(), // 验证码有效期（秒）
});

// 注册请求
export const RegisterRequestSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少3位")
    .max(20, "用户名最多20位")
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
  email: EmailSchema,
  password: PasswordSchema,
  emailVerificationCode: z
    .string()
    .length(6, "验证码必须是6位")
    .regex(/^\d{6}$/, "验证码必须是数字"),
});

// 注册响应
export const RegisterResponseSchema = z.object({
  id: UUIDSchema,
  username: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  message: z.string(),
});

// 登录请求
export const LoginRequestSchema = z.object({
  username: z
    .string()
    .min(1, "用户名或邮箱不能为空")
    .min(3, "输入内容至少3位")
    .max(50, "输入内容过长")
    .refine((value) => {
      // 检查是否是邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value)) {
        return true; // 邮箱格式有效
      }
      // 检查是否是用户名格式
      if (/^[a-zA-Z0-9_]+$/.test(value)) {
        return true; // 用户名格式有效
      }
      return false;
    }, "请输入有效的用户名或邮箱地址"),
  password: z.string().min(1, "密码不能为空"),
  rememberMe: z.boolean().optional().default(false),
});

// 用户信息 Schema
export const UserSchema = z.object({
  id: UUIDSchema,
  username: z.string(),
  email: z.string().optional(),
  emailVerified: z.boolean(),
  employeeNo: z.string().optional(),
  phone: z.string().optional(),
  status: UserStatusSchema,
  department: z
    .object({
      id: UUIDSchema,
      name: z.string(),
      parent: z
        .object({
          id: UUIDSchema,
          name: z.string(),
        })
        .optional(),
    })
    .optional(),
  roles: z.array(
    z.object({
      id: UUIDSchema,
      name: z.string(),
      code: z.string(),
      description: z.string().optional(),
    })
  ),
  permissions: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 登录响应
export const LoginResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

// 忘记密码请求
export const ForgotPasswordRequestSchema = z.object({
  email: EmailSchema,
});

// 忘记密码响应
export const ForgotPasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// 重置密码请求
export const ResetPasswordRequestSchema = z
  .object({
    token: z.string(),
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次密码输入不一致",
    path: ["confirmPassword"],
  });

// 重置密码响应
export const ResetPasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// 刷新Token请求
export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

// 刷新Token响应
export const RefreshTokenResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

// 获取当前用户响应
export const GetCurrentUserResponseSchema = UserSchema;

// 修改密码请求
export const ChangePasswordRequestSchema = z
  .object({
    oldPassword: z.string().min(1, "当前密码不能为空"),
    newPassword: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "两次密码输入不一致",
    path: ["confirmPassword"],
  });

// 修改密码响应
export const ChangePasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// 更新个人信息请求
export const UpdateProfileRequestSchema = z.object({
  email: EmailSchema.optional(),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, "请输入正确的手机号码")
    .optional(),
  employeeNo: z.string().max(20, "工号最多20位").optional(),
});

// 更新个人信息响应
export const UpdateProfileResponseSchema = UserSchema;

// 类型导出
export type SendVerificationCodeRequest = z.infer<
  typeof SendVerificationCodeRequestSchema
>;
export type SendVerificationCodeResponse = z.infer<
  typeof SendVerificationCodeResponseSchema
>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type User = z.infer<typeof UserSchema>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ForgotPasswordResponse = z.infer<
  typeof ForgotPasswordResponseSchema
>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export type ResetPasswordResponse = z.infer<typeof ResetPasswordResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export type GetCurrentUserResponse = z.infer<
  typeof GetCurrentUserResponseSchema
>;
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
export type ChangePasswordResponse = z.infer<
  typeof ChangePasswordResponseSchema
>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;
