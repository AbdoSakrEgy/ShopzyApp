import z from 'zod';

export const createBrandSchema = z.strictObject({
  name: z.string().min(3).max(10),
});

export type CreateBrandDto = z.infer<typeof createBrandSchema>;
