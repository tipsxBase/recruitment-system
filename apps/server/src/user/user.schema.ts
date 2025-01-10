import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int().positive().optional(),
  username: z.string().trim().optional(),
  email: z.string().email().optional(),
});

export type UserDto = z.infer<typeof userSchema>;
