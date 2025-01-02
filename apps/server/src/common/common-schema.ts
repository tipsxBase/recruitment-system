import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().int().min(1, '页码最小为1').default(1),
  pageSize: z.number().int().min(1, '每页数量最小为1').default(10),
});
