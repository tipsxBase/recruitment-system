import { z } from 'zod';

export const signInSchema = z.object({
  username: z.string().trim().min(1, '用户名不能为空'),
  password: z.string().trim().min(1, '密码不能为空'),
});
export type SignInbDto = z.infer<typeof signInSchema>;
