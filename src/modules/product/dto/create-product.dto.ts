import z from 'zod';

export const createProductSchema = z.strictObject({
  name: z.string().min(3).max(10),
  description: z.string().min(3).max(1000).optional(),
  originalPrice: z.coerce.number(),
  discountPresent: z.coerce.number().optional(),
  salePrice: z.coerce.number(),
  stock: z.coerce.number(),
  soldItems: z.coerce.number().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
