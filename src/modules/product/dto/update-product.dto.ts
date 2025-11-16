import z from 'zod';

export const updateProductSchema = z.strictObject({
  name: z.string().min(3).max(10).optional(),
  description: z.string().min(3).max(1000).optional(),
  originalPrice: z.coerce.number().optional(),
  discountPresent: z.coerce.number().optional(),
  salePrice: z.coerce.number().optional(),
  stock: z.coerce.number().optional(),
  soldItems: z.coerce.number().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
