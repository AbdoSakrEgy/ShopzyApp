import z from 'zod';

export const createBrandSchema = z.strictObject({
  name: z.string().min(3).max(10),
  createdBy: z.string(),
});

export type CreateBrandDto = z.infer<typeof createBrandSchema>;
