import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().trim().min(1, "用户名不能为空"),
  password: z.string().trim().min(1, "密码不能为空"),
});
export type SignInbDto = z.infer<typeof signInSchema>;

export const loginSchema = z.object({
  email: z.string().email("请输入正确的邮箱地址"),
  password: z
    .string()
    .min(1, {
      message: "请输入密码",
    })
    .min(6, {
      message: "密码至少6位",
    }),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email("请输入正确的邮箱地址"),
  password: z.string().min(6, "密码至少6位").max(50, "密码最多50位"),
  name: z.string().min(1, "请输入姓名").max(50, "姓名最多50位"),
  phone: z.string().optional(),
  workId: z.string().optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "请输入当前密码"),
  newPassword: z.string().min(6, "新密码至少6位").max(50, "新密码最多50位"),
});

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email("请输入正确的邮箱地址"),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
