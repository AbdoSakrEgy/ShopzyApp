import z from 'zod';

// updateOrderSchema
export const updateOrderSchema = z.strictObject({
  address: z.string().optional(),
  phone: z.string().optional(),
});
export type UpdateOrderDto = z.infer<typeof updateOrderSchema>;
