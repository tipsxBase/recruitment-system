import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().trim().min(1, "用户名不能为空"),
  password: z.string().trim().min(1, "密码不能为空"),
});
export type SignInbDto = z.infer<typeof signInSchema>;

export const loginSchema = z.object({
  username: z.string().min(1, { message: "请输入用户名" }),
  password: z
    .string()
    .min(1, {
      message: "请输入密码",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
});

export type LoginForm = z.infer<typeof loginSchema>;
