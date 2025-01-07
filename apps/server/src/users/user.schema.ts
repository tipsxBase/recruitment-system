import { z } from 'zod';

export const userSchema = z.object({
  username: z.string().trim().optional(),
  email: z.string().email().optional(),
});

export type UserDto = z.infer<typeof userSchema>;
