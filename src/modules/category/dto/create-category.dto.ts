import z from 'zod';

export const createCategorySchema = z.strictObject({
  name: z.string().min(3).max(10),
  description: z.string().min(3).max(1000).optional(),
  brands: z.array(z.string()).optional(),
});

export type CreateCategorydDto = z.infer<typeof createCategorySchema>;
